import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { supabase } from "../../supabase";
import { generateCrosswordLayout } from "../utils/crosswordGenerator";

type CrosswordScreenProps = {
  route: { params: { level: number; userId: string } };
  navigateTo: (screen: string, params?: any) => void;
};

const CrosswordScreen: React.FC<CrosswordScreenProps> = ({ route, navigateTo}) => {
  const { level } = route.params;
  const userId = route.params?.userId || "12345678-1234-5678-1234-567812345678";
  const [questions, setQuestions] = useState<any[]>([]);
  const [crossword, setCrossword] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const gridSize = 10;
  const cellSize = screenWidth / (gridSize + 0.5);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("Fetching questions for level:", level);
  
      const { data, error } = await supabase
        .from("crossword_questions")
        .select("id, question, answer, difficulty")
        .eq("level", level)
        .order("difficulty", { ascending: true })
        .limit(level + 3);
  
      if (error) {
        console.error("Error fetching questions:", error);
        return;
      }
  
      setQuestions(data || []);
  
      // Generate crossword only if there are valid questions
      if (data && data.length > 0) {
        console.log("Generating crossword layout...");
        const validAnswers = data.filter(q => q.answer.replace(/[^A-Za-z]/g, '').length <= 10);
        const crosswordData = generateCrosswordLayout(validAnswers.map(q => q.answer.toUpperCase()));
        console.log("Generated crossword data:", crosswordData);
        setCrossword(crosswordData);
        setAnswers({});
      }
    };
  
    fetchQuestions();
  }, [level]); // ✅ Added `level` as a dependency
  

  const handleInputChange = (posKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [posKey]: value.toUpperCase() }));
  };

  const checkAnswersAndSaveProgress = async () => {
    let correct = 0;
    let wrong = 0;

    crossword?.placedWords.forEach((wordObj: any) => {
      const word = wordObj.word.toUpperCase();
      let userAnswer = "";

      for (let i = 0; i < word.length; i++) {
        const key = wordObj.direction === "H"
          ? `${wordObj.row}-${wordObj.col + i}`
          : `${wordObj.row + i}-${wordObj.col}`;
        userAnswer += answers[key] || " ";
      }

      if (userAnswer === word) {
        correct++;
      } else {
        wrong++;
      }
    });

    setCorrectCount(correct);
    setWrongCount(wrong);

    const nextLevel: number = correct > wrong ? level + 1 : level;

    // Update user progress in Supabase
    const { error } = await supabase
      .from("user_progress")
      .upsert(
        [
          {
            user_id: userId,
            level: nextLevel,
            correct_attempts: correct,
            wrong_attempts: wrong,
            last_difficulty: correct > wrong ? "Medium" : "Easy",
          },
        ],
        { onConflict: "user_id, level" } // Fix for unique constraint issue
      );

    if (error) {
      console.error("Error updating progress:", error);
      Alert.alert("Error", "Failed to save progress.");
    } else {
      Alert.alert("Result", `Correct: ${correct}, Wrong: ${wrong}`, [
        { text: "OK", onPress: () => navigateTo("Levels", {newLevel: nextLevel}) },
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-3xl font-bold text-center text-blue-700 mb-4">
        Level {level} Crossword
      </Text>

      <View className="flex-row flex-wrap justify-center">
        {crossword?.grid.map((row: any[], rowIndex: number) => (
          <View key={rowIndex} className="flex-row">
            {row.map((cell, colIndex) => {
              const cellData = crossword.placedWords.find(
                (w: any) => w.row === rowIndex && w.col === colIndex
              );

              return (
                <View
                  key={colIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderWidth: cell !== "" ? 1 : 0,
                    backgroundColor: cell !== "" ? "#fff" : "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {cell !== "" && (
                    <>
                      {cellData?.number && (
                        <Text style={{ position: "absolute", top: 2, left: 2, fontSize: 10 }}>
                          {cellData.number}
                        </Text>
                      )}
                      <TextInput
                        style={{
                          fontSize: 18,
                          textAlign: "center",
                          width: "100%",
                          height: "100%",
                          padding: 1,
                        }}
                        maxLength={1}
                        onChangeText={(value) =>
                          handleInputChange(`${rowIndex}-${colIndex}`, value)
                        }
                      />
                    </>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View className="mt-6">
        <Text className="text-lg font-bold text-gray-800">Across</Text>
        {crossword?.placedWords
          .filter((w: any) => w.direction === "H")
          .map((w: any, index: number) => (
            <Text key={index} className="text-md text-gray-600">
              {w.number}. {questions.find((q) => q.answer.toUpperCase() === w.word)?.question}
            </Text>
          ))}

        <Text className="text-lg font-bold text-gray-800 mt-4">Down</Text>
        {crossword?.placedWords
          .filter((w: any) => w.direction === "V")
          .map((w: any, index: number) => (
            <Text key={index} className="text-md text-gray-600">
              {w.number}. {questions.find((q) => q.answer.toUpperCase() === w.word)?.question}
            </Text>
          ))}
      </View>

      <TouchableOpacity
        className="mt-6 bg-blue-600 px-6 py-3 rounded-lg shadow-md active:bg-blue-800"
        onPress={checkAnswersAndSaveProgress}
      >
        <Text className="text-white text-lg font-bold text-center">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CrosswordScreen;