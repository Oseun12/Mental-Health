"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function MoodHistory() {
  const { data: session } = useSession();

  const { data: moods, isLoading } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const res = await fetch("/api/mood");
      return res.json();
    },
    enabled: !!session, // Only fetch if user is logged in
  });

  if (isLoading) return <p>Loading mood history...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {moods.moods.length === 0 ? (
        <p>No mood check-ins yet.</p>
      ) : (
        <ul className="space-y-2">
          {moods.moods.map((mood: any) => (
            <li key={mood._id} className="p-2 bg-gray-100 rounded">
              <strong>{mood.mood}</strong> - {new Date(mood.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
