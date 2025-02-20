"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const moods = ["Happy 😊", "Sad 😢", "Neutral 😐", "Stressed 😖", "Excited 🤩"];

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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">How are you feeling today?</h2>
      <div className="flex gap-2 mb-3">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`p-2 rounded-md ${selectedMood === mood ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Add a note (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button className="mt-3 w-full" onClick={() => mutation.mutate()} disabled={!selectedMood || mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit Mood"}
      </Button>
    </div>
  );
}
