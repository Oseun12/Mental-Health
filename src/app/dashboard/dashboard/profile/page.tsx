import React from 'react'

function page() {
  return (
    <div className='mt-10'>
      <div className='flex justify-center w-full'>
        <img src="/image/work-in-progress.webp" alt="" />
      </div>
    </div>
  )
}

export default page




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