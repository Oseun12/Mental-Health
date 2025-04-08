// import { QueryClient } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-persist-client-sync-storage";

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: Infinity,
//       cacheTime: 1000 * 60 * 60 * 24, 
//     },
//   },
// });

// const localStoragePersister = createSyncStoragePersister({
//   storage: typeof window !== "undefined" ? window.localStorage : undefined,
// });

// if (typeof window !== "undefined") {
//   persistQueryClient({
//     queryClient,
//     persister: localStoragePersister,
//     maxAge: 1000 * 60 * 60 * 24,
//   });
// }












// // import { QueryClient } from "@tanstack/react-query";
// // import { persistQueryClient } from "@tanstack/react-query-persist-client";
// // import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// // export const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       staleTime: Infinity,
// //       cacheTime: 1000 * 60 * 60 * 24, 
// //     },
// //   },
// // });

// // if (typeof window !== "undefined") {
// //   const persister = createSyncStoragePersister({
// //     storage: window.localStorage,
// //   });

// //   persistQueryClient({
// //     queryClient,
// //     persister,
// //   });
// // }
