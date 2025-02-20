export async function GET() {
    const exercises = [
      {
        id: 1,
        title: "Deep Breathing Exercise",
        description: "Inhale deeply for 4 seconds, hold for 4 seconds, and exhale for 4 seconds. Repeat for 5 minutes.",
      },
      {
        id: 2,
        title: "Gratitude Reflection",
        description: "Write down 3 things you're grateful for today and reflect on how they make you feel.",
      },
      {
        id: 3,
        title: "Positive Affirmation",
        description: "Repeat this: 'I am strong, I am capable, and I am worthy of happiness.'",
      },
      {
        id: 4,
        title: "Mindful Meditation",
        description: "Close your eyes, take slow breaths, and focus on the present moment for 5 minutes.",
      },
    ];
  
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
  
    return Response.json({ exercise: randomExercise });
  }
  