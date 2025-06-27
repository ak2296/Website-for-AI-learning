// src/scripts/createAdmin.ts
import { sequelize, Admin } from "../config/database";
import bcrypt from "bcrypt";

(async () => {
  try {
    // No sync needed, just authenticate to ensure connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Clear existing admins (optional, remove if not intended)
    await Admin.destroy({ truncate: true });
    console.log("Existing admins cleared");

    // Prompt for admin details
    const username = await new Promise<string>((resolve) => {
      process.stdout.write("Enter new admin username: ");
      process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });
    const password = await new Promise<string>((resolve) => {
      process.stdout.write("Enter new admin password: ");
      process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });

    // Hash password and create admin with skipHook to avoid re-hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = await Admin.create(
      { username, password: hashedPassword, skipHook: true },
      { raw: true }
    );
    console.log("Admin created successfully. Data:", {
      username: admin.username,
      password: admin.password,
    });

    // Verify
    const verifiedAdmin = await Admin.findOne({ where: { username } });
    if (verifiedAdmin) {
      console.log("Verified admin data from DB:", verifiedAdmin);
    } else {
      console.log("Admin verification failed");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed");
    process.exit(0);
  }
})();