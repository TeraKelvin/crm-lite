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

    const { id } = await params;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        files: session.user.role === "CLIENT"
          ? { where: { category: "EXTERNAL" }, orderBy: { uploadedAt: "desc" } }
          : { orderBy: { uploadedAt: "desc" } },
        contacts: session.user.role === "SALES_REP"
          ? { orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }] }
          : false,
        competitors: session.user.role === "SALES_REP"
          ? { orderBy: { createdAt: "desc" } }
          : false,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role === "SALES_REP" && deal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (session.user.role === "CLIENT") {
      if (deal.clientCompanyName !== session.user.companyName) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (!["QUOTED", "WON"].includes(deal.stage)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
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

    if (session.user.role !== "SALES_REP") {
      return NextResponse.json(
        { error: "Only sales reps can update deals" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (existingDeal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      dealName,
      clientCompanyName,
      dealValue,
      grossProfit,
      stage,
      // Forecasting fields
      expectedCloseDate,
      probability,
      forecastCategory,
      // MEDDIC fields
      meddic_metrics,
      meddic_economicBuyer,
      meddic_decisionCriteria,
      meddic_decisionProcess,
      meddic_identifyPain,
      meddic_champion,
    } = body;

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        ...(dealName && { dealName }),
        ...(clientCompanyName && { clientCompanyName }),
        ...(dealValue !== undefined && { dealValue: parseFloat(dealValue) }),
        ...(grossProfit !== undefined && { grossProfit: parseFloat(grossProfit) }),
        ...(stage && { stage }),
        // Forecasting
        ...(expectedCloseDate !== undefined && {
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        }),
        ...(probability !== undefined && { probability: parseInt(probability) }),
        ...(forecastCategory && { forecastCategory }),
        // MEDDIC
        ...(meddic_metrics !== undefined && { meddic_metrics }),
        ...(meddic_economicBuyer !== undefined && { meddic_economicBuyer }),
        ...(meddic_decisionCriteria !== undefined && { meddic_decisionCriteria }),
        ...(meddic_decisionProcess !== undefined && { meddic_decisionProcess }),
        ...(meddic_identifyPain !== undefined && { meddic_identifyPain }),
        ...(meddic_champion !== undefined && { meddic_champion }),
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SALES_REP") {
      return NextResponse.json(
        { error: "Only sales reps can delete deals" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (existingDeal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deal deleted" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
