import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

// Dummy OS Modules with Topics
const osModules = [
  {
    id: "1",
    title: "Module 1: Basics of OS",
    topics: [
      {
        id: "1-1",
        title: "Introduction to OS",
        video: require("../../assets/videos/OS1.mp4"),
        playable: true,
      },
      {
        id: "1-2",
        title: "Functions of OS",
        playable: false,
      },
    ],
  },
  {
    id: "2",
    title: "Module 2: Memory Management",
    topics: [
      {
        id: "2-1",
        title: "Paging & Segmentation",
        playable: false,
      },
      {
        id: "2-2",
        title: "Virtual Memory",
        playable: false,
      },
    ],
  },
  {
    id: "3",
    title: "Module 3: CPU Scheduling",
    topics: [
      {
        id: "3-1",
        title: "Scheduling Algorithms",
        playable: false,
      },
      {
        id: "3-2",
        title: "Multilevel Scheduling",
        playable: false,
      },
    ],
  },
];

interface OSModuleProps {
  navigateTo: (screen: string) => void;
}

const OSModulesScreen: React.FC<OSModuleProps> = ({ navigateTo }) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9", padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#2C3E50" }}>
        📘 Operating Systems Modules
      </Text>

      <FlatList
        data={osModules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isModuleExpanded = expandedModules.includes(item.id);
          return (
            <View style={{ marginBottom: 20 }}>
              {/* Module Dropdown */}
              <TouchableOpacity
                onPress={() => toggleModule(item.id)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#e1ecf4",
                  padding: 14,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#2c3e50" }}>
                  {item.title}
                </Text>
                <Ionicons
                  name={isModuleExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                  size={20}
                  color="#2c3e50"
                />
              </TouchableOpacity>

              {/* Topics if module is expanded */}
              {isModuleExpanded &&
                item.topics.map((topic) => {
                  const isTopicExpanded = expandedTopics.includes(topic.id);
                  return (
                    <View key={topic.id} style={{ marginLeft: 20, marginTop: 10 }}>
                      {topic.playable ? (
                        <>
                          <TouchableOpacity
                            onPress={() => toggleTopic(topic.id)}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#fef9e7",
                              padding: 12,
                              borderRadius: 10,
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>▶ {topic.title}</Text>
                            <Ionicons
                              name={isTopicExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                              size={20}
                              color="#7d6608"
                            />
                          </TouchableOpacity>

                          {/* Show video if topic expanded */}
                          {isTopicExpanded && topic.video && (
                            <Video
                              source={topic.video}
                              useNativeControls
                              resizeMode={ResizeMode.CONTAIN}
                              style={{
                                width: "100%",
                                height: 200,
                                marginTop: 10,
                                borderRadius: 10,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <TouchableOpacity
                          disabled
                          style={{
                            padding: 12,
                            backgroundColor: "#e0e0e0",
                            borderRadius: 10,
                            marginBottom: 8,
                            opacity: 0.6,
                          }}
                        >
                          <Text style={{ fontSize: 16, color: "#666" }}>
                            🔒 {topic.title}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
            </View>
          );
        }}
      />
    </View>
  );
};

export default OSModulesScreen;
