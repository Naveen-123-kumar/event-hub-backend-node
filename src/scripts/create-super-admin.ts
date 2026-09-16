import bcrypt from "bcrypt";

import { connectDatabase } from "../config/database";
import { env } from "../config/env";

import { User } from "../modules/auth/auth.model";
import { UserRole } from "../modules/auth/auth.types";

const createSuperAdmin = async (): Promise<void> => {
  try {
    await connectDatabase();

    const existingSuperAdmin = await User.findOne({
      role: UserRole.SUPER_ADMIN,
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");

      process.exit(0);
    }

    const email = process.env.SUPER_ADMIN_EMAIL;

    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
      isEmailVerified: true,
      authProvider: "local",
      role: UserRole.SUPER_ADMIN,
      organizationId: null,
    });

    console.log("Super Admin created successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Super Admin:", error);

    process.exit(1);
  }
};

createSuperAdmin();
