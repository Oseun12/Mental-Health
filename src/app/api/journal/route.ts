import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectViaMongoose from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]";
import Journal from "@/models/Journal";


// 📌 Save a new journal entry
export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    const newEntry = await Journal.create({ userId: session.user.id, title, content });

    return NextResponse.json({ message: "Journal saved", entry: newEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save journal", error }, { status: 500 });
  }
}

// 📌 Fetch all journal entries for the logged-in user
export async function GET() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journals = await Journal.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ journals });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch journals", error }, { status: 500 });
  }
}
