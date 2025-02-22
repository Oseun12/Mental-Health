"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-800">MindfulTrack</Link>
      <div className="flex space-x-4">
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
        <Link href="/mindfulness" className="text-gray-600 hover:text-green-500">Mindfulness</Link>
        <Link href="/journal" className="text-gray-600 hover:text-purple-500">Journal</Link>
        {session ? (
          <button onClick={() => signOut()} className="text-red-500 hover:text-red-600">Logout</button>
        ) : (
          <Link href="/api/auth/signin" className="text-blue-500 hover:text-blue-600">Login</Link>
        )}

      </div>
    </nav>
  );
}
