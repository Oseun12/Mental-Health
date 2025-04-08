"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function MindfulMeditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(300); 
  const [remainingTime, setRemainingTime] = useState(duration);
  const [showComplete, setShowComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const guides = [
    {
      id: 1,
      title: "Body Scan Meditation",
      description: "Release tension from head to toe",
      duration: "8 min",
      icon: "🧘‍♀️"
    },
    {
      id: 2,
      title: "Breath Awareness",
      description: "Focus on the rhythm of your breath",
      duration: "5 min",
      icon: "🌬️"
    },
    {
      id: 3,
      title: "Loving-Kindness",
      description: "Cultivate compassion for yourself and others",
      duration: "10 min",
      icon: "💖"
    }
  ];

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && isPlaying) {
      setIsPlaying(false);
      setShowComplete(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, remainingTime]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowComplete(false);
    if (!isPlaying && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setRemainingTime(duration);
    setShowComplete(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const changeDuration = (minutes: number) => {
    setDuration(minutes * 60);
    setRemainingTime(minutes * 60);
    setIsPlaying(false);
    setShowComplete(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const selectGuide = (id: number) => {
    setActiveGuide(id === activeGuide ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      {/* Background ambient audio (hidden) */}
      <audio 
        ref={audioRef} 
        src="/audio/meditation-ambient.mp3" 
        loop
      />
      
      <div className="max-w-xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-purple-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-purple-900/30 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl font-bold text-white font-serif mb-2">Mindful Meditation</h1>
              <p className="text-purple-100">Find your center, one breath at a time</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Timer Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
                {/* Progress circle */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#EDE9FE"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (remainingTime / duration))}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                {/* Timer text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-light text-gray-800">
                    {formatTime(remainingTime)}
                  </span>
                  {showComplete && (
                    <span className="text-sm text-green-600 font-medium mt-2 animate-pulse">
                      Well done!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button 
                onClick={togglePlayPause}
                size="lg"
                className={`rounded-full px-8 ${isPlaying ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Begin
                  </>
                )}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="rounded-full px-6"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Session Length</h3>
            <div className="flex justify-center space-x-3">
              {[5, 10, 15].map((mins) => (
                <Button
                  key={mins}
                  onClick={() => changeDuration(mins)}
                  variant={duration === mins * 60 ? 'default' : 'outline'}
                  className={`rounded-full ${duration === mins * 60 ? 'bg-indigo-600' : ''}`}
                >
                  {mins} min
                </Button>
              ))}
            </div>
          </div>

          {/* Guided Meditations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guided Practices</h3>
            <div className="space-y-3">
              {guides.map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => selectGuide(guide.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${activeGuide === guide.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${activeGuide === guide.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      <span className="text-xl">{guide.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${activeGuide === guide.id ? 'text-purple-800' : 'text-gray-800'}`}>
                          {guide.title}
                        </h4>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          {guide.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meditation Tips */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 mb-8">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Meditation Tip</h3>
                <p className="text-gray-600 text-sm">
                  There is no &ldquo;right&rdquo; way to meditate. If your mind wanders, simply notice it and gently return your focus. This is the practice.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <Link href="/dashboard/mindfulness">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Mindfulness
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}