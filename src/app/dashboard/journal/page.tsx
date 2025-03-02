"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: Date; 
  sentimentScore: number;
}


export default function JournalPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: journals, isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await fetch("/api/journal");
      return res.json();
    },
    enabled: !!session,
  });

  console.log("Fetched Journals:", journals);

  const journalsArray: JournalEntry[] = Array.isArray(journals?.journals) ? journals.journals : [];

  const createJournal = useMutation({
    mutationFn: async () => {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"]});
      setTitle("");
      setContent("");
    },
  });

  const getSentimentLabel = (score: number) => {
    if (score > 1) return "😊 Positive";
    if (score < -1) return "😞 Negative";
    return "😐 Neutral";
  };

  if (!session) return <p>Please log in to access your journal.</p>;
  if (isLoading) return <p>Loading journals...</p>;

  return (
      <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Journal</h1>

        {/* Journal Entry Form */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32"
          />
          <Button onClick={() => createJournal.mutate()} className="w-full mt-2 bg-blue-500 hover:bg-blue-600">
            Save Entry
          </Button>
        </div>

        {/* Display Journal Entries */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Previous Entries</h2>
        <div className="space-y-4">
          {journalsArray.length === 0 ? (
            <p>No journal entries yet.</p>
          ) : (
            journalsArray.map((journal: JournalEntry) => (
              <div key={journal._id} className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-bold">{journal.title}</h3>
                <p className="text-gray-700">{journal.content}</p>
                <p className="text-gray-500 text-sm">{new Date(journal.createdAt).toLocaleDateString()}</p>
                <p className="text-sm font-semibold">{getSentimentLabel(journal.sentimentScore)}</p>
              </div>
            ))
          )}
        </div>
      </div>
  );
}