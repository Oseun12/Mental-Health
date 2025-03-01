import connectViaMongoose from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectViaMongoose();
  const user = await User.findOne({
    where: { email: session.user?.email },
    select: { name: true, email: true, bio: true, goal: true, theme: true, notifications: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectViaMongoose();
  const { name, bio, goal, theme, notifications } = await req.json();

  const updatedUser = await User.findByIdAndUpdate({
    where: { email: session.user?.email },
    data: { name, bio, goal, theme, notifications },
  });

  return NextResponse.json(updatedUser);
}
