import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RelaxationExercise() {
  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Relaxation Techniques</h1>
      <p className="text-gray-600 mb-6">
        Try these relaxation techniques to reduce stress and feel more present.
      </p>

      <ul className="text-left space-y-3">
        <li>🧘‍♂️ Find a quiet space and close your eyes.</li>
        <li>🎵 Listen to calming music or nature sounds.</li>
        <li>🌿 Take slow, deep breaths.</li>
        <li>💆 Stretch your body and relax your muscles.</li>
      </ul>

      <Link href="/mindfulness">
        <Button className="mt-6 w-full bg-gray-500 hover:bg-gray-600">Back to Mindfulness</Button>
      </Link>
    </div>
  );
}
