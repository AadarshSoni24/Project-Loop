import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const workspace = await db.workspace.findUnique({
      where: { id: sessionUser.workspaceId },
      include: {
        _count: {
          select: {
            users: true,
            feedback: true,
            themes: true,
            reports: true,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Not Found", message: "Workspace not found." }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (err) {
    return NextResponse.json({ error: "Fetch Workspace Error", message: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(["ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Validation Error", message: "Workspace name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const updated = await db.workspace.update({
      where: { id: sessionUser.workspaceId },
      data: { name: name.trim() },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Update Workspace Error", message: (err as Error).message }, { status: 500 });
  }
}
