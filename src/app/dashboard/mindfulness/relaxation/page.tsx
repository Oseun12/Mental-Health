import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RelaxationExercise() {
  return (
    <div className="min-h-screen bg-gradient-to-b flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        {/* Header with calming image */}
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/image/group-people-exercising-together-outdoors.jpg')" }}
        >
          <div className="absolute inset-0 bg-indigo-600/30 backdrop-blur-[1px] flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white text-center px-4 drop-shadow-lg">
              Relaxation Techniques
            </h1>
          </div>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-8 text-center text-lg">
            Reduce stress and feel more present with these calming practices
          </p>

          {/* Techniques cards */}
          <div className="space-y-4 mb-8">
            {[
              {
                icon: "🧘‍♀️",
                title: "Find Your Space",
                description: "Choose a quiet place and close your eyes to minimize distractions"
              },
              {
                icon: "🎵",
                title: "Calming Sounds",
                description: "Listen to soft music, nature sounds, or white noise"
              },
              {
                icon: "🌬️",
                title: "Deep Breathing",
                description: "Inhale slowly for 4 counts, hold for 4, exhale for 6 counts"
              },
              {
                icon: "💆",
                title: "Body Scan",
                description: "Progressively relax each muscle group from head to toe"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/mindfulness" className="block">
            <Button 
              variant="outline"
              className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              Back to Mindfulness
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}