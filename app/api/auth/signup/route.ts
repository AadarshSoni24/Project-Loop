import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SignupSchema.parse(body);

    const email = validated.email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email In Use", message: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const workspace = await db.workspace.create({
      data: {
        name: validated.workspaceName.trim(),
      },
    });

    const user = await db.user.create({
      data: {
        name: validated.name.trim(),
        email,
        passwordHash,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
    });

    // Seed default starter themes for the new workspace
    const defaultThemes = [
      { name: "Customer Support", color: "#3b82f6" },
      { name: "Product & UX", color: "#10b981" },
      { name: "Billing & Invoicing", color: "#ef4444" },
      { name: "Performance", color: "#f59e0b" },
    ];

    for (const t of defaultThemes) {
      await db.theme.create({
        data: {
          name: t.name,
          color: t.color,
          workspaceId: workspace.id,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: workspace.id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Signup Failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}
