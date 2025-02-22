"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BreathingExercise() {
  const [phase, setPhase] = useState("Inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let index = 0;

    const interval = setInterval(() => {
      setPhase(phases[index]);
      setCount(index % 2 === 0 ? 4 : 2);
      index = (index + 1) % phases.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Guided Breathing</h1>
      <p className="text-lg text-blue-500 font-semibold">{phase}</p>
      <p className="text-4xl font-bold my-2">{count}</p>

      <p className="text-gray-600 mb-6">Follow the rhythm to relax your mind.</p>

      <Link href="/mindfulness">
        <Button className="w-full bg-gray-500 hover:bg-gray-600">Back to Mindfulness</Button>
      </Link>
    </div>
  );
}
