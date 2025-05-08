import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation"; // Import Bottom Navigation

const { width } = Dimensions.get("window");

const TextSummarize = ({ navigateTo }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");

  // File Picker Function
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    });

    if (result.type === "success") {
      setSelectedFile(result);
    }
  };

  // Simulate Summarization
  const handleSummarize = () => {
    if (!selectedFile) {
      setSummary("⚠️ Please upload a document first.");
      return;
    }
    setSummary(`🔍 AI Summary: Extracting key insights from ${selectedFile.name}...`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F9", padding: 20, justifyContent: "center" }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2C3E50", textAlign: "center", marginBottom: 20 }}>
        📑 Document Summarization
      </Text>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={pickDocument}
        style={{
          backgroundColor: "#3498DB",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          shadowOpacity: 0.3,
          elevation: 5,
        }}
      >
        <Ionicons name="cloud-upload-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>Upload File</Text>
      </TouchableOpacity>

      {/* Show Uploaded File Name */}
      {selectedFile && (
        <Text style={{ fontSize: 16, color: "#34495E", textAlign: "center", marginVertical: 15 }}>
          📄 {selectedFile.name}
        </Text>
      )}

      {/* Summarize Button */}
      <TouchableOpacity
        onPress={handleSummarize}
        style={{
          backgroundColor: "#2ECC71",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          shadowOpacity: 0.3,
          elevation: 5,
          marginTop: 10,
        }}
      >
        <Ionicons name="sparkles-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>Generate Summary</Text>
      </TouchableOpacity>

      {/* Summary Output */}
      {summary !== "" && (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 15,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#DADFE1",
            shadowOpacity: 0.1,
            elevation: 2,
            minHeight: 80,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#2C3E50" }}>{summary}</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <BottomNavigation navigateTo={navigateTo} />
      </View>
    </View>
  );
};

export default TextSummarize;
