import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { supabase } from "../../supabase";
import { generateCrosswordLayout } from "../utils/crosswordGenerator";

type CrosswordScreenProps = {
  route: { params: { level: number; userId: string } };
  navigateTo: (screen: string, params?: any) => void;
};

const CrosswordScreen: React.FC<CrosswordScreenProps> = ({
  route,
  navigateTo,
}) => {
  const { level } = route.params;
  const userId =
    route.params?.userId || "12345678-1234-5678-1234-567812345678";
  const [questions, setQuestions] = useState<any[]>([]);
  const [crossword, setCrossword] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const screenWidth = Dimensions.get("window").width;
  const gridSize = 10;
  const cellSize = screenWidth / (gridSize + 0.5);

  useEffect(() => {
    const fetchQuestions = async () => {
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

      if (data && data.length > 0) {
        const validAnswers = data.filter(
          (q) => q.answer.replace(/[^A-Za-z]/g, "").length <= 10
        );
        const crosswordData = generateCrosswordLayout(
          validAnswers.map((q) => q.answer.toUpperCase())
        );
        setCrossword(crosswordData);
        setAnswers({});
      }
    };

    fetchQuestions();
  }, [level]);

  const handleInputChange = (
    posKey: string,
    value: string,
    nextKey?: string
  ) => {
    setAnswers((prev) => ({ ...prev, [posKey]: value.toUpperCase() }));

    if (value && nextKey && inputRefs.current[nextKey]) {
      inputRefs.current[nextKey]?.focus();
    }
  };

  const checkAnswersAndSaveProgress = async () => {
    let correct = 0;
    let wrong = 0;

    crossword?.placedWords.forEach((wordObj: any) => {
      const word = wordObj.word.toUpperCase();
      let userAnswer = "";

      for (let i = 0; i < word.length; i++) {
        const key =
          wordObj.direction === "H"
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

    const nextLevel: number = correct > wrong ? level + 1 : level;

    const { error } = await supabase.from("user_progress").upsert(
      [
        {
          user_id: userId,
          level: nextLevel,
          correct_attempts: correct,
          wrong_attempts: wrong,
          last_difficulty: correct > wrong ? "Medium" : "Easy",
        },
      ],
      { onConflict: "user_id, level" }
    );

    if (error) {
      Alert.alert("Error", "Failed to save progress.");
    } else {
      Alert.alert("Result", `Correct: ${correct}, Wrong: ${wrong}`, [
        { text: "OK", onPress: () => navigateTo("Levels", { newLevel: nextLevel }) },
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
              const key = `${rowIndex}-${colIndex}`;
              const isFilled = cell !== "";
              const numberLabel = crossword.cellNumbers?.[rowIndex]?.[colIndex];
              let nextKey: string | undefined;

              if (isFilled) {
                const word =
                  crossword.placedWords.find(
                    (w) =>
                      w.direction === "H" &&
                      w.row === rowIndex &&
                      colIndex >= w.col &&
                      colIndex < w.col + w.word.length
                  ) ||
                  crossword.placedWords.find(
                    (w) =>
                      w.direction === "V" &&
                      w.col === colIndex &&
                      rowIndex >= w.row &&
                      rowIndex < w.row + w.word.length
                  );

                if (word) {
                  const indexInWord =
                    word.direction === "H"
                      ? colIndex - word.col
                      : rowIndex - word.row;
                  if (indexInWord < word.word.length - 1) {
                    const nextRow =
                      word.direction === "H" ? rowIndex : rowIndex + 1;
                    const nextCol =
                      word.direction === "H" ? colIndex + 1 : colIndex;
                    nextKey = `${nextRow}-${nextCol}`;
                  }
                }
              }

              return (
                <View
                  key={colIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderWidth: isFilled ? 1 : 0,
                    backgroundColor: isFilled ? "#fff" : "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {numberLabel && (
                    <Text
                      style={{
                        position: "absolute",
                        top: 1,
                        left: 3,
                        fontSize: 10,
                        color: "black",
                      }}
                    >
                      {numberLabel}
                    </Text>
                  )}
                  {isFilled && (
                    <TextInput
                      ref={(ref) => (inputRefs.current[key] = ref)}
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        width: "100%",
                        height: "100%",
                        padding: 1,
                      }}
                      maxLength={1}
                      value={answers[key] || ""}
                      onChangeText={(value) =>
                        handleInputChange(key, value, nextKey)
                      }
                    />
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
              {w.number}.{" "}
              {questions.find((q) => q.answer.toUpperCase() === w.word)?.question}
            </Text>
          ))}

        <Text className="text-lg font-bold text-gray-800 mt-4">Down</Text>
        {crossword?.placedWords
          .filter((w: any) => w.direction === "V")
          .map((w: any, index: number) => (
            <Text key={index} className="text-md text-gray-600">
              {w.number}.{" "}
              {questions.find((q) => q.answer.toUpperCase() === w.word)?.question}
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
