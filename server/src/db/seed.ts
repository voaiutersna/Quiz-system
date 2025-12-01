import { db } from "./index";
import { users } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");
  
  // Create test users
  await db.insert(users).values([
    {
      email: "admin@example.com",
      name: "Admin User",
      emailVerified: true,
    },
    {
      email: "user@example.com",
      name: "Regular User",
      emailVerified: true,
    },
  ]);
  
  console.log("✅ Seeding complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });