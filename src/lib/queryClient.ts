// import { QueryClient } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: Infinity,
//       cacheTime: 1000 * 60 * 60 * 24, 
//     },
//   },
// });

// if (typeof window !== "undefined") {
//   const persister = createSyncStoragePersister({
//     storage: window.localStorage,
//   });

//   persistQueryClient({
//     queryClient,
//     persister,
//   });
// }
