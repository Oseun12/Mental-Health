// app/api/mood/trends/route.ts
import { NextResponse } from "next/server";
import Mood from "@/models/Mood";
import connectViaMongoose from "@/lib/db";

export const GET = async () => {
  try {
    await connectViaMongoose();

    // Get moods from last 30 days, sorted by date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await Mood.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    if (moods.length === 0) {
      return NextResponse.json({
        moods: [],
        averageSentiment: 0,
        highestScore: 0,
        lowestScore: 0,
        trend: "no data"
      });
    }

    // Calculate statistics
    const scores = moods.map(m => m.sentimentScore);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    // Determine trend (compare first and last 7 days if available)
    let trend = "stable";
    if (moods.length >= 14) {
      const firstWeek = moods.slice(0, 7);
      const lastWeek = moods.slice(-7);
      const firstAvg = firstWeek.reduce((sum, m) => sum + m.sentimentScore, 0) / firstWeek.length;
      const lastAvg = lastWeek.reduce((sum, m) => sum + m.sentimentScore, 0) / lastWeek.length;
      
      if (lastAvg > firstAvg + 0.5) trend = "improving";
      else if (lastAvg < firstAvg - 0.5) trend = "declining";
    }

    return NextResponse.json({
      moods: moods.map(m => ({
        _id: m._id.toString(),
        createdAt: m.createdAt,
        sentimentScore: m.sentimentScore,
        mood: m.mood
      })),
      averageSentiment: parseFloat(average.toFixed(2)),
      highestScore: highest,
      lowestScore: lowest,
      trend
    });

  } catch (error) {
    console.error("Failed to fetch mood trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch mood trends" },
      { status: 500 }
    );
  }
};