import mongoose, { models, Schema } from "mongoose";

const MOOD_SCORES = {
    "Happy 😊": 4,
    "Sad 😢": 1,
    "Neutral 😐": 3,
    "Stressed 😖": 2,
    "Excited 🤩": 5
  };

const MoodSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    mood : {
        type: String,
        required: true,
        enum: Object.keys(MOOD_SCORES)
    },
    note: {
        type: String
    },
    sentimentScore: { 
        type: Number,
        required: true,
        min: 1,
        max: 5 
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    }
},
{
    timestamps: true
});


// Add pre-save hook to automatically set sentimentScore
MoodSchema.pre('save', function(next) {
    this.sentimentScore = MOOD_SCORES[this.mood as keyof typeof MOOD_SCORES];
    next();
});
  

const Mood = models.Mood || mongoose.model('Mood', MoodSchema);

export default Mood;