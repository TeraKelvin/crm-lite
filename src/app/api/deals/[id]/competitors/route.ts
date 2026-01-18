import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: dealId } = await params;

    const deal = await prisma.deal.findFirst({
      where: { id: dealId, salesRepId: session.user.id },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const competitors = await prisma.competitor.findMany({
      where: { dealId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(competitors);
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return NextResponse.json({ error: "Failed to fetch competitors" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: dealId } = await params;

    const deal = await prisma.deal.findFirst({
      where: { id: dealId, salesRepId: session.user.id },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, strengths, weaknesses, status, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Competitor name is required" }, { status: 400 });
    }

    const competitor = await prisma.competitor.create({
      data: {
        dealId,
        name,
        strengths: strengths || null,
        weaknesses: weaknesses || null,
        status: status || "ACTIVE",
        notes: notes || null,
      },
    });

    return NextResponse.json(competitor, { status: 201 });
  } catch (error) {
    console.error("Error creating competitor:", error);
    return NextResponse.json({ error: "Failed to create competitor" }, { status: 500 });
  }
}
