"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const moods = [
  { label: "Happy 😊", color: "bg-green-500" },
  { label: "Sad 😢", color: "bg-blue-400" },
  { label: "Neutral 😐", color: "bg-gray-400" },
  { label: "Stressed 😖", color: "bg-red-400" },
  { label: "Excited 🤩", color: "bg-yellow-400" },
];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, note }),
      });

      if (!res.ok) throw new Error("Failed to submit mood");

      return res.json();
    },
    onSuccess: () => {
      setSelectedMood(null);
      setNote("");
      alert("Mood submitted successfully!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <div className="flex justify-center mt-2 items-center h-[600] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6"
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          How are you feeling today? 🌿
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your emotions matter. Select your mood and add a note if you'd like. 🌟
        </p>

        {/* Mood Selection */}
        <div className="flex justify-center gap-3 flex-wrap mb-5">
          {moods.map(({ label, color }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all
                ${selectedMood === label ? `${color} ring-4 ring-opacity-50` : "bg-gray-300 hover:bg-gray-400"}
              `}
              onClick={() => setSelectedMood(label)}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Note Input */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none mb-4"
          placeholder="Write about your day... (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition-all ${
            selectedMood ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => mutation.mutate()}
          disabled={!selectedMood || mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Mood"}
        </Button>
      </motion.div>
    </div>
  );
}
