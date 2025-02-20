"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function JournalList() {
  const { data: session } = useSession();

  const { data: journals, isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await fetch("/api/journal");
      return res.json();
    },
    enabled: !!session, // Only fetch if user is logged in
  });

  if (isLoading) return <p>Loading journal entries...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {journals.journals.length === 0 ? (
        <p>No journal entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {journals.journals.map((journal: any) => (
            <li key={journal._id} className="p-2 bg-gray-100 rounded">
              <p className="text-sm text-gray-600">{new Date(journal.createdAt).toLocaleDateString()}</p>
              <p>{journal.entry}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
