import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectViaMongoose from "@/lib/db";
import Journal from "@/models/Journal";
import { authOptions } from "@/utils/auth-options";
import Sentiment from "sentiment";

const sentiment = new Sentiment(); 

export async function POST(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    const analysis = sentiment.analyze(content);
    const sentimentScore = analysis.score;
    
    const newEntry = await Journal.create({ userId: session.user.id, title, content, sentimentScore });

    return NextResponse.json({ message: "Journal saved", entry: newEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save journal", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journals = await Journal.find({ userId: session.user.id }).sort({ createdAt: -1 });
    console.log("Fetched Journals:", journals);
    return NextResponse.json({ journals: journals || []  });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch journals", error }, { status: 500 });
  }
}
