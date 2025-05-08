import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { getUserProgress } from "../utils/supabaseService";

interface Props {
  navigateTo: (screen: string, params?: any) => void;
  newLevel?: number; // Passed from CrosswordScreen
}

const GameLevelsScreen: React.FC<Props> = ({ navigateTo, newLevel }) => {
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
  const userId = "12345678-1234-5678-1234-567812345678"; // Static user for now

  useEffect(() => {
    const fetchProgress = async () => {
      const userProgress = await getUserProgress(userId);
      if (userProgress) {
        const highestLevel = Math.max(userProgress.level, newLevel || 1);
        console.log("Fetched highest level:", highestLevel);
        setUnlockedLevels(highestLevel);
      }
    };

    fetchProgress();
  }, [newLevel]); // Runs again when newLevel updates

  useEffect(() => {
    console.log("Unlocked levels:", unlockedLevels);
  }, [unlockedLevels]); // Debugging log to verify state changes

  const handleLevelSelect = (level: number) => {
    navigateTo("Crossword", { level, userId });
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-3xl font-bold text-center mb-4">
        Select Level
      </Text>
      <ScrollView>
        {Array.from({ length: 7 }, (_, i) => i + 1).map((level) => (
          <TouchableOpacity
            key={level}
            className={`m-2 px-6 py-4 rounded-lg ${
              level <= unlockedLevels ? "bg-yellow-600" : "bg-gray-600 opacity-50"
            }`}
            disabled={level > unlockedLevels}
            onPress={() => handleLevelSelect(level)}
          >
            <Text className="text-white text-lg font-bold text-center">
              Level {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default GameLevelsScreen;