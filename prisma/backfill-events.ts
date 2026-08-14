import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
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