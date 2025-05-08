import React from "react";
import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";

const { width } = Dimensions.get("window");

const modules = [
  { id: "1", title: "Programming", icon: "code-slash-outline", color: "#A7D7C5" },
  { id: "2", title: "AI & ML", icon: "bulb-outline", color: "#FFD3B6" },
  { id: "3", title: "Cyber Security", icon: "shield-checkmark-outline", color: "#F4C2C2" },
  { id: "4", title: "Data Science", icon: "bar-chart-outline", color: "#B5C7F2" },
  { id: "5", title: "Networking", icon: "wifi-outline", color: "#F7C59F" },
  { id: "6", title: "Blockchain", icon: "cube-outline", color: "#D8BFD8" },
];

interface ModuleScreenProps {
  navigateTo: (screen: string) => void;
}

const ModuleScreen: React.FC<ModuleScreenProps> = ({ navigateTo }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA", padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "#2C3E50", textAlign: "center", marginBottom: 20 }}>
        📚 Computer Science Modules
      </Text>

      {/* Grid Layout */}
      <FlatList
        data={modules}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              flex: 1,
              margin: 10,
              padding: 18,
              borderRadius: 15,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#EAEAEA",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              elevation: 4,
            }}
          >
            <Ionicons name={item.icon} size={40} color={item.color} />
            <Text style={{ fontSize: 18, fontWeight: "500", color: "#333", marginTop: 10 }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Navigation */}
      <View style={{ position: "absolute", bottom: 0, width: width }}>
        <BottomNavigation navigateTo={navigateTo} />
      </View>
    </View>
  );
};

export default ModuleScreen;
