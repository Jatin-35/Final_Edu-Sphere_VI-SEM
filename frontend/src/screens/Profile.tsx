import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";

const { width, height } = Dimensions.get("window");

const Profile = ({ navigateTo }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      {/* Header */}
      <LinearGradient
        colors={["#6A85B6", "#5E5A80"]}
        style={{
          width: "100%",
          height: 280,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          paddingTop: 50,
          paddingHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Profile Image */}
        <Image
          source={require("../../assets/images/bot1.jpg")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: "#fff",
          }}
        />

        {/* Name & Role */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#FFF",
            marginTop: 10,
          }}
        >
          Aurora Belle
        </Text>
        <Text style={{ fontSize: 16, color: "#EAEAEA", marginTop: 4 }}>
          Digital Artist | Content Creator
        </Text>

        {/* Edit Icon */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 55,
            right: 25,
            backgroundColor: "#FFF",
            padding: 8,
            borderRadius: 20,
            shadowOpacity: 0.3,
            elevation: 5,
          }}
        >
          <Feather name="edit-3" size={20} color="#5E5A80" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 0 }}
      >
        {/* About + Work + Social in one flow */}
        <View
          style={{
            backgroundColor: "#FFF",
            marginHorizontal: 20,
            padding: 20,
            borderRadius: 20,
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4D4C7D" }}>
            About Me
          </Text>
          <Text style={{ fontSize: 14, color: "#726A95", marginTop: 8 }}>
            Dreamer, artist, and digital storyteller. Passionate about crafting
            art that speaks emotions. ✨
          </Text>
        </View>

        {/* Skills Card */}
        <View
          style={{
            backgroundColor: "#FFF",
            marginHorizontal: 20,
            marginTop: 15,
            padding: 20,
            borderRadius: 20,
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4D4C7D" }}>
            Skills & Expertise
          </Text>
          <Text style={{ fontSize: 14, color: "#726A95", marginTop: 8 }}>
            🎨 UI/UX Design | 🖌️ Digital Illustration | 💡 Branding
          </Text>
        </View>

        {/* Portfolio Card */}
        <View
          style={{
            backgroundColor: "#FFF",
            marginHorizontal: 20,
            marginTop: 15,
            padding: 20,
            borderRadius: 20,
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4D4C7D" }}>
            Portfolio
          </Text>
          <Text style={{ fontSize: 14, color: "#726A95", marginTop: 8 }}>
            🚀 Designed 50+ brand identities & digital experiences.
          </Text>
        </View>

        {/* Social Links */}
        <View
          style={{
            backgroundColor: "#FFF",
            marginHorizontal: 20,
            marginTop: 15,
            padding: 20,
            borderRadius: 20,
            shadowOpacity: 0.1,
            elevation: 2,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <Ionicons name="logo-instagram" size={30} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="logo-linkedin" size={30} color="#0077B5" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="mail-outline" size={30} color="#D44638" />
          </TouchableOpacity>
        </View>
      </ScrollView>


      {/* Bottom Navigation */}
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <BottomNavigation navigateTo={navigateTo} />
      </View>
    </View>
  );
};

export default Profile;
