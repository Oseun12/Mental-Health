import Link from "next/link";
// import { Button } from "@/components/ui/button";

export default function MindfulnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 bg-indigo-300 rounded-full animate-pulse-slow"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 font-serif">Mindful Moments</h1>
          <p className="text-lg text-gray-600">
            Cultivate peace through these <span className="text-indigo-500">science-backed</span> practices
          </p>
        </div>

        {/* Exercise Cards with Duration Indicators */}
        <div className="space-y-6 mb-10">
          <Link href="/dashboard/mindfulness/breathing">
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative p-6 flex items-center">
                <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-blue-50">
                  <span className="text-blue-500 text-2xl">🌊</span>
                </div>
                <div className="ml-5 flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800">Ocean Breath</h2>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      5 min
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Ujjayi breathing to calm your nervous system</p>
                  <div className="mt-3 flex items-center">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-400 h-1.5 rounded-full animate-progress"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">65% effective</span>
                  </div>
                </div>
                <div className="ml-4 text-gray-300 group-hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/mindfulness/relaxation">
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-teal-100 opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative p-6 flex items-center">
                <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-green-50">
                  <span className="text-green-500 text-2xl">🌿</span>
                </div>
                <div className="ml-5 flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800">Body Scan</h2>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      10 min
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Progressive muscle relaxation technique</p>
                  <div className="mt-3 flex items-center">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-green-400 h-1.5 rounded-full animate-progress"
                        style={{ width: '82%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">82% effective</span>
                  </div>
                </div>
                <div className="ml-4 text-gray-300 group-hover:text-green-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Additional Exercise Card */}
          <Link href="/dashboard/mindfulness/meditation">
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative p-6 flex items-center">
                <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-purple-50">
                  <span className="text-purple-500 text-2xl">🕉️</span>
                </div>
                <div className="ml-5 flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800">Mindful Meditation</h2>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      15 min
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Focus your awareness on the present moment</p>
                  <div className="mt-3 flex items-center">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-purple-400 h-1.5 rounded-full animate-progress"
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">78% effective</span>
                  </div>
                </div>
                <div className="ml-4 text-gray-300 group-hover:text-purple-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Daily Mindfulness Tip */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <span className="text-indigo-500">💡</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Daily Tip</h3>
              <p className="text-sm text-gray-600">
                Try the <span className="text-indigo-500 font-medium">5-5-5 method</span>: 
                Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        {/* <div className="flex justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back
            </Button>
          </Link>
          <Link href="/dashboard/mindfulness/history">
            <Button variant="ghost" className="text-indigo-500 hover:text-indigo-700">
              Your Progress
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}