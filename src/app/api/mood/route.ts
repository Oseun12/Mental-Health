import connectViaMongoose from "@/lib/db";
import Sentiment from "sentiment"; 
import Mood from "@/models/Mood"; 
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: NextRequest) {
    try {
      await connectViaMongoose();
      const session = await getServerSession(authOptions);
  
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { mood, note } = await req.json();
      if (!mood) {
        return NextResponse.json({ error: "Mood is required" }, { status: 400 });
      }
  
      const sentiment = new Sentiment();
      const analysis = sentiment.analyze(note || "");
      const sentimentScore = analysis.score; 
  
      const newMood = await Mood.create({
        userId: session.user.id,
        mood,
        note,
        sentimentScore,
      });
  
      return NextResponse.json({ message: "Mood saved successfully", mood: newMood }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
  }


  export async function GET() {
    try {
      await connectViaMongoose();
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json([], { status: 401 }); 
      }
  
      const moods = await Mood.find({ userId: session.user.id }).sort({ createdAt: -1 }) || [];
  
      console.log("Fetched Moods:", moods);
  
      return NextResponse.json(moods, { status: 200 }); 
    } catch (error) {
      console.error("Mood Fetch Error:", error);
      return NextResponse.json([], { status: 500 }); 
    }
  };

  export async function PUT(req: NextRequest) {
    try {
      await connectViaMongoose();
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      const { id, mood, note } = await req.json();
      if (!id || !mood) {
        return NextResponse.json(
          { message: "Mood ID and new mood are required" },
          { status: 400 }
        )
      }

      const updatedMood = await Mood.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        { mood, note },
        { new: true }
      )

      if (!updatedMood) {
        return NextResponse.json({ error: "Mood not found or unauthorized" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Mood updated successfully", mood: updatedMood }, { status: 200 });
    
    } catch (error) {
      return NextResponse.json({ message: "Failed to update mood", error }, { status: 500 });
    }
  }
  

  export async function DELETE(req: NextRequest) {
    try {
      await connectViaMongoose();
      const session = await getServerSession(authOptions);
  
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = await req.json();
      if (!id) {
        return NextResponse.json({ error: "Mood ID is required" }, { status: 400 });
      }
  
      const deletedMood = await Mood.findOneAndDelete({ _id: id, userId: session.user.id });
  
      if (!deletedMood) {
        return NextResponse.json({ error: "Mood not found or unauthorized" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Mood deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Failed to delete mood", error }, { status: 500 });
    }
  }
  
  