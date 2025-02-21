'use client'

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    text: "This app has changed my life. I feel more in control of my emotions.",
  },
  {
    name: "Jane Smith",
    text: "A fantastic tool for daily mindfulness and emotional well-being!",
  },
  {
    name: "David Wilson",
    text: "Simple yet effective. The journaling feature is my favorite.",
  },
  {
    name: "Emma Brown",
    text: "I love the mood tracking feature. It helps me reflect on my progress!",
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
    <div className="flex flex-col items-center justify-center mx-auto text-white  p-6 bg-black rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">What People Are Saying</h2>
        <div className="relative flex gap-20 items-center">
            <div className=" w-1/2 items-center mb-4">
                <p className="text-lg font-semibold">Do not just take our word for it...</p>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas veritatis illo placeat harum porro optio fugit a culpa sunt id!</p>
                <button className="p-2 bg-white text-black rounded-full shadow-md mr-2" onClick={prevTestimonial}>
                    <ChevronLeft size={24} />
                </button>
                <button className="p-2 bg-white text-black rounded-full shadow-md ml-2" onClick={nextTestimonial}>
                    <ChevronRight size={24} />
                </button>
            </div>
            <div className=" w-1/2 text-center p-4 transition-all duration-500 text-black bg-white shadow-lg rounded-lg">
                <p className="text-lg italic">"{testimonials[index].text}"</p>
                <h4 className="mt-4 font-semibold">- {testimonials[index].name}</h4>
            </div>
        </div>
    </div>
  );
}
