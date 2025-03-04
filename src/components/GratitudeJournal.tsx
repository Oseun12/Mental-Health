"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface GratitudeEntry {
  _id: string;
  content: string;
}

export default function GratitudeJournal() {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const [localEntries, setLocalEntries] = useState<GratitudeEntry[]>([]);

  const { data: entries } = useQuery<GratitudeEntry[]>({
    queryKey: ["gratitude"],
    queryFn: async () => {
      const res = await fetch("/api/gratitude");
      return res.json();
    },
    staleTime: Infinity, // Prevent auto-refetching
  });

  // Load cached data from localStorage **only on the client**
  useEffect(() => {
    const storedEntries = localStorage.getItem("gratitudeEntries");
    if (storedEntries) {
      setLocalEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Update localStorage when entries change
  useEffect(() => {
    if (entries) {
      localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
      setLocalEntries(entries);
    }
  }, [entries]);

  const mutation = useMutation({
    mutationFn: async (newEntry: string) => {
      await fetch("/api/gratitude", {
        method: "POST",
        body: JSON.stringify({ content: newEntry }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gratitude"] });
      setContent("");
    },
  });

  return (
    <div className="p-8 bg-gradient-to-r mx-auto max-w-screen-xl from-purple-400 to-blue-400 rounded-xl mt-20 shadow-xl">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-white">Gratitude Journal</h1>

      <p className="mb-6 text-white text-center text-lg italic">
        &quot;Gratitude turns what we have into enough.&quot;
      </p>

      <div className="mb-6">
        <textarea
          className="w-full p-4 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="What are you grateful for today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        className="w-full px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition ease-in-out duration-300"
        onClick={() => mutation.mutate(content)}
        disabled={mutation.status === "pending"}
      >
        {mutation.status === "pending" ? "Saving..." : "Add Entry"}
      </button>

      <div className="mt-6 space-y-4">
        {localEntries.length === 0 ? (
          <p className="text-center text-white">No entries yet. Start by adding one!</p>
        ) : (
          localEntries.map((entry: GratitudeEntry) => (
            <div key={entry._id} className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-purple-700">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
