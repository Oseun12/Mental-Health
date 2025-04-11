"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RiEditLine, RiCloseLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  sentimentScore: number;
}

// interface SyncStoragePersisterOptions {
//   storage?: Storage;
//   key?: string;
//   throttleTime?: number;
// }

// interface PersistQueryClientOptions {
//   queryClient: QueryClient;
//   persister: ReturnType<typeof createSyncStoragePersister>;
//   maxAge?: number;
//   buster?: string;
// }

// function createSyncStoragePersister(options: SyncStoragePersisterOptions) {
//   const { storage = window.localStorage, key = 'REACT_QUERY_OFFLINE_CACHE'} = options;

//   return {
//     restoreClient: async (): Promise<PersistedClient | undefined> => {
//       const cacheString = await storage.getItem(key);
//       if (!cacheString) return undefined;
//       try {
//         return JSON.parse(cacheString) as PersistedClient;
//       } catch (err) {
//         console.warn("Failed to parse persisted query cache:", err);
//         return undefined;
//       }
//     },
//     persistClient: async (client: PersistedClient): Promise<void> => {
//       try {
//         const cacheString = JSON.stringify(client);
//         await storage.setItem(key, cacheString);
//       } catch (err) {
//         console.warn("Failed to persist query cache:", err);
//       }
//     },
//     removeClient: async (): Promise<void> => {
//       await storage.removeItem(key);
//     },
//   };
// }


// function persistQueryClient({ queryClient, persister, maxAge = 1000 * 60 * 60 * 24 }: PersistQueryClientOptions) {
//   persister.restoreClient().then((cachedClient: PersistedClient | undefined) => {
//     if (cachedClient?.timestamp) {
//       const isFresh = Date.now() - cachedClient.timestamp < maxAge;
//       if (isFresh && cachedClient.clientState) {  
//         queryClient.setState(cachedClient.clientState);  
//       }
//     }
//   });

//   queryClient.getQueryCache().subscribe(() => {
//     const client: PersistedClient = {
//       timestamp: Date.now(),
//       clientState: queryClient.getQueryCache().getAll(),  
//     };
//     persister.persistClient(client);
//   });
// }


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
      storage: window.localStorage,
    });

    // Persist the client
    persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24, 
    });
  }, [queryClient]);

  
  const { data: journals, isLoading, isError, isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await fetch("/api/journal");
      if (!res.ok) throw new Error("Failed to fetch journals");
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
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["journals"] });
      const previousJournals = queryClient.getQueryData(["journals"]);
      
      queryClient.setQueryData(["journals"], (old: { journals?: JournalEntry[] } | undefined) => ({
        journals: [...(old?.journals || []), {
          _id: Date.now().toString(),
          title,
          content,
          createdAt: new Date(),
          sentimentScore: 0
        }]
      }));
      
      return { previousJournals };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["journals"], context?.previousJournals);
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["journals"] });
      const previousJournals = queryClient.getQueryData(["journals"]);
      
      queryClient.setQueryData(["journals"], (old: { journals?: JournalEntry[] } | undefined) => ({
        journals: old?.journals?.filter((journal: JournalEntry) => journal._id !== id)
      }));
      
      return { previousJournals };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["journals"], context?.previousJournals);
    },
    onSettled: () => {
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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 p-10 mt-20">
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Updating...</span>
          </div>
        </div>
      )}

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
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 min-w-24"
            >
              {editingEntry ? (
                updateMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Entry"
                )
              ) : createMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Entry"
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Journal Entries List */}
      {isLoading ? (
         <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 ">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Failed to load journals</h3>
          <p className="text-gray-500 mb-4">Please try again later</p>
          <Button onClick={() => queryClient.refetchQueries({ queryKey: ["journals"] })}>
            Retry
          </Button>
        </div>
      ) : journalsArray.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
                className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 min-w-20"
              >
                {deleteMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div> 
          </div>
        </div>
      )}
    </div>
  );
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
