"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";

type MoodEntry = {
  _id: string;
  mood: string;
  createdAt: string;
  note?: string;
};

export default function MoodHistory({ onEdit }: { onEdit: (entry: MoodEntry) => void }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [localMoods, setLocalMoods] = useState<MoodEntry[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moodToDelete, setMoodToDelete] = useState<string | null>(null);

  // Fetch moods from API
  const { data: moodsFromAPI } = useQuery<MoodEntry[]>({
    queryKey: ["moodHistory", session?.user?.id],
    queryFn: async (): Promise<MoodEntry[]> => {
      const res = await fetch(`/api/mood`);
      if (!res.ok) throw new Error("Failed to fetch moods");
      return res.json();
    },
    staleTime: Infinity,
  });

  // Sync API data with localStorage
  useEffect(() => {
    if (moodsFromAPI) {
      localStorage.setItem("moodHistory", JSON.stringify(moodsFromAPI));
      setLocalMoods(moodsFromAPI);
    }
  }, [moodsFromAPI]);

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

  const confirmDelete = () => {
    if (moodToDelete) {
      deleteMutation.mutate(moodToDelete);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-center">Your Mood History</h2>

      {localMoods.length === 0 ? (
        <p className="text-gray-500 text-center">No mood check-ins yet.</p>
      ) : (
        <ul>
          {localMoods.map((entry) => (
            <li key={entry._id} className="p-2 border-b flex justify-between">
              <div>
                <strong>{entry.mood}</strong> - {new Date(entry.createdAt).toLocaleDateString()}
                {entry.note && <p className="text-gray-600">{entry.note}</p>}
              </div>
              <div className="flex gap-4">
                <RiEditLine className="text-blue-500 cursor-pointer" onClick={() => onEdit(entry)} />
                <HiOutlineTrash className="text-red-500 cursor-pointer" onClick={() => { setMoodToDelete(entry._id); setDeleteModalOpen(true); }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} />
    </div>
  );
}
