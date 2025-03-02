import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Gratitude from "@/models/Gratitude";
import connectViaMongoose from "@/lib/db";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: Request) {
  await connectViaMongoose();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const gratitudeEntry = await Gratitude.create({
    userId: session.user.id,
    content,
  });

  return NextResponse.json(gratitudeEntry);
}

export async function GET() {
  await connectViaMongoose();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gratitudeEntries = await Gratitude.find({ userId: session.user.id }).sort({ createdAt: -1 });

  return NextResponse.json(gratitudeEntries);
}
