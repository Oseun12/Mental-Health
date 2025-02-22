"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MoodTrendspro() {
  const { data: session } = useSession();

  const { data: moods, isLoading } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const res = await fetch("/api/mood");
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      return { moods: Array.isArray(result.moods) ? result.moods : [] };
    },
    enabled: !!session,
  });
  
  if (isLoading) return <p>Loading mood trends...</p>;
  if (!moods || !Array.isArray(moods.moods) || moods.moods.length === 0) return <p>No mood data available.</p>;
  

  // Convert moods into chart-friendly format
  const moodData = moods.moods.map((mood: any) => ({
    date: new Date(mood.createdAt).toLocaleDateString(),
    mood: getMoodScore(mood.mood),
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Mood Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={moodData}>
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Function to convert mood descriptions to numerical values
function getMoodScore(mood: string): number {
  const moodScores: { [key: string]: number } = {
    "Very Happy": 5,
    "Happy": 4,
    "Neutral": 3,
    "Sad": 2,
    "Very Sad": 1,
  };
  return moodScores[mood] || 3;
}
