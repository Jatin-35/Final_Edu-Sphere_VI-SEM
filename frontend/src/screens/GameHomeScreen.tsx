import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

interface GameHomeScreenProps {
  navigateTo: (screen: string) => void;
}

const GameHomeScreen: React.FC<GameHomeScreenProps> = ({ navigateTo }) => {
  return (
    <ImageBackground
      source={require("../../assets/images/GameBG.jpg")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      {/* Black Overlay */}
      <View className="absolute inset-0 bg-black/50" />

      {/* Crossword Heading */}
      <Text className="text-white text-6xl font-extrabold text-center mb-12">
        CROSSWORD PUZZLE
      </Text>

      {/* Adventure-Themed Box */}
      <View className="bg-white px-8 py-6 rounded-lg border-4 border-yellow-700 shadow-xl w-4/5">
        <Text className="text-black text-2xl font-bold text-center">Welcome, EduLearner!</Text>
        <Text className="text-gray-700 text-center mt-2">
          Are you ready for an epic journey?
        </Text>

        {/* Start Button */}
        <TouchableOpacity className="mt-4 bg-yellow-700 px-6 py-3 rounded-lg shadow-md 
                                    border-b-4 border-yellow-900 active:border-b-2" onPress={() => navigateTo("Levels")}>
          <Text className="text-white text-lg font-bold text-center">Start Game</Text>
          
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default GameHomeScreen;