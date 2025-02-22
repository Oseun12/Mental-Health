"use client";

import { useQuery } from "@tanstack/react-query";

type MoodEntry = {
  _id: string;
  mood: string;
  createdAt: string;
  note?: string;
};

export default function MoodHistory() {
  const { data, isLoading, error } = useQuery<MoodEntry[]>({
    queryKey: ["moodHistory"],
    queryFn: async (): Promise<MoodEntry[]> => {
      const res = await fetch("/api/mood");
      if (!res.ok) throw new Error("Failed to fetch moods");
      return res.json();
    },
  });

  console.log("MoodHistory data:", data); 

  if (isLoading) return <p>Loading moods...</p>;
  if (error) return <p>Error loading moods.</p>;

  const moodsArray = Array.isArray(data) ? data : [];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Your Mood History</h2>
      {moodsArray.length === 0 ? (
        <p>No mood check-ins yet.</p>
      ) : (
        <ul>
          {moodsArray.map((entry: MoodEntry) => (
            <li key={entry._id} className="p-2 border-b">
              <strong>{entry.mood}</strong> - {new Date(entry.createdAt).toLocaleDateString()}
              {entry.note && <p className="text-gray-600">{entry.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
