"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ChartOptions,
  TooltipItem
} from "chart.js";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";
import Link from "next/link";

Chart.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface Mood {
  _id: string;
  createdAt: string;
  sentimentScore: number;
}

interface MoodResponse {
  moods: Mood[];
  averageSentiment: number;
  highestScore: number;
  lowestScore: number;
}

const MoodTrends = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    trend: 'neutral'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/mood/trends");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: MoodResponse = await response.json();
        
        setMoods(Array.isArray(data.moods) ? data.moods : []);
        
        // Calculate trend direction
        let trend = 'neutral';
        if (data.moods.length > 1) {
          const first = data.moods[0].sentimentScore;
          const last = data.moods[data.moods.length - 1].sentimentScore;
          trend = last > first ? 'up' : last < first ? 'down' : 'neutral';
        }

        setStats({
          average: data.averageSentiment || 0,
          highest: data.highestScore || 0,
          lowest: data.lowestScore || 0,
          trend
        });
      } catch (error) {
        console.error("Failed to fetch mood trends", error);
        setMoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  const chartData = {
    labels: moods.map((mood) => new Date(mood.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })),
    datasets: [
      {
        label: "Mood Score",
        data: moods.map((mood) => mood.sentimentScore),
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
          weight: 'bold'
        } as const,
        bodyFont: {
          size: 12
        } as const,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `Score: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    maintainAspectRatio: false
  };

  const getTrendIcon = () => {
    switch(stats.trend) {
      case 'up': return <FiTrendingUp className="text-green-500" />;
      case 'down': return <FiTrendingDown className="text-red-500" />;
      default: return <FiActivity className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mood Insights</h1>
            <p className="text-gray-600">Track your emotional journey over time</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-500">Trend:</span>
            {getTrendIcon()}
            <span className="font-medium">
              {stats.trend === 'up' ? 'Improving' : 
              stats.trend === 'down' ? 'Declining' : 
              stats.trend === 'neutral' ? 'Stable' : 'No data'}
            </span>

          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center h-96">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-indigo-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Average Mood</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.average.toFixed(1)}</p>
                <p className="text-gray-500 text-sm">out of 5</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Highest Day</h3>
                <p className="text-3xl font-bold text-green-600">{stats.highest.toFixed(1)}</p>
                <p className="text-gray-500 text-sm">You felt great!</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Lowest Day</h3>
                <p className="text-3xl font-bold text-red-600">{stats.lowest.toFixed(1)}</p>
                <p className="text-gray-500 text-sm">We all have tough days</p>
              </div>
            </div>

            {moods.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Your Mood Timeline</h2>
                </div>
                <div className="p-6 h-96">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-8 text-center">
                  <div className="mx-auto max-w-xs">
                    <svg 
                      className="w-24 h-24 mx-auto text-gray-300 mb-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No mood data yet</h3>
                  <p className="text-gray-500 mb-6">Start tracking your mood to discover patterns and insights</p>
                  <Link href='/dashboard/dashboard'
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-900 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Track Your First Mood
                  </Link>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default MoodTrends;