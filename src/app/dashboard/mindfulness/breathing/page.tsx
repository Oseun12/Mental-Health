"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BreathingExercise() {
  const [phase, setPhase] = useState("Inhale");
  const [count, setCount] = useState(4);
  const [circleSize, setCircleSize] = useState(100);

  useEffect(() => {
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let index = 0;

    const interval = setInterval(() => {
      setPhase(phases[index]);
      setCount(index % 2 === 0 ? 4 : 2);
      
      // Animate circle size based on phase
      if (phases[index] === "Inhale") {
        animateCircle(100, 200, 4000);
      } else if (phases[index] === "Exhale") {
        animateCircle(200, 100, 4000);
      }
      
      index = (index + 1) % phases.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const animateCircle = (start: number, end: number, duration: number) => {
    const range = end - start;
    const startTime = Date.now();
    
    const updateSize = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentSize = start + (range * progress);
      setCircleSize(currentSize);
      
      if (progress < 1) {
        requestAnimationFrame(updateSize);
      }
    };
    
    updateSize();
  };

  const getPhaseColor = () => {
    switch(phase) {
      case "Inhale": return "bg-blue-400";
      case "Exhale": return "bg-teal-400";
      case "Hold": return "bg-indigo-400";
      default: return "bg-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-5 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Breathing Exercise</h1>
        <p className="text-gray-600 mb-8">Follow the rhythm to relax your mind and body</p>
        
        <div className="flex flex-col items-center justify-center mb-10">
          {/* Animated breathing circle */}
          <div 
            className={`rounded-full ${getPhaseColor()} transition-all duration-1000 ease-in-out flex items-center justify-center shadow-lg`}
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              transition: 'width 4s ease-in-out, height 4s ease-in-out, background-color 0.5s ease'
            }}
          >
            <span className="text-white text-5xl font-bold">{count}</span>
          </div>
          
          <p className={`mt-6 text-2xl font-semibold ${
            phase === "Inhale" ? "text-blue-600" : 
            phase === "Exhale" ? "text-teal-600" : 
            "text-indigo-600"
          }`}>
            {phase} {phase === "Inhale" ? "deeply" : phase === "Exhale" ? "slowly" : ""}
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-8">
          {["Inhale", "Hold", "Exhale", "Hold"].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                phase === step ? 
                  (step === "Inhale" ? "bg-blue-500" : 
                   step === "Exhale" ? "bg-teal-500" : "bg-indigo-500") : 
                  "bg-gray-300"
              }`} />
              <span className="text-xs text-gray-500 mt-1">{step}</span>
            </div>
          ))}
        </div>
        
        <Link href="/dashboard/mindfulness" className="block">
          <Button 
            variant="outline" 
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Back to Mindfulness
          </Button>
        </Link>
      </div>
      
      <p className="text-gray-400 text-sm mt-6">Focus on your breath • Let go of tension</p>
    </div>
  );
}