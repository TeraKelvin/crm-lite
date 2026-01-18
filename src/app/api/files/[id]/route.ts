import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

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

    const file = await prisma.file.findUnique({
      where: { id },
      include: { deal: true },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role === "SALES_REP") {
      if (file.deal.salesRepId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (session.user.role === "CLIENT") {
      // Clients can only access EXTERNAL files for their company's deals
      if (file.deal.clientCompanyName !== session.user.companyName) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (file.category !== "EXTERNAL") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (!["QUOTED", "WON"].includes(file.deal.stage)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Read and return file
    const filepath = path.join(process.cwd(), file.filepath);
    const fileBuffer = await readFile(filepath);

    // Determine content type based on file extension
    const ext = path.extname(file.filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".txt": "text/plain",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
