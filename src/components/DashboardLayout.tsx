"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChartBar, FaHome, FaJournalWhills, FaTimes, FaUserCircle } from "react-icons/fa"; 
import { MdOutlineSportsGymnastics, MdSettings } from "react-icons/md";
import { FiSidebar } from "react-icons/fi";
import { getSession, signOut } from "next-auth/react"; 
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Session } from "next-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const pathname = usePathname();
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

  // Function to generate initials from name
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
  };

  // Close sidebar when clicking on any nav item
  const handleNavItemClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 p-5 fixed h-full transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-lg font-bold mb-10">Dashboard</h2>
      
        <nav className="flex flex-col gap-4 p-4 text-white h-full">
          <NavItem 
            href="/dashboard/dashboard" 
            icon={<FaHome />} 
            label="Home" 
            pathname={pathname}
            onClick={handleNavItemClick}
          />
          <NavItem 
            href="/dashboard/journal" 
            icon={<FaJournalWhills />} 
            label="My Journals" 
            pathname={pathname}
            onClick={handleNavItemClick}
          />
          <NavItem 
            href="/dashboard/mindfulness" 
            icon={<MdOutlineSportsGymnastics />} 
            label="Exercise" 
            pathname={pathname}
            onClick={handleNavItemClick}
          />
          <NavItem 
            href="/dashboard/moodtrend" 
            icon={<FaChartBar />} 
            label="My Mood Trend" 
            pathname={pathname}
            onClick={handleNavItemClick}
          />
          <NavItem 
            href="/dashboard/settings" 
            icon={<MdSettings />} 
            label="Settings" 
            pathname={pathname}
            onClick={handleNavItemClick}
          />

          {/* Profile & Logout Section */}
          {session && (
            <div className="fixed bottom-10 p-5 flex flex-col gap-3 items-center">
              <div
                className="relative cursor-pointer flex items-center" 
                onMouseEnter={() => setShowLogoutPopup(true)}
                onMouseLeave={() => setShowLogoutPopup(false)}
                onClick={() => setShowConfirmModal(true)}
              >
                <div className="flex justify-between items-center">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(session.user?.name)}
                    </div>
                  )}
                
                  {showLogoutPopup && (
                    <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-700 text-white text-sm rounded shadow-lg">
                      Logout
                    </div>
                  )}
                </div>
              
                <div>
                  <NavItem 
                    href="" 
                    icon={<FaUserCircle className="text-transparent" />} 
                    label="Profile" 
                    pathname={pathname}
                    onClick={handleNavItemClick}
                  />
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-0"
      }`}>
        {/* Mobile toggle button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 text-gray-800 p-2 rounded-md lg:hidden z-50"
        >
          {isSidebarOpen ? (
            <FaTimes size={24} className="fixed left-52 text-white z-50" />
          ) : (
            <FiSidebar size={24} className="-ml-4" />
          )}
        </button>

        {/* Page Content */}
        <main className={`p-4 lg:ml-0 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          {children}
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  onClick: () => void;
};

function NavItem({ href, icon, label, pathname, onClick }: NavItemProps) {
  const isActive = pathname === href; 

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        isActive ? "bg-blue-100 text-black" : "hover:bg-gray-700"
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </Link>
  );
}