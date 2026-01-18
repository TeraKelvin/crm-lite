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

    const { id: contactId } = await params;

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { deal: true },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.deal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.contact.delete({ where: { id: contactId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
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

    const { id: contactId } = await params;

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { deal: true },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.deal.salesRepId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, title, email, phone, role, notes, isPrimary } = body;

    // If setting as primary, unset other primaries
    if (isPrimary) {
      await prisma.contact.updateMany({
        where: { dealId: contact.dealId, NOT: { id: contactId } },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name,
        title,
        email,
        phone,
        role,
        notes,
        isPrimary,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
