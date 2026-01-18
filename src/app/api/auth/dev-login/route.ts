import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEV_PASSWORD = "dev123";
const DEV_EMAIL = "dev@crm-lite.local";
const DEV_NAME = "Dev User";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Check dev password
    if (password !== DEV_PASSWORD) {
      return NextResponse.json({ error: "Invalid dev password" }, { status: 401 });
    }

    // Find or create dev user
    let user = await prisma.user.findUnique({
      where: { email: DEV_EMAIL },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(DEV_PASSWORD, 10);
      user = await prisma.user.create({
        data: {
          email: DEV_EMAIL,
          passwordHash: hashedPassword,
          name: DEV_NAME,
          role: "SALES_REP",
          salesGoal: 500000,
        },
      });
    }

    return NextResponse.json({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ error: "Dev login failed" }, { status: 500 });
  }
}
