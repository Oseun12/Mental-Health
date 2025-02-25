import MoodCheckIn from "@/components/MoodCheckIn";
import MoodTrendspro from "@/components/MoodTrends-upgrde";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Notification from "@/components/Notification";
import GratitudeJournal from "@/components/GratitudeJournal";
import DashboardHero from "@/components/DashboardHero";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

  return (
    <div className="p-2">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome{" "}
        <span className="bg-gradient-to-r from-purple-900 via-pink-500 to-blue-500 
                        bg-clip-text text-transparent animate-gradient">
          {session.user?.name}
        </span> 👋
      </h1>
      <DashboardHero/>
      <MoodCheckIn />
      {/* <MoodHistory /> */}
      <MoodTrendspro/>
      <GratitudeJournal />
      <Notification />
    </div>
  );
}