import { NextResponse } from "next/server";
import Mood from "@/models/Mood";
import connectViaMongoose from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export const GET = async () => {
  try {
    await connectViaMongoose();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await Mood.find({
      userId: session.user.id, 
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

    const scores = moods.map(m => m.sentimentScore);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

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
