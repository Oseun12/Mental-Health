"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function GratitudeJournal() {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["gratitude"],
    queryFn: async () => {
      const res = await fetch("/api/gratitude");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (newEntry: string) => {
      await fetch("/api/gratitude", {
        method: "POST",
        body: JSON.stringify({ content: newEntry }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gratitude"]);
      setContent("");
    },
  });

  return (
    <div className="p-6 bg-yellow-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Gratitude Journal</h3>
      
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="What are you grateful for today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
        onClick={() => mutation.mutate(content)}
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Saving..." : "Add Entry"}
      </button>

      <div className="mt-4">
        {isLoading ? (
          <p>Loading entries...</p>
        ) : (
          entries.map((entry: any) => (
            <div key={entry._id} className="p-3 bg-white rounded-md shadow my-2">
              {entry.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
