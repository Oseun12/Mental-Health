"use client";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Mental Health Tracker</h1>
      {session && (
        <button
          onClick={() => signOut()}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
