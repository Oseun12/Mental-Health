"use client";

import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moodColors: Record<string, string> = {
  Happy: "rgb(75, 192, 192)",
  Sad: "rgb(255, 99, 132)",
  Neutral: "rgb(201, 203, 207)",
  Angry: "rgb(255, 159, 64)",
  Stressed: "rgb(153, 102, 255)",
};

export default function MoodTrendsDashboard() {
  const { data: moods, isLoading } = useQuery({
    queryKey: ["moodTrends"],
    queryFn: async () => {
      const res = await fetch("/api/mood");
      return res.json();
    },
  });


  if (isLoading) return <p>Loading mood trends...</p>;

  const moodsArray = Array.isArray(moods) ? moods : [];

  const labels = moodsArray.map((mood) => new Date(mood.createdAt).toLocaleDateString());
  const dataPoints = moodsArray.map((mood) => Object.keys(moodColors).indexOf(mood.mood) + 1);
  const backgroundColors = moodsArray.map((mood) => moodColors[mood.mood]);

  const data = {
    labels,
    datasets: [
      {
        label: "Mood Over Time",
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: backgroundColors,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mood Trends</h1>
      <Line data={data} />
    </div>
  );
}
