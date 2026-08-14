import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFileSync } from "node:fs";

const productsData = JSON.parse(
  readFileSync(new URL("../scripts/products.json", import.meta.url), "utf8")
);
const blogData = JSON.parse(
  readFileSync(new URL("../scripts/blog.json", import.meta.url), "utf8")
);

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const p of productsData.products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        image: `/products/${p.slug}.svg`,
      },
    });
  }

  for (const b of blogData.blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  console.log(`Seed done: ${productsData.products.length} products, ${blogData.blogPosts.length} blog posts`);
  await prisma.$disconnect();
}

main();