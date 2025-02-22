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
  
      // Analyze sentiment score
      const sentiment = new Sentiment();
      const analysis = sentiment.analyze(note || "");
      const sentimentScore = analysis.score; 
  
      const newMood = await Mood.create({
        userId: session.user.id,
        mood,
        note,
        sentimentScore, // Save sentiment score
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const moods = (await Mood.find({ userId: session.user.id }).sort({ createdAt: -1 })) || [];
  
      console.log("Fetched Moods:", moods); // Debugging: See what’s returned
  
      const averageSentiment =
        moods.length > 0
          ? moods.reduce((sum, m) => sum + (m.sentimentScore || 0), 0) / moods.length
          : 0;
  
      return NextResponse.json({ averageSentiment, moods: Array.isArray(moods) ? moods : [] }, { status: 200 });
    } catch (error) {
      console.error("Mood Fetch Error:", error); // Debugging
      return NextResponse.json({ message: "Failed to fetch moods", error }, { status: 500 });
    }
  }
  
  