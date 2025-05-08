import { supabase } from "../../supabase";

export const getUserProgress = async (userId: string) => {
    const { data, error } = await supabase
        .from("user_progress")
        .select("level, last_difficulty")
        .eq("user_id", userId)
        .order("level", { ascending: false }) // Get the highest level first
        .limit(1); // Only fetch the latest progress entry

    if (error || !data || data.length === 0) {
        console.error("Error fetching user progress:", error);
        return { level: 1, last_difficulty: "Medium" }; // Default values
    }

    return data[0]; // Return the highest level progress
};

export const fetchCrosswordQuestions = async (userId: string, level: number) => {
    try {
        const userProgress = await getUserProgress(userId);
        const difficulty = userProgress.last_difficulty;

        const {data: questions, error } = await supabase
        .from("crossword_questions")
        .select("id, question, answer, difficulty")
        .eq("level",level)
        .eq("difficulty", difficulty)
        .order("times_wrong", { ascending: true }) //Priortize easy questions if struggling
        .limit(4);

    
        if(error) throw error;

        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
};