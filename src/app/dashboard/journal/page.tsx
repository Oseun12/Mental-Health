"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RiEditLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi2";

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  sentimentScore: number;
}

export default function JournalPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: journals, isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await fetch("/api/journal");
      return res.json();
    },
    enabled: !!session,
  });

  const journalsArray: JournalEntry[] = Array.isArray(journals?.journals)
    ? journals.journals
    : [];

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setTitle("");
      setContent("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/journal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete journal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingEntry) return;
      const res = await fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingEntry._id, title, content }),
      });
      if (!res.ok) throw new Error("Failed to update journal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setTitle("");
      setContent("");
      setEditingEntry(null);
    },
  });

  const handleDelete = (id: string) => {
    setJournalToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (journalToDelete) {
      deleteMutation.mutate(journalToDelete);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
  };

  const handleSave = () => {
    if (editingEntry) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

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
        <Button
          onClick={handleSave}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
        >
          {editingEntry ? "Update Entry" : "Save Entry"}
        </Button>
      </div>

      {/* Display Journal Entries */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Previous Entries
      </h2>
      <div className="space-y-4">
        {journalsArray.length === 0 ? (
          <p>No journal entries yet.</p>
        ) : (
          journalsArray.map((journal: JournalEntry) => (
            <div
              key={journal._id}
              className="p-4 bg-gray-100 rounded shadow flex justify-between"
            >
              <div>
                <h3 className="font-bold">{journal.title}</h3>
                <p className="text-gray-700">{journal.content}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(journal.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold">
                  {getSentimentLabel(journal.sentimentScore)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(journal)}
                  className="text-red-400 hover:text-yellow-600 transition ease-in-out duration-300"
                >
                  <RiEditLine size={18} />
                </button>
                <button
                  onClick={() => handleDelete(journal._id)}
                  className="text-black transition ease-in-out duration-300"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to delete this journal entry?</p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
