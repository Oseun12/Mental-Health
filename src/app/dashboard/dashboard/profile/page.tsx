'use client'


import React from 'react';

function UnderDevelopment() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center">
        {/* SVG Illustration */}
        <div className="mx-auto w-64 h-64 mb-8">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#EFF6FF" />
            <path 
              d="M70 70 L130 70 L130 130 L70 130 Z" 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="8"
            />
            <path 
              d="M85 85 L115 85 L115 115 L85 115 Z" 
              fill="#3B82F6" 
              opacity="0.2"
            />
            <path 
              d="M70 70 L130 130 M70 130 L130 70" 
              stroke="#EF4444" 
              strokeWidth="4" 
              strokeDasharray="8 4"
            />
            <circle cx="100" cy="100" r="30" fill="white" stroke="#3B82F6" strokeWidth="2" />
            <text 
              x="100" 
              y="105" 
              textAnchor="middle" 
              fontSize="24" 
              fontWeight="bold" 
              fill="#3B82F6"
            >
              !
            </text>
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Work in Progress</h1>
        <p className="text-lg text-gray-600 mb-6">
          This page is currently under development. Our team is working hard to bring you an amazing experience soon!
        </p>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
            style={{ width: '60%' }}
          ></div>
        </div>

        {/* Action button */}
        <button
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default UnderDevelopment;




// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "react-toastify";
// import { Loader2 } from "lucide-react";

// // Default profile data
// const defaultProfile = {
//   name: "",
//   bio: "",
//   goal: "Improve my mental wellbeing",
//   theme: "light",
//   notifications: true,
// };

// export default function ProfilePage() {
//   const [formData, setFormData] = useState(defaultProfile);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // Load profile from localStorage
//   useEffect(() => {
//     const loadProfile = () => {
//       try {
//         const savedProfile = localStorage.getItem("profile");
//         if (savedProfile) {
//           setFormData(JSON.parse(savedProfile));
//         }
//       } catch (error) {
//         console.error("Failed to load profile", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

//   // Apply theme whenever it changes
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", formData.theme === "dark");
//   }, [formData.theme]);

//   const handleSave = () => {
//     setIsSaving(true);
//     try {
//       // Simulate API call with timeout
//       setTimeout(() => {
//         localStorage.setItem("profile", JSON.stringify(formData));
//         toast.success("Profile updated successfully!");
//         setIsSaving(false);
//       }, 800);
//     } catch (error) {
//       console.log(error)
//       toast.error("Failed to save profile");
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
//             Profile Settings
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300">
//             Manage your account preferences
//           </p>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Name
//             </label>
//             <Input
//               type="text"
//               placeholder="Your name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div> */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Bio
//             </label>
//             <Textarea
//               placeholder="Tell us about yourself"
//               value={formData.bio}
//               onChange={(e) =>
//                 setFormData({ ...formData, bio: e.target.value })
//               }
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               rows={3}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Mental Health Goal
//             </label>
//             <Input
//               type="text"
//               placeholder="Your wellness goal"
//               value={formData.goal}
//               onChange={(e) =>
//                 setFormData({ ...formData, goal: e.target.value })
//               }
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>

//           {/* <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Dark Mode
//               </label>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Toggle between light and dark theme
//               </p>
//             </div>
//             <Switch
//               checked={formData.theme === "dark"}
//               onCheckedChange={(value) =>
//                 setFormData({ ...formData, theme: value ? "dark" : "light" })
//               }
//             />
//           </div> */}

//           <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Notifications
//               </label>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Receive important updates
//               </p>
//             </div>
//             <Switch
//               checked={formData.notifications}
//               onCheckedChange={(value) =>
//                 setFormData({ ...formData, notifications: value })
//               }
//             />
//           </div>

//           <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="bg-teal-900 hover:bg-teal-700 dark:bg-blue-700 dark:hover:bg-blue-800"
//             >
//               {isSaving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }