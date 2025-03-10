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
  "Crying is a natural stress reliever—don’t hold back.",
  "Nature and sunlight can boost serotonin levels.",
  "It’s okay not to be okay—talk about it.",
  "Your feelings are valid, even if others don't understand.",
  "Kindness releases serotonin and reduces stress.",
  "You are not alone—support is available.",
  "Every small step counts toward healing.",
  "Mental health matters every day, not just on awareness days.",
];

export default function DashboardHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] rounded-2xl flex items-center justify-center overflow-hidden -z-20">
      {/* Background Image */}
      <Image
        src="/image/hero-image2.webp"
        alt="Mental Health Awareness"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={100}
        className="absolute inset-0 w-full h-full"
      />


      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Animated Text */}
      <div className="relative z-10 text-center text-white max-w-3xl p-4">
        <h1 className="text-4xl font-bold mb-4">Your Mental Health Matters 💙</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="text-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1 }}
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}


// import React from 'react'

// function DashboardHero() {
//   return (
//     <section>
//         <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div className="bg-gradient-to-r from-gray-500 to-purple-300 p-8 md:p-12 lg:px-16 lg:py-24">
//                     <div className="mx-auto max-w-xl text-center">
//                         <h2 className="text-2xl font-bold text-white md:text-3xl">
//                         Lorem, ipsum dolor sit amet consectetur adipisicing elit
//                         </h2>
            
//                         <p className="hidden text-white/90 sm:mt-4 sm:block">
//                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam
//                         sed. Quam a scelerisque amet ullamcorper eu enim et fermentum, augue. Aliquet amet
//                         volutpat quisque ut interdum tincidunt duis.
//                         </p>
            
//                         <div className="mt-4 md:mt-8">
//                             <a
//                                 href="#"
//                                 className="inline-block rounded-sm border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 transition hover:bg-transparent hover:text-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
//                             >
//                                 Get Started Today
//                             </a>
//                         </div>
//                     </div>
//                 </div>
        
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
//                     <img
//                         alt=""
//                         src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
//                         className="h-40 w-full object-cover sm:h-56 md:h-full"
//                     />
            
//                     <img
//                         alt=""
//                         src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
//                         className="h-40 w-full md:hidden lg:block object-cover sm:h-56 md:h-full"
//                     />
//                 </div>
//             </div>
//         </div>
//     </section>
//   )
// }

// export default DashboardHero