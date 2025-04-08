import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";
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

    const { id, content } = await req.json();
    if (!id || !content) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const updatedGratitude = await Gratitude.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { content },
      { new: true }
    );

    if (!updatedGratitude) {
      return NextResponse.json({ message: "Gratitude not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Gratitude updated successfully", updatedGratitude });
  } catch (error) {
    return NextResponse.json({ message: "Error updating Gratitude", error }, { status: 500 });
  }
}



  export async function DELETE(req: Request) {
    try {
      await connectViaMongoose();
      const session = await getServerSession(authOptions);
  
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = await req.json();
      if (!id) {
        return NextResponse.json({ error: "Gratitude ID is required" }, { status: 400 });
      }
  
      const deletedGratitude = await Gratitude.findOneAndDelete({ _id: id, userId: session.user.id });
  
      if (!deletedGratitude) {
        return NextResponse.json({ error: "Gratitude not found or unauthorized" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Gratitude deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Failed to delete gratitude", error }, { status: 500 });
    }
  }