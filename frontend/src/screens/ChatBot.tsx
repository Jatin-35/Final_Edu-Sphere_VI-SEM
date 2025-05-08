import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";

const { width, height } = Dimensions.get("window");

// Update this URL with your backend's /query/ POST endpoint
const API_URL = "https://37a6-27-63-20-131.ngrok-free.app/query/";
//    https://f521-27-63-20-131.ngrok-free.app

interface ChatBotProps {
  navigateTo: (screen: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ChatBot: React.FC<ChatBotProps> = ({ navigateTo }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! 👋 How can I help you today?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputText }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      const botReply: Message = {
        id: Date.now().toString(),
        text:
          Array.isArray(data.response) && data.response.length > 0
            ? data.response.join(", ")
            : data.response || "Hmm 🤔 I didn’t get that. Try asking in another way!",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      Alert.alert("Error", "⚠️ Failed to reach the chatbot server.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Oops! Something went wrong. 😢",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#181818" }}>
      {/* Chat Header */}
      <View
        style={{
          width: "100%",
          height: 90,
          backgroundColor: "#1E1E1E",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
          Tinsi: Your AI Companion 🤖
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: item.sender === "user" ? "row-reverse" : "row",
              alignItems: "center",
              marginVertical: 5,
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                backgroundColor: item.sender === "user" ? "#007AFF" : "#444",
                padding: 12,
                borderRadius: 20,
                maxWidth: "75%",
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Spinner */}
      {loading && (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      {/* Input Box */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#1E1E1E",
          borderTopWidth: 1,
          borderTopColor: "#333",
          marginBottom: 70,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#333",
            color: "#fff",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 25,
          }}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: "#007AFF",
            padding: 12,
            borderRadius: 25,
          }}
          disabled={loading}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <BottomNavigation navigateTo={navigateTo} />
    </View>
  );
};

export default ChatBot;
