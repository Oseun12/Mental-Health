export const MOOD_SCORES = {
    "Happy 😊": 4,
    "Sad 😢": 1,
    "Neutral 😐": 3,
    "Stressed 😖": 2,
    "Excited 🤩": 5
  } as const;
  
  export type MoodType = keyof typeof MOOD_SCORES;