"use client";

import { useQuery } from "@tanstack/react-query";

export default function MentalHealthTip() {
  const { data, isLoading } = useQuery({
    queryKey: ["mental-health-tip"],
    queryFn: async () => {
      const res = await fetch("/api/tips");
      return res.json();
    },
  });

  // console.log("Fetched Data:", data);

  return (
    <div className="p-4 bg-green-100 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Daily Mental Health Tip</h3>
      {isLoading ? <p>Loading...</p> : <p className="mt-2 text-gray-700">{data.tip}</p>}
    </div>
  );
}
