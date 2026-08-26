import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const InviteMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).default("VIEWER"),
});

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const members = await db.user.findMany({
      where: { workspaceId: sessionUser.workspaceId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ data: members });
  } catch (err) {
    return NextResponse.json({ error: "Fetch Members Error", message: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(["ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const validated = InviteMemberSchema.parse(body);
    const email = validated.email.toLowerCase().trim();

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User Exists", message: "A user with this email address already exists." },
        { status: 400 }
      );
    }

    const defaultPasswordHash = await bcrypt.hash("admin123", 10);

    const newMember = await db.user.create({
      data: {
        name: validated.name.trim(),
        email,
        passwordHash: defaultPasswordHash,
        role: validated.role,
        workspaceId: sessionUser.workspaceId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Invite Error", message: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(["ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
      return NextResponse.json({ error: "Validation Error", message: "Invalid user ID or role." }, { status: 400 });
    }

    const targetUser = await db.user.findFirst({
      where: { id: userId, workspaceId: sessionUser.workspaceId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Not Found", message: "Member not found." }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Update Member Error", message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(["ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Validation Error", message: "userId query parameter required." }, { status: 400 });
    }

    if (userId === sessionUser.id) {
      return NextResponse.json({ error: "Forbidden", message: "You cannot remove yourself from the workspace." }, { status: 400 });
    }

    const targetUser = await db.user.findFirst({
      where: { id: userId, workspaceId: sessionUser.workspaceId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Not Found", message: "Member not found." }, { status: 404 });
    }

    await db.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true, id: userId });
  } catch (err) {
    return NextResponse.json({ error: "Remove Member Error", message: (err as Error).message }, { status: 500 });
  }
}
