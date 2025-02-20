"use client";

import { useEffect, useState } from "react";

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const JournalList = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch("/api/journal");
        const data = await response.json();
        setJournals(data.journals);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Past Journal Entries</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : journals.length > 0 ? (
        journals.map((journal) => (
          <div key={journal._id} className="border-b py-2">
            <h3 className="text-lg font-semibold text-gray-800">{journal.title}</h3>
            <p className="text-gray-600">{journal.content}</p>
            <p className="text-sm text-gray-500">{new Date(journal.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No journal entries yet.</p>
      )}
    </div>
  );
};

export default JournalList;
