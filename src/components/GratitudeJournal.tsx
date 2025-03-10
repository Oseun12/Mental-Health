"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";

interface GratitudeEntry {
  _id: string;
  content: string;
}

export default function GratitudeJournal() {
  const [content, setContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<GratitudeEntry | null>(null); 
  const queryClient = useQueryClient();
  const [localEntries, setLocalEntries] = useState<GratitudeEntry[]>([]);

  const { data: entries } = useQuery<GratitudeEntry[]>({
    queryKey: ["gratitude"],
    queryFn: async () => {
      const res = await fetch("/api/gratitude");
      return res.json();
    },
    staleTime: Infinity, 
  });

  useEffect(() => {
    const storedEntries = localStorage.getItem("gratitudeEntries");
    if (storedEntries) {
      setLocalEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    if (entries) {
      localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
      setLocalEntries(entries);
    }
  }, [entries]);

  const addMutation = useMutation({
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

  const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch("/api/gratitude", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
  
        if (!res.ok) throw new Error("Failed to delete mood");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["gratitude" ] });
      },
    });
  

  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/gratitude", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content }),
      });

      if (!res.ok) throw new Error("Failed to delete mood");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gratitude"] });
      setContent("")
      setEditingEntry(null); 
    },
  });


  const handleEdit = (entry: GratitudeEntry) => {
    setEditingEntry(entry);
    setContent(entry.content);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdate = () => {
    if (editingEntry) {
      updateMutation.mutate(editingEntry._id );
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r mx-auto max-w-screen-xl from-gray-600 to-black rounded-xl mt-20 shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-white text-gold-500">
        Gratitude Journal
      </h1>

      <p className="mb-6 text-gold-300 text-center text-white text-lg italic">
        &quot;Gratitude turns what we have into enough.&quot;
      </p>

      <div className="mb-6">
        <textarea
          className="w-full p-4 border border-gold-300 rounded-lg focus:outline-none focus:border-gold-500 bg-gray-800 text-white placeholder-gray-400"
          placeholder="What are you grateful for today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        className="w-full px-5 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gold-600 transition ease-in-out duration-300"
        onClick={() =>
          editingEntry ? handleUpdate() : addMutation.mutate(content)
        }
        disabled={addMutation.status === "pending" || updateMutation.status === "pending"}
      >
        {editingEntry
          ? updateMutation.status === "pending"
            ? "Updating..."
            : "Update Entry"
          : addMutation.status === "pending"
          ? "Saving..."
          : "Add Entry"}
      </button>

      <div className="mt-6 space-y-4 text-white">
        {localEntries.length === 0 ? (
          <p className="text-center text-white text-gold-300">No entries yet. Start by adding one!</p>
        ) : (
          localEntries.map((entry: GratitudeEntry) => (
            <div
              key={entry._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
            >
              <p className="text-gold-200 flex-1">{entry.content}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-gold-400 hover:text-gold-500 transition ease-in-out duration-300"
                >
                  <RiEditLine size={18} />
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-400 hover:text-red-500 transition ease-in-out duration-300"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}