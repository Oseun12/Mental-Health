import JournalForm from "@/components/Journal";
import JournalList from "@/components/JournalList";
import Mindfulness from "@/components/Mindfulness";
import MoodCheckIn from "@/components/MoodCheckIn";
import MoodHistory from "@/components/MoodHistory";
import MoodTrends from "@/components/MoodTrends";
import MoodTrendspro from "@/components/MoodTrends-upgrde";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MoodTrendsDashboard from "./mood-trend";
import Link from "next/link";
import MindfulnessDashboard from "./mindfulness";
import { ToastContainer } from "react-toastify";
import Notification from "@/components/Notification";
import GratitudeJournal from "@/components/GratitudeJournal";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

  return (
      <div className="p-6">
     
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <ToastContainer />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>
        <Notification />
        <MoodTrendsDashboard/>
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
        <MoodTrendspro/>
        <MindfulnessDashboard/>
        <GratitudeJournal />
        {/* <Link href="/dashboard/mindfulness">
            <div className="p-4 bg-green-100 rounded-lg shadow cursor-pointer hover:bg-green-200">
              <h2 className="text-xl font-semibold">Mindfulness Exercises</h2>
            </div>
        </Link> */}
        <Link href="/dashboard/dashboard/profile">
          <div className="p-4 bg-yellow-100 rounded-lg shadow cursor-pointer hover:bg-yellow-200">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
          </div>
        </Link>
      
    </div>
  );
}
