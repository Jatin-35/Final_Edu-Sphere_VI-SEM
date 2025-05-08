import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  navigateTo: (screen: string) => void;
}

const HomeScreen = ({ navigateTo }: HomeScreenProps) => {
  return (
    <View
      className="flex-1 justify-center items-center bg-white p-6"
      accessibilityLabel="Home Screen"
    >
      {/* Image Section */}
      <View className="mb-12">
        <Image
          source={require("../../assets/images/HomeScreen.jpg")}
          style={{ height: width * 0.7, width: width * 0.8 }}
          resizeMode="contain"
          accessibilityLabel="Home screen illustration"
        />
      </View>

      {/* Text Section */}
      <Text
        className="text-5xl font-bold text-gray-800 mb-4"
        accessibilityRole="header"
      >
        EduSphere
      </Text>
      <Text className="text-2xl text-gray-600 mb-12" accessibilityRole="text">
        Where Learning Finds a Friend
      </Text>

      {/* Buttons */}
      <View
        className="relative flex-row items-center justify-center w-full"
        accessibilityLabel="Login and Signup options"
      >
        {/* Login Button */}
        <TouchableOpacity
          onPress={() => navigateTo("Login")}
          className="bg-gray-500 py-6 rounded-full flex-row items-center"
          style={{ width: width * 0.43, marginRight: width * 0.3 }}
          accessibilityRole="button"
          accessibilityLabel="Login button"
          accessibilityHint="Tap to go to the login screen"
        >
          <Text className="tex`t-white text-xl text-center w-full">Login</Text>
        </TouchableOpacity>

        {/* Overlapping SignUp Button */}
        <TouchableOpacity
          onPress={() => navigateTo("SignUp")}
          className="absolute bg-yellow-500 py-6 rounded-full"
          style={{
            width: width * 0.4,
            left: width * 0.38,
          }}
          accessibilityRole="button"
          accessibilityLabel="Sign Up button"
          accessibilityHint="Tap to go to the sign-up screen"
        >
          <Text className="text-white text-xl text-center w-full">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
