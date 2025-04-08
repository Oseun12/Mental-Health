// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";

// export default function MindfulnessDashboard() {
//   const { data, refetch, isLoading } = useQuery({
//     queryKey: ["mindfulnessExercise"],
//     queryFn: async () => {
//       const res = await fetch("/api/mindfulness");
//       return res.json();
//     },
//   });

//   return (
//     <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow-md text-center">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Mindfulness Exercise</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div>
//           <h3 className="text-xl font-semibold text-blue-600">{data?.title}</h3>
//           <p className="text-gray-700 mt-2">{data?.description}</p>
//         </div>
//       )}
//       <Button onClick={() => refetch()} className="mt-4 bg-blue-500 hover:bg-blue-600">
//         Get Another Exercise
//       </Button>
//     </div>
//   );
// }
