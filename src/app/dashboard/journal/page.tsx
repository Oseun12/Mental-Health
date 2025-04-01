"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RiEditLine, RiCloseLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  sentimentScore: number;
}

export default function JournalPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const persister = createSyncStoragePersister({
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    });

    persistQueryClient({
      queryClient,
      persister,
    });
  }, [queryClient]);

  const { data: journals } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await fetch("/api/journal");
      return res.json();
    },
    enabled: !!session,
    staleTime: Infinity,
  });

  const journalsArray: JournalEntry[] = Array.isArray(journals?.journals)
    ? journals.journals
    : [];

  const createMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setTitle("");
      setContent("");
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/journal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete journal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingEntry) return;
      const res = await fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingEntry._id, title, content }),
      });
      if (!res.ok) throw new Error("Failed to update journal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setTitle("");
      setContent("");
      setEditingEntry(null);
      setIsFormOpen(false);
    },
  });

  const handleDelete = (id: string) => {
    setJournalToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (journalToDelete) {
      deleteMutation.mutate(journalToDelete);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingEntry) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const getSentimentLabel = (score: number) => {
    if (score > 1) return "😊 Positive";
    if (score < -1) return "😞 Negative";
    return "😐 Neutral";
  };

  const getSentimentColor = (score: number) => {
    if (score > 1) return "bg-green-100 text-green-800";
    if (score < -1) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 p-10 mt-20 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Journal Entries</h1>
        <Button
          onClick={() => {
            setEditingEntry(null);
            setTitle("");
            setContent("");
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <FiPlus size={18} />
          New Entry
        </Button>
      </div>

      {/* Journal Form */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingEntry ? "Edit Entry" : "New Journal Entry"}
            </h2>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <RiCloseLine size={24} />
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Entry Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg h-48 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title || !content || createMutation.isPending || updateMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {editingEntry 
                ? updateMutation.isPending ? "Updating..." : "Update Entry"
                : createMutation.isPending ? "Creating..." : "Create Entry"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Journal Entries List */}
      {journalsArray.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No entries yet</h3>
            <p className="text-gray-500 mb-4">Your journal entries will appear here</p>
            <Button onClick={() => setIsFormOpen(true)}>
              Create your first entry
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {journalsArray.map((journal) => (
            <div
              key={journal._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{journal.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line mb-4">{journal.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(journal)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(journal._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {new Date(journal.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full ${getSentimentColor(journal.sentimentScore)}`}>
                    {getSentimentLabel(journal.sentimentScore)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Journal Entry</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div> 
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions for query persistence
function createSyncStoragePersister(options: any) {
  return {
    restoreClient: () => {},
    persistClient: () => {},
    removeClient: () => {},
    ...options
  };
}

function persistQueryClient(options: any) {
  // Implementation would go here
}















// "use client";

// import {  useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { RiEditLine } from "react-icons/ri";
// import { HiOutlineTrash } from "react-icons/hi2";
// import { persistQueryClient } from '@tanstack/react-query-persist-client'
// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// interface JournalEntry {
//   _id: string;
//   title: string;
//   content: string;
//   createdAt: Date;
//   sentimentScore: number;
// }

// export default function JournalPage() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
//   const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
//   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  

//   const { data: session } = useSession();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const persister = createSyncStoragePersister({
//       storage: typeof window !== 'undefined' ? window.localStorage : undefined,
//     });

//     persistQueryClient({
//       queryClient,
//       persister,
//     });
//   }, [queryClient]);

//   // const persister = createSyncStoragePersister({
//   //   storage: window.localStorage,
//   // })


//   // persistQueryClient({
//   //   queryClient,
//   //   persister,
//   // })
  
//   const { data: journals } = useQuery({
//     queryKey: ["journals"],
//     queryFn: async () => {
//       const res = await fetch("/api/journal");
//       return res.json();
//     },
//     enabled: !!session,
//     staleTime: Infinity,
//   });

//   const journalsArray: JournalEntry[] = Array.isArray(journals?.journals)
//     ? journals.journals
//     : [];

//   const createMutation = useMutation({
//     mutationFn: async () => {
//       await fetch("/api/journal", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, content }),
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["journals"] });
//       setTitle("");
//       setContent("");
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await fetch("/api/journal", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       if (!res.ok) throw new Error("Failed to delete journal");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["journals"] });
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: async () => {
//       if (!editingEntry) return;
//       const res = await fetch("/api/journal", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: editingEntry._id, title, content }),
//       });
//       if (!res.ok) throw new Error("Failed to update journal");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["journals"] });
//       setTitle("");
//       setContent("");
//       setEditingEntry(null);
//     },
//   });

//   const handleDelete = (id: string) => {
//     setJournalToDelete(id);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     if (journalToDelete) {
//       deleteMutation.mutate(journalToDelete);
//       setDeleteModalOpen(false);
//     }
//   };

//   const handleEdit = (entry: JournalEntry) => {
//     setEditingEntry(entry);
//     setTitle(entry.title);
//     setContent(entry.content);
//   };

//   const handleSave = () => {
//     if (editingEntry) {
//       updateMutation.mutate();
//     } else {
//       createMutation.mutate();
//     }
//   };

//   const getSentimentLabel = (score: number) => {
//     if (score > 1) return "😊 Positive";
//     if (score < -1) return "😞 Negative";
//     return "😐 Neutral";
//   };


//   return (
//     <div className="">
//       {/* Form with Background Image */}
//       <div 
//         className="relative rounded-t-xl overflow-hidden mb-8 shadow-lg min-h-[600px] flex items-center"
//         style={{
//           backgroundImage: "url('/image/portrait-person-practicing-yoga-clouds.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center"
//         }}
//       >
//        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           <div className="relative z-10 p-8 w-full max-w-4xl mx-auto"> {/* Removed padding from inner div */}
//             <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-md">
//               <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Journal</h1> {/* Changed text color to gray for better contrast */}
//               <input
//                 type="text"
//                 placeholder="Journal Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <textarea
//                 placeholder="Write your thoughts here..."
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="w-full p-3 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <Button
//                 onClick={handleSave}
//                 className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
//               >
//                 {editingEntry ? "Update Entry" : "Save Entry"}
//               </Button>
//             </div>
//           </div>
//         </div>
  
//       {/* Journal Entries List */}
//       <div className="px-6 pb-10 max-w-screen-lg mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
//           Previous Entries
//         </h2>
        
//         {journalsArray.length === 0 ? (
//           <div className="text-center py-10">
//             <p className="text-gray-500">No journal entries yet. Start writing!</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {journalsArray.map((journal: JournalEntry) => (
//               <div
//                 key={journal._id}
//                 className="group p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-gray-500"
//               >
//                 <div className="flex justify-between">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold text-gray-800 mb-2">{journal.title}</h3>
//                     <p className="text-gray-600 mb-3 whitespace-pre-line">{journal.content}</p>
//                     <div className="flex items-center space-x-4 text-sm">
//                       <span className="text-gray-500">
//                         {new Date(journal.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         journal.sentimentScore > 1 
//                           ? 'bg-green-100 text-green-800' 
//                           : journal.sentimentScore < -1 
//                             ? 'bg-red-100 text-red-800' 
//                             : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {getSentimentLabel(journal.sentimentScore)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <button
//                       onClick={() => handleEdit(journal)}
//                       className="p-2 text-indigo-600 hover:text-indigo-800  rounded-full transition-colors duration-200"
//                       title="Edit"
//                     >
//                       <RiEditLine size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(journal._id)}
//                       className="p-2 text-red-600 hover:text-red-800  rounded-full transition-colors duration-200"
//                       title="Delete"
//                     >
//                       <HiOutlineTrash size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
  
//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
