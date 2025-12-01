import "dotenv/config";
import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function addAdmin() {
  const email = "Manel@educentre.fr";
  const password = "ManelBenhamouda1234!";
  const firstName = "Manel";
  const lastName = "Benhamouda";

  console.log(`Adding admin user: ${email}`);

  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      console.log("User already exists. Updating to ADMIN role...");
      await db
        .update(users)
        .set({ role: "ADMIN" })
        .where(eq(users.email, email));
      console.log("User updated to ADMIN successfully!");
    } else {
      // Create new admin user
      const hashedPassword = await hashPassword(password);
      
      await db.insert(users).values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "ADMIN",
      });
      
      console.log("Admin user created successfully!");
    }
    
    console.log(`✅ Admin: ${email}`);
  } catch (error) {
    console.error("Error adding admin user:", error);
    throw error;
  }
}

addAdmin()
  .then(() => {
    console.log("Admin setup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to add admin:", error);
    process.exit(1);
  });
