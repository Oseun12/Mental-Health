"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import DeleteModal from "./DeleteModal";
import { Skeleton } from "@/components/ui/skeleton";
import { FiSmile, FiMeh, FiFrown, FiZap, FiStar } from "react-icons/fi";

type MoodEntry = {
  _id: string;
  mood: string;
  createdAt: string;
  note?: string;
};

const moods = [
  { label: "Happy", display: " Happy 😊", value: "Happy 😊", icon: <FiSmile />, color: "bg-green-100 text-green-600", border: "border-green-200" },
  { label: "Sad", display: "Sad 😢", value: "Sad 😢", icon: <FiFrown />, color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
  { label: "Neutral", display: "Neutral 😐", value: "Neutral 😐", icon: <FiMeh />, color: "bg-gray-100 text-gray-600", border: "border-gray-200" },
  { label: "Stressed", display: "Stressed 😖", value: "Stressed 😖", icon: <FiZap />, color: "bg-red-100 text-red-600", border: "border-red-200" },
  { label: "Excited", display: "Excited 🤩", value: "Excited 🤩", icon: <FiStar />, color: "bg-yellow-100 text-yellow-600", border: "border-yellow-200" },
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
  const { data: moodsFromAPI, isLoading } = useQuery<MoodEntry[]>({
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
      // const moodWithEmoji = moods.find(m => m.label === selectedMood)?.display || selectedMood;
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
    const matchingMood = moods.find(m => entry.mood.includes(m.label));
    setSelectedMood(matchingMood?.value || entry.mood);
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

  const getMoodDetails = (moodLabel: string) => {
    return moods.find(mood => mood.label === moodLabel.split(" ")[0]) || moods[2]; // Default to Neutral
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto mt-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {editingMood ? "Edit Mood Entry" : "How Are You Feeling Today?"}
        </h1>
        <p className="text-gray-600 md:text-lg">
          {editingMood 
            ? "Update your mood entry below" 
            : "Track your emotions and reflect on your day"}
        </p>
      </motion.div>

      {/* Mood Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {editingMood ? "Edit Mood" : "Select Your Mood"}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg font-medium transition-all
                border ${mood.border} ${mood.color}
                ${selectedMood === mood.value ? "ring-2 ring-offset-2 ring-opacity-50 scale-105" : "hover:shadow-sm"}`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <span className="text-xl mb-1">{mood.icon}</span>
              <span>{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mb-6">
          <label htmlFor="mood-note" className="block text-sm font-medium text-gray-700 mb-2">
            Add notes about your day (optional)
          </label>
          <textarea
            id="mood-note"
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none min-h-[120px] transition-all"
            placeholder="Today I felt..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button
          className={`w-full py-3 text-lg font-medium rounded-lg transition-all ${
            selectedMood ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" : "bg-gray-200 cursor-not-allowed text-gray-400"
          } shadow-md`}
          onClick={() => mutation.mutate()}
          disabled={!selectedMood || mutation.isPending}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              {editingMood ? "Updating..." : "Saving..."}
            </div>
          ) : editingMood ? (
            "Update Mood"
          ) : (
            "Save Mood"
          )}
        </Button>
      </motion.div>

      {/* Mood History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Your Mood History</h2>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center p-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded-lg" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-5 rounded-lg" />
                        <Skeleton className="h-5 w-5 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : localMoods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 text-center"
          >
            <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <FiMeh size={48} />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Moods Tracked Yet</h3>
            <p className="text-gray-500 mb-4">Your mood history will appear here once you start tracking</p>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-black hover:bg-gray-600"
            >
              Track Your First Mood
            </Button>
          </motion.div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {Object.entries(groupedMoods).map(([date, entries]) => (
                <motion.div 
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{date}</h3>
                  <div className="space-y-3">
                    {entries.map((entry) => {
                      const moodDetails = getMoodDetails(entry.mood);
                      return (
                        <motion.div 
                          key={entry._id}
                          whileHover={{ scale: 1.01 }}
                          className="flex justify-between items-start p-4 hover:bg-gray-50 rounded-lg transition-all border border-gray-100"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 p-2 rounded-full ${moodDetails.color} ${moodDetails.border}`}>
                              {moodDetails.icon}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <span>{entry.mood.split(" ")[0]}</span>
                                <span className="text-sm">{entry.mood.split(" ")[1]}</span>
                              </div>
                              {entry.note && (
                                <p className="text-gray-600 mt-1 text-sm">{entry.note}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleEdit(entry)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                              aria-label="Edit"
                            >
                              <RiEditLine size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(entry._id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                              aria-label="Delete"
                            >
                              <HiOutlineTrash size={18} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}