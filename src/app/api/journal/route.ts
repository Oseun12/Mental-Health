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
    // console.log("Fetched Journals:", journals);
    return NextResponse.json({ journals: journals || []  });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch journals", error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, title, content } = await req.json();
    if (!id || !content) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, content },
      { new: true }
    )

    if (!updatedJournal) {
      return NextResponse.json({ message: "Journal not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Journal updated successfully", updatedJournal });
  } catch (error) {
    return NextResponse.json({ message: "Error updating Journal", error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Journal ID is required" }, { status: 400 });
    }
      
    const deleteJournal = await Journal.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deleteJournal) {
      return NextResponse.json({ error: "Journal not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Journal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete journal", error }, { status: 500 });
  }
}