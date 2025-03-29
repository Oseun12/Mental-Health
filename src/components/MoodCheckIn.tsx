"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import DeleteModal from "./DeleteModal";
import Image from "next/image";

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

  // Load moods from localStorage on initial render
  useEffect(() => {
    const storedMoods = localStorage.getItem("moodHistory");
    if (storedMoods) {
      setLocalMoods(JSON.parse(storedMoods));
    }
  }, []);

  // Fetch moods from API
  const { data: moodsFromAPI } = useQuery<MoodEntry[]>({
    queryKey: ["moodHistory", session?.user?.id],
    queryFn: async (): Promise<MoodEntry[]> => {
      const res = await fetch(`/api/mood`);
      if (!res.ok) throw new Error("Failed to fetch moods");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync API data with localStorage
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

  // Group moods by date
  const groupedMoods = localMoods.reduce((acc, mood) => {
    const date = new Date(mood.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(mood);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  return (
    <div className="p-4 mt-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {editingMood ? "Edit Mood Entry" : "How Are You Feeling?"}
        </h1>
        <p className="text-gray-600">
          {editingMood 
            ? "Update your mood entry below" 
            : "Select your current mood and add notes if you'd like"}
        </p>
      </div>

      {/* Mood Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {moods.map(({ label, color }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-lg text-white font-medium transition-all
                ${selectedMood === label ? `${color} ring-2 ring-offset-2 ring-opacity-50` : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
              onClick={() => setSelectedMood(label)}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <textarea
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none mb-4 min-h-[120px]"
          placeholder="Add any notes about your day (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          className={`w-full py-3 text-lg font-medium rounded-lg transition-all ${
            selectedMood ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => mutation.mutate()}
          disabled={!selectedMood || mutation.isPending}
        >
          {mutation.isPending 
            ? "Processing..." 
            : editingMood 
              ? "Update Mood" 
              : "Save Mood"}
        </Button>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Your Mood History</h2>
        </div>

        {localMoods.length === 0 ? (
          <div className="p-8 text-center">
            <Image 
              src="/image/Nothing_Here.jpg" 
              alt="No moods available" 
              width={400} 
              height={200} 
              className="mx-auto mb-4 rounded-lg" 
            />
            <p className="text-gray-500">No mood entries yet. Check in with yourself!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(groupedMoods).map(([date, entries]) => (
              <div key={date} className="p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">{date}</h3>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div key={entry._id} className="flex justify-between items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            entry.mood.includes("Happy") ? "bg-green-500" :
                            entry.mood.includes("Sad") ? "bg-blue-400" :
                            entry.mood.includes("Neutral") ? "bg-gray-400" :
                            entry.mood.includes("Stressed") ? "bg-red-400" :
                            "bg-yellow-400"
                          }`}></span>
                          <span className="font-medium">{entry.mood}</span>
                        </div>
                        {entry.note && (
                          <p className="text-gray-600 mt-1 text-sm">{entry.note}</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleEdit(entry)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          aria-label="Edit"
                        >
                          <RiEditLine size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}