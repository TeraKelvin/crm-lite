import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");

    if (session.user.role === "CLIENT") {
      // Clients can only see QUOTED and WON deals for their company
      const deals = await prisma.deal.findMany({
        where: {
          clientCompanyName: session.user.companyName || "",
          stage: {
            in: ["QUOTED", "WON"],
          },
        },
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json(deals);
    }

    // Sales rep can see all their deals
    const deals = await prisma.deal.findMany({
      where: {
        salesRepId: session.user.id,
        ...(stage && { stage }),
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SALES_REP") {
      return NextResponse.json(
        { error: "Only sales reps can create deals" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { dealName, clientCompanyName, dealValue, grossProfit, stage } = body;

    if (!dealName || !clientCompanyName || dealValue === undefined || grossProfit === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        salesRepId: session.user.id,
        dealName,
        clientCompanyName,
        dealValue: parseFloat(dealValue),
        grossProfit: parseFloat(grossProfit),
        stage: stage || "COURTING",
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
