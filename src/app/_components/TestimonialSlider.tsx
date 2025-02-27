'use client'

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    text: "This app has transformed my mental well-being. I feel more aware and in control of my emotions every day.",
  },
  {
    name: "Jane Smith",
    text: "A fantastic tool for daily mindfulness and emotional self-care. Highly recommended!",
  },
  {
    name: "David Wilson",
    text: "Simple yet effective! The journaling feature allows me to reflect on my thoughts and track my mood.",
  },
  {
    name: "Emma Brown",
    text: "The mood tracking feature helps me notice patterns in my emotions and improve my mental clarity!",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const prevTestimonial = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const nextTestimonial = () => {
    setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="flex flex-col mt-20 h-[400px] items-center justify-center mx-auto text-white p-6 bg-black rounded-xl">
      <h2 className="font-bold mb-4 text-center text-3xl">What People Are Saying</h2>
      <div className="relative md:flex gap-10 items-center mx-auto max-w-screen-lg">
        <div className="md:w-1/2 items-center text-center mb-4">
          <p className="font-semibold text-2xl mb-4">Real Experiences, Real Impact</p>
          <p className="mb-6">Hear from people who have improved their mental health with our app.</p>
          <button className="p-2 bg-white text-black rounded-full shadow-md hover:bg-slate-400 mr-2" onClick={prevTestimonial}>
            <ChevronLeft size={24} />
          </button>
          <button className="p-2 bg-white text-black rounded-full shadow-md hover:bg-slate-400 ml-2" onClick={nextTestimonial}>
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center items-center h-[200px] p-6 transition-all duration-500 text-black bg-white shadow-lg rounded-lg">
          <p className="text-lg italic text-center">{testimonials[index].text}</p>
          <h4 className="mt-4 font-semibold text-center">- {testimonials[index].name}</h4>
        </div>
      </div>
    </div>
  );
}
