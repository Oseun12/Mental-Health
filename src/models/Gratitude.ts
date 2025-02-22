import mongoose, { models, Schema } from "mongoose";

const GratitudeSchema = new Schema({
    userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Gratitude = models.Gratitude || mongoose.model('Gratitude', GratitudeSchema);

export default Gratitude;