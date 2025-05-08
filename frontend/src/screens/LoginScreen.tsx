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

interface LoginScreenProps {
  navigateTo: (screen: string) => void;
}

const LoginScreen = ({ navigateTo } : LoginScreenProps) => {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      accessible={true}
      accessibilityLabel="Login screen"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Image */}
        <Image
          source={require("../../assets/images/loginscreen2.jpg")}
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

        {/* Main Login Container */}
        <View
          className="flex-1 bg-gray-100 rounded-t-3xl shadow-lg px-6 pt-8 pb-6"
          style={{ marginTop: width * 0.65 }}
          accessible={true}
          accessibilityLabel="Login form section"
        >
          {/* Welcome Text */}
          <Text
            className="text-2xl font-bold text-gray-800 mb-6 text-center"
            accessibilityRole="header"
            accessible={true}
            accessibilityLabel="Welcome Back!"
          >
            Welcome Back!
          </Text>

          {/* Social Media Login Options */}
          <View className="flex-row justify-evenly mb-4" accessible={true} accessibilityLabel="Social login options">
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Login with Facebook"
            >
              <Text className="text-lg font-bold text-gray-700">F</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Login with Twitter"
            >
              <Text className="text-lg font-bold text-gray-700">T</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center shadow"
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Login with Google"
            >
              <Text className="text-lg font-bold text-gray-700">G</Text>
            </TouchableOpacity>
          </View>

          <Text
            className="text-sm text-gray-600 mb-6 text-center"
            accessible={true}
            accessibilityLabel="or use your email account"
          >
            or use your email account
          </Text>

          {/* Input Fields */}
          <View className="space-y-4 mb-6">
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              accessible={true}
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address"
            />
            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-800"
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#aaa"
              accessible={true}
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your password"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="w-full h-12 bg-green-500 rounded-lg items-center justify-center"
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Login button"
            accessibilityHint="Double tap to log in"
            onPress={() => navigateTo("Content")}
          >
            <Text className="text-white text-lg font-bold">LOGIN</Text>
          </TouchableOpacity>

          {/* Sign Up Option */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-sm text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigateTo("SignUp")}>
              <Text
                className="text-green-500 font-bold"
                accessibilityRole="link"
                accessible={true}
                accessibilityLabel="Sign up link"
                accessibilityHint="Double tap to navigate to sign up page"
              >
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
