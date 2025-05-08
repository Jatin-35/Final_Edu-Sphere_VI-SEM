import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, FlatList, Button, Alert, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://bbonrwuubtdydgltolbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25yd3V1YnRkeWRnbHRvbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzc4MjYsImV4cCI6MjA1NTY1MzgyNn0.2v0O0vXTy-Dw1llblxzCW8LdHGA77K9W7xDJLrEv_fo'; // use anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

const subjects = ["DSA", "OS", "AI", "ML", "CN", "DBMS", "TOC", "SE", "Compiler", "Cyber Security", "Cloud Computing"];

const Notes = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [files, setFiles] = useState<{ [key: string]: any[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if (result.type === "cancel") {
        console.log("File picker cancelled");
        return;
      }

      if (!result.assets || !result.assets[0].uri) {
        console.log("No URI found for selected file:", result);
        Alert.alert("No file selected");
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
      console.log("File selected:", result);

      setLoading(true);
      const filePath = `${selectedSubject}/${fileName}`;

      const fileToUpload = {
        uri: fileUri,
        name: fileName,
        type: result.assets[0].mimeType,
      };

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, fileToUpload, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload failed 😢");
      } else {
        console.log("Uploaded:", data);

        const { data: signedData, error: signedError } = await supabase.storage
          .from("uploads")
          .createSignedUrl(filePath, 60 * 60, { download: true });

        if (signedError) {
          console.error("Signed URL error:", signedError);
        } else {
          console.log("Signed download URL:", signedData.signedUrl);
          setUploadedFileName(fileName);
          setUploadedFileUrl(signedData.signedUrl);

          // Add the uploaded file to the subject's file list
          setFiles((prevFiles) => ({
            ...prevFiles,
            [selectedSubject]: [
              ...(prevFiles[selectedSubject] || []),
              { name: fileName, url: signedData.signedUrl },
            ],
          }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error picking file");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/note.png")}
          style={{ height: 70, width: 70, marginRight: 10, marginLeft: 80 }}
        />
        <Text style={[styles.header, { color: "black" }, { fontSize: 25 }]}>Notes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {subjects.map((subject, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.subjectBox, { backgroundColor: getRotatingColor(index) }]}
            onPress={() => {
              setSelectedSubject(subject);
              setModalVisible(true);
            }}
          >
            <Text style={styles.subjectText}>{subject}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Button to Upload */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          if (!selectedSubject) setSelectedSubject(subjects[0]);
          setUploadModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal to Show Files */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.fileModalContainer}>
          <Text style={styles.fileModalTitle}>{selectedSubject}</Text>
          <FlatList
              data={files[selectedSubject] || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.fileItem}>
                  <Text style={styles.fileEmoji}>📄</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                    <Text style={styles.fileText}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Upload File Modal */}
      <Modal visible={uploadModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload File</Text>
            <Text>Select Subject:</Text>
            <ScrollView style={styles.dropdown}>
              {subjects.map((subject, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    selectedSubject === subject && styles.selectedSubject,
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text>{subject}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Styled Choose File Button */}
            <TouchableOpacity
              style={[styles.button, !selectedSubject || loading ? styles.buttonDisabled : {}]}
              onPress={handlePickFile}
              disabled={!selectedSubject || loading}
            >
              <Text style={styles.buttonText}>Choose File</Text>
            </TouchableOpacity>

            {/* Styled Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setUploadModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getRotatingColor = (index) => {
  const colors = ["#BBB7E5", "#DAE9FA", "#F7DFDF", "#EFBDBD", "#B6C687", "#F3EDBD"];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F5", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  subjectBox: {
    padding: 20, marginVertical: 10, borderRadius: 15, alignItems: "center",
    elevation: 3, height: 100, alignContent: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#647593'
  },
  subjectText: { fontSize: 20, fontWeight: "bold", color: "black" },
  floatingButton: {
    position: "absolute", bottom: 20, right: 20, backgroundColor: "#0052D4",
    width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5,
  },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20, justifyContent: "center", alignItems: "center"
  },
  modalContent: {
    width: "85%", padding: 20, backgroundColor: "white", borderRadius: 10, elevation: 5, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  fileItem: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  fileEmoji: { fontSize: 24, marginRight: 10 },
  fileText: { fontSize: 18 },
  closeText: { color: "white", fontWeight: "bold" },
  dropdown: { width: '100%', maxHeight:150, borderWidth: 1, borderColor: "#ccc", marginVertical: 10 },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  selectedSubject: { backgroundColor: "#A3E4D7" },
  button: {
    width: '100%', backgroundColor: '#ABC4FF', paddingVertical: 12, borderRadius: 8,
    alignItems: 'center', marginVertical: 8,
  },
  closeButton: {
    width: '100%', backgroundColor: '#FF7043', paddingVertical: 12, borderRadius: 8,
    alignItems: 'center', marginVertical: 8,
  },
  buttonText: {
    color: 'white', fontSize: 16, fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#AAB7B8',
  },
  fileModalContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
  fileModalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});

export default Notes;
