import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const report = await db.report.findFirst({
      where: {
        id: params.id,
        workspaceId: sessionUser.workspaceId,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Not Found", message: "Report not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: report.id,
      title: report.title,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      createdAt: report.createdAt,
      generatedBy: report.user?.name || "System",
      content: JSON.parse(report.contentJson),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Fetch Report Error", message: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { sessionUser, errorResponse } = await requireRole(["ADMIN", "ANALYST"]);
  if (errorResponse) return errorResponse;

  try {
    const report = await db.report.findFirst({
      where: { id: params.id, workspaceId: sessionUser.workspaceId },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Not Found", message: "Report not found or access denied." },
        { status: 404 }
      );
    }

    await db.report.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, id: params.id });
  } catch (err) {
    return NextResponse.json(
      { error: "Delete Report Error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
