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

    // Verify user owns this deal
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        salesRepId: session.user.id,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const activities = await prisma.activity.findMany({
      where: { dealId },
      orderBy: { activityDate: "desc" },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
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

    // Verify user owns this deal
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        salesRepId: session.user.id,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, subject, notes, activityDate, nextSteps, nextStepsDue } = body;

    if (!type || !subject) {
      return NextResponse.json(
        { error: "Type and subject are required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        dealId,
        type,
        subject,
        notes: notes || null,
        activityDate: activityDate ? new Date(activityDate) : new Date(),
        nextSteps: nextSteps || null,
        nextStepsDue: nextStepsDue ? new Date(nextStepsDue) : null,
      },
    });

    // Update deal's updatedAt timestamp
    await prisma.deal.update({
      where: { id: dealId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
