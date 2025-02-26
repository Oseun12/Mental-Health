import connectViaMongoose from "@/lib/db"
import Mood from "@/models/Mood";

export const getAllMMood = async () => {
    try {
        await connectViaMongoose();
        const moods = await Mood.find();
        return JSON.parse(JSON.stringify(moods));
    } catch (error) {
        console.error("Error fetching moods: ", error);
        return []
    }
};