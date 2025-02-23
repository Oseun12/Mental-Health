"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa"; 
import { FiSidebar } from "react-icons/fi";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar hidden by default on small screens

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white w-64 p-5 fixed h-full transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <h2 className="text-lg font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard/dashboard" className="hover:text-gray-300">Home</Link>
          <Link href="/dashboard/journal" className="hover:text-gray-300">My Journals</Link>
          <Link href="/dashboard/mindfulness" className="hover:text-gray-300">Exercise</Link>
          <Link href="/dashboard/settings" className="hover:text-gray-300">Settings</Link>
          <Link href="/dashboard/profile" className="hover:text-gray-300 fixed bottom-10 p-5 flex gap-2 items-center">Profile</Link>

        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col bg-gray-100 min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"} `}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded-md lg:hidden"
        >
          {isSidebarOpen ? <FaTimes size={24} className="fixed left-48" /> : <FiSidebar size={24} />}
        </button>

        {/* Page Content */}
        <main className="p-6 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
