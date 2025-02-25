"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";


type MoodEntry = {
  _id: string;
  mood: string;
  createdAt: string;
  note?: string;
};

export default function MoodHistory() {
  const queryClient = useQueryClient();

  const { data, error } = useQuery<MoodEntry[]>({
    queryKey: ["moodHistory"],
    queryFn: async (): Promise<MoodEntry[]> => {
      const res = await fetch("/api/mood", { cache: "force-cache" }); 
      if (!res.ok) throw new Error("Failed to fetch moods");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, 
    // cacheTime: 1000 * 60 * 30, 
  });

  const moodsArray = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/mood", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Failed to delete mood");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["moodHistory"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (
      { id, mood, note }: { id: string; mood: string; note?: string}) => {
        const res = await fetch("/api/mood", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, mood, note }),
        });
  
        if (!res.ok) throw new Error("Failed to update mood");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["moodHistory"]); 
      },
    });

    const handleEdit = (entry: MoodEntry) => {
      const newMood = prompt("Enter new mood:", entry.mood);
      const newNote = prompt("Update your note:", entry.note || "");
  
      if (newMood) {
        updateMutation.mutate({ id: entry._id, mood: newMood, note: newNote });
      }
    };

    const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this mood?")) {
        deleteMutation.mutate(id);
      }
    };
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mx-auto max-w-screen-lg">
      <h2 className="text-xl font-semibold mb-2">Your Mood History</h2>

      {error && <p className="text-red-500">Error loading moods.</p>}

      {moodsArray.length === 0 ? (
        <div className="flex flex-col items-center">
          <Image
            src="/images/no-mood.png" 
            alt="No moods available"
            width={200}
            height={200}
            className="mb-4"
          />
          <p className="text-gray-500">No mood check-ins yet.</p>
        </div>
      ) : (
        <ul>
          {moodsArray.map((entry: MoodEntry) => (
            <li key={entry._id} className="p-2 border-b flex justify-between">
             
              <div>
                <strong>{entry.mood}</strong> - {new Date(entry.createdAt).toLocaleDateString()}
                {entry.note && <p className="text-gray-600">{entry.note}</p>}
              </div>
              <div className="flex gap-4">
                <RiEditLine className="text-blue-500" onClick={() => handleEdit(entry)} />
                <HiOutlineTrash className="text-red-500" onClick={() => handleDelete(entry._id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
