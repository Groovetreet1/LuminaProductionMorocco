import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Traité",
  CONFIRMED: "Traité",
  SHIPPED: "Traité",
  DELIVERED: "Traité",
  CANCELLED: "Traité",
};

const DROPDOWN = ["Pas encore", "En attente", "Traité"];

const HEADERS = [
  "N°",
  "Date",
  "Client",
  "Téléphone",
  "Ville",
  "Adresse",
  "Email",
  "Produits",
  "Total (MAD)",
  "Paiement",
  "Statut",
  "Notes",
  "UTM Source",
  "UTM Campagne",
  "UTM Medium",
  "UTM Content",
];

const COL_WIDTHS = [14, 18, 20, 16, 14, 26, 26, 42, 14, 22, 14, 32, 14, 16, 12, 14];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Commandes", { views: [{ state: "frozen", ySplit: 1 }] });

  ws.addRow(HEADERS);
  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB8860B" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  for (const o of orders) {
    const produits = o.items
      .map((i) => `${i.name} x${i.quantity} (${i.price * i.quantity} MAD)`)
      .join(" | ");
    ws.addRow([
      o.number,
      new Date(o.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
      o.customerName,
      o.phone,
      o.city,
      o.address,
      o.email ?? "",
      produits,
      o.total,
      o.paymentMethod === "COD" ? "Paiement à la livraison" : "Carte (Stripe)",
      STATUS_LABELS[o.status] ?? "Pas encore",
      o.notes ?? "",
      o.utmSource ?? "",
      o.utmCampaign ?? "",
      o.utmMedium ?? "",
      o.utmContent ?? "",
    ]);
  }

  ws.columns.forEach((col, i) => {
    col.width = COL_WIDTHS[i] ?? 14;
  });

  const statutCol = 11;
  for (let r = 2; r <= ws.rowCount; r++) {
    ws.getCell(statutCol, r).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${DROPDOWN.join(",")}"`],
    };
  }

  const buffer = await wb.xlsx.writeBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="lumina-commandes-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}