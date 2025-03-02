"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Mood {
  _id: string;
  createdAt: string;
  sentimentScore: number;
}

interface MoodResponse {
  moods: Mood[];
  averageSentiment: number;
}

const MoodTrends = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [averageSentiment, setAverageSentiment] = useState<number>(0);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch("/api/mood/trends");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: MoodResponse  = await response.json();
        setMoods(Array.isArray(data.moods) ? data.moods : []);
        setAverageSentiment(data.averageSentiment || 0);
      } catch (error) {
        console.error("Failed to fetch mood trends", error);
        setMoods([]); 
      }
    };
    fetchMoods();
  }, []);

  const chartData = {
    labels: moods.map((mood) => new Date(mood.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Sentiment Score",
        data: moods.map((mood) => mood.sentimentScore),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Mood Trends</h2>
      <Line data={chartData} />
      <p className="mt-4 text-gray-600">Average Sentiment Score: {averageSentiment.toFixed(2)}</p>
    </div>
  );
};

export default MoodTrends;
