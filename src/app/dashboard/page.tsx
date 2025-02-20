import JournalForm from "@/components/Journal";
import JournalList from "@/components/JournalList";
import Mindfulness from "@/components/Mindfulness";
import MoodCheckIn from "@/components/MoodCheckIn";
import MoodHistory from "@/components/MoodHistory";
import MoodTrends from "@/components/MoodTrends";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <MoodCheckIn />
      <MoodHistory />
      <MoodTrends />
      <div className="mt-6">
        <Mindfulness />
      </div>
      <div className="mt-6">
        <JournalForm />
        <JournalList />
      </div>
    </div>
  );
}
