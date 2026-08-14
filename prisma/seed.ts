import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "node:fs";

const productsData = JSON.parse(
  readFileSync(new URL("../scripts/products.json", import.meta.url), "utf8")
);
const blogData = JSON.parse(
  readFileSync(new URL("../scripts/blog.json", import.meta.url), "utf8")
);

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