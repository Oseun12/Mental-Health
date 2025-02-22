import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileJournalList from "@/components/ProfileJournalList";
import MoodTracker from "@/components/MoodTracker";
import { authOptions } from "@/utils/auth-options";


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
        {session.user.image && (
          <Image src={session.user.image} alt="Profile Picture" width={50} height={50} className="rounded-full" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
      </div>

      {/* Mood History */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Mood Check-In History</h3>
        <MoodTracker />
      </div>

      {/* Journal Entries */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Your Journal Entries</h3>
        <ProfileJournalList />
      </div>
    </div>
  );
}
