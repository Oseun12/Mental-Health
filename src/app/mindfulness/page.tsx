import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MindfulnessPage() {
  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mindfulness Exercises</h1>
      <p className="text-gray-600 mb-6">
        Take a moment to relax and practice mindfulness. These exercises can help reduce stress and improve focus.
      </p>

      <div className="space-y-4">
        <Link href="/mindfulness/breathing">
          <Button className="w-full bg-blue-500 hover:bg-blue-600">Guided Breathing</Button>
        </Link>
        <Link href="/mindfulness/relaxation">
          <Button className="w-full bg-green-500 hover:bg-green-600">Relaxation Techniques</Button>
        </Link>
      </div>
    </div>
  );
}
