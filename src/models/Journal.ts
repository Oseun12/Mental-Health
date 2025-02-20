import mongoose, { Schema, models } from "mongoose";

const JournalSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Journal = models.Journal || mongoose.model("Journal", JournalSchema);

export default Journal;
