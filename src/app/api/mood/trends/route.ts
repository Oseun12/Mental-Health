import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    moods: [
      { createdAt: new Date().toISOString(), sentimentScore: 3 },
      { createdAt: new Date().toISOString(), sentimentScore: 4 },
    ],
    averageSentiment: 3.5,
  });
}
