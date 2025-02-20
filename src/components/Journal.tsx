"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const JournalForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        router.refresh(); 
      } else {
        console.error("Failed to save journal");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Write a Journal Entry</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded-md"
      />
      <textarea
        placeholder="Write your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded-md"
      ></textarea>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md">
        {loading ? "Saving..." : "Save Journal"}
      </button>
    </form>
  );
};

export default JournalForm;
