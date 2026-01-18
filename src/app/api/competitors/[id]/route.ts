import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: competitorId } = await params;

    const competitor = await prisma.competitor.findUnique({
      where: { id: competitorId },
      include: { deal: true },
    });

    if (!competitor) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    if (competitor.deal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.competitor.delete({ where: { id: competitorId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting competitor:", error);
    return NextResponse.json({ error: "Failed to delete competitor" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: competitorId } = await params;

    const competitor = await prisma.competitor.findUnique({
      where: { id: competitorId },
      include: { deal: true },
    });

    if (!competitor) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    if (competitor.deal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, strengths, weaknesses, status, notes } = body;

    const updated = await prisma.competitor.update({
      where: { id: competitorId },
      data: { name, strengths, weaknesses, status, notes },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating competitor:", error);
    return NextResponse.json({ error: "Failed to update competitor" }, { status: 500 });
  }
}
