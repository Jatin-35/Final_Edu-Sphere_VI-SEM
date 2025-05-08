import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

interface SignUpScreenProps {
  navigateTo: (screen: string) => void;
}

const SignUpScreen = ({ navigateTo }: SignUpScreenProps) => {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Image */}
        <Image
          source={require("../../assets/images/loginScreen.jpg")}
          style={{
            height: width * 0.7,
            width: width,
            position: "absolute",
            top: 0,
            zIndex: -1,
          }}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel="Background image of the login screen"
        />

        {/* Rounded Box */}
        <View
          className="flex-1 bg-gray-100 rounded-t-3xl shadow-lg px-6 pt-8 pb-6"
          style={{ marginTop: width * 0.65 }}
          accessible={true}
        >
          {/* Title Section */}
          <Text
            className="text-2xl font-bold text-gray-800 mb-6 text-center"
            accessibilityRole="header"
          >
            Create New Account
          </Text>

          {/* Social Media Login Options */}
          <View className="flex-row justify-evenly mb-4">
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessibilityLabel="Sign up with Facebook"
            >
              <Text className="text-lg font-bold text-gray-700">F</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessibilityLabel="Sign up with Twitter"
            >
              <Text className="text-lg font-bold text-gray-700">T</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessibilityLabel="Sign up with Google"
            >
              <Text className="text-lg font-bold text-gray-700">G</Text>
            </TouchableOpacity>
          </View>

          <Text
            className="text-sm text-gray-600 mb-6 text-center"
            accessibilityLabel="Or use your email account"
          >
            or use your email account
          </Text>

          {/* Input Fields */}
          <View className="space-y-4 mb-6">
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Email"
              placeholderTextColor="#aaa"
              accessibilityLabel="Enter your email"
              keyboardType="email-address"
            />
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Name"
              placeholderTextColor="#aaa"
              accessibilityLabel="Enter your full name"
            />
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#aaa"
              accessibilityLabel="Enter your password"
            />
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#aaa"
              accessibilityLabel="Confirm your password"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="w-full h-12 bg-green-500 rounded-lg items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Register your account"
            onPress={() => navigateTo("Login")}
          >
            <Text className="text-white text-lg font-bold">REGISTER</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{' '}
            <TouchableOpacity onPress={() => navigateTo("Login")}>
              <Text className="text-green-500 font-bold" accessibilityRole="link">
                Login here
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
