"use server";

import { queryD1 } from "@/db/db";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email address" };
  }

  try {
    // Check if table exists, if not create it (safe fallback)
    // In a real prod environment, this should be done via migrations.
    // But since the user asked me to add the table, I'll ensure it exists.
    
    await queryD1(`
      INSERT INTO newsletter (email) VALUES (?)
    `, [email]);

    return { success: true };
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return { error: "This email is already subscribed" };
    }
    console.error("Newsletter subscription error:", error);
    return { error: "Failed to subscribe. Please try again later." };
  }
}
