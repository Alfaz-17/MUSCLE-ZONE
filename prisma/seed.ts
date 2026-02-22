import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding with Variant Support...");

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "Admin MuscleZone",
      email: "admin@musclezone.com",
      password: adminPassword,
      phone: "9876543210",
      role: "ADMIN",
    },
  });

  // 3. Load Data from data.txt
  const dataPath = path.join(process.cwd(), "data.txt");
  const dataRaw = fs.readFileSync(dataPath, "utf8");
  
  // data.txt contains two JSON arrays separated by newlines
  const parts = dataRaw.split(/\n\s*\n/);
  const categoriesData = JSON.parse(parts[0]);
  const productsData = JSON.parse(parts[1]);

  console.log(`Loaded ${categoriesData.length} categories and ${productsData.length} product entries.`);

  // 4. Create Categories
  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        imageUrl: `https://images.unsplash.com/photo-1579722820308-d74e571900a3?q=80&w=1000&auto=format&fit=crop` // Placeholder
      }
    });
    categoryMap.set(cat.id, created.id);
  }

  // 5. Group products into variants
  const groupedProducts = new Map();

  for (const item of productsData) {
    // Grouping key: Brand + Base Name (strip quantity)
    // Common patterns: 1KG, 2KG, 300GM, 60 Caps, 60 Tabs, etc.
    const baseName = item.name
      .replace(/\s\d+\s*(KG|GM|Caps|Tabs|Gummies|Srv|Softgels|LBS).*/i, "")
      .replace(/\s(1KG|2KG|3KG|300GM|500GM).*/i, "")
      .trim();
    
    const groupKey = `${item.brand}_${baseName}`.toLowerCase().replace(/[^a-z0-9]/g, "_");

    if (!groupedProducts.has(groupKey)) {
      groupedProducts.set(groupKey, {
        name: baseName,
        brand: item.brand,
        description: item.description || `Premium ${baseName} by ${item.brand}. High quality supplements for your fitness goals.`,
        categoryId: item.categoryId,
        imageUrls: item.imageUrls.length > 0 ? item.imageUrls : [`/p${(Math.floor(Math.random() * 5) + 1)}.jpeg`],
        isBestseller: item.isBestseller,
        status: "ACTIVE",
        productType: item.productType.replace(/\s\d+\s*(KG|GM).*/i, "").trim(),
        variants: []
      });
    }

    const group = groupedProducts.get(groupKey);
    group.variants.push({
      quantityLabel: item.quantity,
      flavor: item.flavors.length > 0 ? item.flavors[0] : null, // Take first flavor if any
      price: item.price,
      mrp: item.mrp || Math.round(item.price * 1.25),
      discount: item.discount || 20,
      tax: item.tax || 18,
      stock: item.stock
    });
  }

  // 6. Create Products and Variants
  for (const [key, data] of groupedProducts.entries()) {
    const product = await prisma.product.create({
      data: {
        id: key,
        name: data.name,
        brand: data.brand,
        description: data.description,
        categoryId: data.categoryId,
        imageUrls: data.imageUrls,
        price: data.variants[0].price,
        mrp: data.variants[0].mrp,
        stock: data.variants.reduce((acc: number, v: any) => acc + v.stock, 0),
        tax: data.variants[0].tax,
        quantity: data.variants[0].quantityLabel,
        flavors: data.variants[0].flavor ? [data.variants[0].flavor] : [],
        isBestseller: data.isBestseller,
        status: data.status,
        productType: data.productType,
        variants: {
          create: data.variants.map((v: any, index: number) => ({
            id: `${key}_var_${index}`,
            quantityLabel: v.quantityLabel,
            flavor: v.flavor,
            price: v.price,
            mrp: v.mrp,
            discount: v.discount,
            tax: v.tax,
            stock: v.stock,
            sku: `${key}_${v.quantityLabel?.replace(/\s/g, "")}_${index}`.toLowerCase()
          }))
        }
      }
    });

    console.log(`Created product: ${product.name} with ${data.variants.length} variants.`);
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
