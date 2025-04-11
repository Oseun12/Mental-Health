"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  "1 in 4 people will experience a mental health issue in their lifetime.",
  "Your mental health is just as important as your physical health.",
  "Regular exercise can help reduce symptoms of anxiety and depression.",
  "Sleep is crucial for emotional regulation and mental well-being.",
  "Social connections can improve mental resilience.",
  "Chronic stress can weaken the immune system.",
  "Mindfulness and meditation can help reduce stress and anxiety.",
  "Journaling can improve self-awareness and emotional health.",
  "Deep breathing techniques can instantly lower stress levels.",
  "Self-care isn't selfish; it's essential.",
  "Negative thoughts aren't facts—challenge them!",
  "Seeking help is a sign of strength, not weakness.",
  "Your diet affects your mood—eat balanced meals.",
  "Laughter boosts mental health by releasing feel-good hormones.",
  "Unplugging from social media can improve mental well-being.",
  "Music therapy helps reduce anxiety and boost mood.",
  "Volunteering can improve happiness and mental health.",
  "Crying is a natural stress reliever—don't hold back.",
  "Nature and sunlight can boost serotonin levels.",
  "It's okay not to be okay—talk about it.",
];

export default function DashboardHero() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setIndex((prevIndex) => (prevIndex + 1) % facts.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const nextFact = () => setIndex((prevIndex) => (prevIndex + 1) % facts.length);
  const prevFact = () => setIndex((prevIndex) => (prevIndex - 1 + facts.length) % facts.length);

  return (
    <div className="relative w-full max-w-screen-2xl mx-auto min-h-[400px] sm:min-h-[500px] rounded-2xl overflow-hidden -z-50 shadow-xl">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/image/hero-image2.webp"
          alt="Mental Health Awareness"
          fill
          priority
          className="object-cover object-center "
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-indigo-900/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center mt-20">
        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg"
        >
          Your Mental Health <span className="text-blue-300">Matters</span>
        </motion.h1>

        {/* Fact Container */}
        <div 
          className="max-w-3xl w-full relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={prevFact}
            className="absolute hidden md:block left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Previous fact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextFact}
            className="absolute hidden md:block right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Next fact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Animated Fact */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                className="text-lg sm:text-xl font-medium text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {facts[index]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-8">
          {facts.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/30'}`}
              aria-label={`Go to fact ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}