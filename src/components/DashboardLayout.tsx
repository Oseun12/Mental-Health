"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa"; 
import { FiSidebar } from "react-icons/fi";
import { getSession, signOut } from "next-auth/react"; // ✅ Import signOut
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      if (!userSession) {
        router.push("/api/auth/signin"); 
      } else {
        setSession(userSession);
      }
    };
    fetchSession();
  }, [router]);

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white w-64 p-5 fixed h-full transition-transform duration-300 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}>
          <h2 className="text-lg font-bold mb-6">Dashboard</h2>
            
        
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard/dashboard" className="hover:text-gray-300">Home</Link>
            <Link href="/dashboard/journal" className="hover:text-gray-300">My Journals</Link>
            <Link href="/dashboard/mindfulness" className="hover:text-gray-300">Exercise</Link>
            <Link href="/dashboard/settings" className="hover:text-gray-300">Settings</Link>

          {/* Profile & Logout Section */}
          {session && (
            <div className="fixed bottom-10 p-5 flex flex-col gap-3 items-center">
              <div className="flex justify-between gap-4 items-center">
               
                {session.user.image && (
                  <Image src={session.user.image} alt="Profile Picture" width={30} height={30} className="rounded-full" />
                )}
                <Link href="/dashboard/profile" className="hover:text-gray-300">Profile</Link>
              </div>
              
              {/* 🚀 Logout Button */}
              <button 
                onClick={() => signOut({ callbackUrl: "/" })} 
                className="bg-outline border text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition">
                Logout
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col bg-gray-100 min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"} `}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded-md lg:hidden">
          {isSidebarOpen ? <FaTimes size={24} className="fixed left-52" /> : <FiSidebar size={24} />}
        </button>

        {/* Page Content */}
        <main className="p-6 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
