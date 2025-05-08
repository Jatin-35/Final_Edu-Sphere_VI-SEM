import React, { useState, useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ContentScreen from "./src/screens/ContentScreen";
import Notes from "./src/screens/Notes";
import GameHomeScreen from "./src/screens/GameHomeScreen";
import GameLevelsScreen from "./src/screens/GameLevelsScreen";
import CrosswordScreen from "./src/screens/CrosswordScreen";
import ChatBot from "./src/screens/ChatBot";
import Profile from "./src/screens/Profile";
import ModuleScreen from "./src/screens/ModuleScreen";
import TextSummarize from "./src/screens/TextSummarize";


const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [params, setParams] = useState<any>(null);
  const [screenHistory, setScreenHistory] = useState<string[]>([]);

  const navigateTo = (screen: string, newParams: any = null) => {
    setScreenHistory((prevHistory) => [...prevHistory, currentScreen]); // Store current screen before navigating
    setCurrentScreen(screen);
    setParams(newParams);
  };

  useEffect(() => {
    const backAction = () => {
      if (screenHistory.length > 0) {
        const previousScreen = screenHistory[screenHistory.length - 1];
        setScreenHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove last screen from history
        setCurrentScreen(previousScreen);
        return true;
      } else {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup
  }, [screenHistory]);

  return (
    <>
      {currentScreen === "Home" && <HomeScreen navigateTo={navigateTo} />}
      {currentScreen === "SignUp" && <SignUpScreen navigateTo={navigateTo} />}
      {currentScreen === "Login" && <LoginScreen navigateTo={navigateTo} />}
      {currentScreen === "Content" && <ContentScreen navigateTo={navigateTo} />}
      {currentScreen === "Notes" && <Notes navigateTo={navigateTo} />}
      {currentScreen === "GameHome" && <GameHomeScreen navigateTo={navigateTo} />}
      {currentScreen === "Levels" && (
        <GameLevelsScreen navigateTo={navigateTo} newLevel={params?.newLevel} />
      )}
      {currentScreen === "Crossword" && (
        <CrosswordScreen route={{ params }} navigateTo={navigateTo} />
      )}
      {currentScreen === "ChatBot" && <ChatBot navigateTo={navigateTo} />}
      {currentScreen === "Profile" && <Profile navigateTo={navigateTo} />}
      {currentScreen === "Module" && <ModuleScreen navigateTo={navigateTo} />}
      {currentScreen === "TextSummarize" && <TextSummarize navigateTo={navigateTo} />}
    </>
  );
};

export default App;
