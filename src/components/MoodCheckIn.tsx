"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import DeleteModal from "./DeleteModal";

type MoodEntry = {
  _id: string;
  mood: string;
  createdAt: string;
  note?: string;
};

const moods = [
  { label: "Happy 😊", color: "bg-green-500" },
  { label: "Sad 😢", color: "bg-blue-400" },
  { label: "Neutral 😐", color: "bg-gray-400" },
  { label: "Stressed 😖", color: "bg-red-400" },
  { label: "Excited 🤩", color: "bg-yellow-400" },
];

export default function MoodTracker() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [editingMood, setEditingMood] = useState<MoodEntry | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moodToDelete, setMoodToDelete] = useState<string | null>(null);
  const [localMoods, setLocalMoods] = useState<MoodEntry[]>([]);

  // Load moods from localStorage 
  useEffect(() => {
    const storedMoods = localStorage.getItem("moodHistory");
    if (storedMoods) {
      setLocalMoods(JSON.parse(storedMoods));
    }
  }, []);

  // Fetch moods
  const { data: moodsFromAPI } = useQuery<MoodEntry[]>({
    queryKey: ["moodHistory", session?.user?.id],
    queryFn: async (): Promise<MoodEntry[]> => {
      const res = await fetch(`/api/mood`);
      if (!res.ok) throw new Error("Failed to fetch moods");
      return res.json();
    },
    staleTime: Infinity,
  });

  // Sync API data with localStorage when data is available
  useEffect(() => {
    if (moodsFromAPI) {
      localStorage.setItem("moodHistory", JSON.stringify(moodsFromAPI));
      setLocalMoods(moodsFromAPI);
    }
  }, [moodsFromAPI]);

  // Create or Update Mood
  const mutation = useMutation({
    mutationFn: async () => {
      const method = editingMood ? "PUT" : "POST";
      const body = JSON.stringify({
        id: editingMood?._id,
        mood: selectedMood,
        note,
      });

      const res = await fetch("/api/mood", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) throw new Error(`Failed to ${editingMood ? "update" : "submit"} mood`);

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodHistory", session?.user?.id] });
      setSelectedMood(null);
      setNote("");
      setEditingMood(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/mood", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete mood");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodHistory", session?.user?.id] });
    },
  });

  // Handle Edit
  const handleEdit = (entry: MoodEntry) => {
    setEditingMood(entry);
    setSelectedMood(entry.mood);
    setNote(entry.note || "");
  };

  const confirmDelete = () => {
    if (moodToDelete) {
      deleteMutation.mutate(moodToDelete);
      setDeleteModalOpen(false);
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    setMoodToDelete(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-4 mt-20 bg-white rounded-lg shadow-md mx-auto max-w-screen-lg">
      <h2 className="text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-lime-900 via-black to-rose-500 
          bg-clip-text text-transparent animate-gradient">
        {editingMood ? "Edit Mood Entry ✏️" : `How are you feeling today`}  
        <span className="text-3xl bg-gradient-to-r from-purple-900 via-pink-500 to-blue-500 
          bg-clip-text text-transparent animate-gradient">
          {session?.user?.name || ""}
        </span>    
      </h2>

      {/* Mood Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 mx-auto"
      >
        <div className="flex justify-center gap-3 flex-wrap mb-5">
          {moods.map(({ label, color }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all
                ${selectedMood === label ? `${color} ring-4 ring-opacity-50` : "bg-gray-300 hover:bg-gray-400"}`}
              onClick={() => setSelectedMood(label)}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <textarea
          className="w-full p-6 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none mb-4"
          placeholder="Write about your day... (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition-all ${
            selectedMood ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-800 cursor-not-allowed"
          }`}
          onClick={() => mutation.mutate()}
          disabled={!selectedMood || mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : editingMood ? "Update Mood" : "Submit Mood"}
        </Button>
      </motion.div>

      {/* Mood History */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-center">Your Mood History</h2>

      {localMoods.length === 0 ? (
        <div className="flex flex-col items-center">
          <Image src="/images/no-mood.png" alt="No moods available" width={200} height={200} className="mb-4" />
          <p className="text-gray-500">No mood check-ins yet.</p>
        </div>
      ) : (
        <ul>
          {localMoods.map((entry: MoodEntry) => (
            <li key={entry._id} className="p-2 border-b flex justify-between">
              <div>
                <strong>{entry.mood}</strong> - {new Date(entry.createdAt).toLocaleDateString()}
                {entry.note && <p className="text-gray-600">{entry.note}</p>}
              </div>
              <div className="flex gap-4">
                <RiEditLine className="text-blue-500 cursor-pointer" onClick={() => handleEdit(entry)} />
                <HiOutlineTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(entry._id)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} />
    </div>
  );
}
