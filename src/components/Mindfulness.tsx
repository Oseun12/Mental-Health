"use client";

import { useEffect, useState } from "react";

interface Exercise {
  title: string;
  description: string;
}

const Mindfulness = () => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch("/api/mindfulness");
        const data = await response.json();
        setExercise(data.exercise);
      } catch (error) {
        console.error("Failed to fetch mindfulness exercise", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, []);

  return (
    <div className="p-4 bg-blue-100 shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Mindfulness Exercise</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        exercise && (
          <>
            <h3 className="text-lg font-semibold text-blue-800">{exercise.title}</h3>
            <p className="text-gray-600">{exercise.description}</p>
          </>
        )
      )}
    </div>
  );
};

export default Mindfulness;
