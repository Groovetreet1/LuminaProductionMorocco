import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/lumina";
const needsSsl =
  connectionString.includes("render.com") || process.env.DATABASE_SSL === "true";
const adapter = new PrismaPg({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const orders = await prisma.order.findMany({
    select: { id: true, status: true, createdAt: true, updatedAt: true },
  });

  let created = 0;
  for (const o of orders) {
    const count = await prisma.orderStatusEvent.count({ where: { orderId: o.id } });
    if (count === 0) {
      await prisma.orderStatusEvent.create({
        data: {
          orderId: o.id,
          status: "PENDING",
          note: "Commande passée",
          createdAt: o.createdAt,
        },
      });
      created++;
    }
  }
  console.log(`Orders: ${orders.length}, events created: ${created}`);
}

main().finally(() => prisma.$disconnect());