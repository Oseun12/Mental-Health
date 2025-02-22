import mongoose, { models, Schema } from "mongoose";

const MoodSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    mood : {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    sentimentScore: { 
        type: Number 
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    }
},
{
    timestamps: true
});

const Mood = models.Mood || mongoose.model('Mood', MoodSchema);

export default Mood;