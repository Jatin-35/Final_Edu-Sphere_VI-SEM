import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from "../../supabase"; 

const NotesSharing = () => {
    interface Pdf {
        id: number;
        title: string;
        category: string;
        file_url: string;
    }
    
    const [pdfs, setPdfs] = useState<Pdf[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch PDF Notes from Supabase
    useEffect(() => {
        fetchPdfs();
    }, []);
7
    const fetchPdfs = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('pdf_notes').select('*');
        if (error) Alert.alert("Error", error.message);
        else setPdfs(data || []);
        setLoading(false);
    };

    // Upload PDF File
    const uploadPdf = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
        if (result.canceled) return;

        const file = result.assets[0];
        const fileName = `${Date.now()}_${file.name}`;
        const category = "DSA"; // Set dynamically if needed

        setLoading(true);

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage.from('pdf-notes').upload(fileName, file.uri, {
            contentType: 'application/pdf',
        });

        if (error) {
            Alert.alert("Upload Failed", error.message);
            setLoading(false);
            return;
        }

        // Get public URL of the uploaded file
        const fileUrl = supabase.storage.from('pdf-notes').getPublicUrl(fileName).data.publicUrl;

        // Store file metadata in Supabase Table (No user_id required)
        const { error: dbError } = await supabase.from('pdf_notes').insert({
            title: file.name,
            category: category,
            file_url: fileUrl,
        });

        if (dbError) Alert.alert("Database Error", dbError.message);
        else fetchPdfs();

        setLoading(false);
    };

    // Delete PDF File
    const deletePdf = async (id: number, fileUrl: string) => {
        const fileName = fileUrl.split("/").pop() || '';
        setLoading(true);

        // Delete from storage
        await supabase.storage.from('pdf-notes').remove([fileName]);

        // Delete from database
        const { error } = await supabase.from('pdf_notes').delete().match({ id });

        if (error) Alert.alert("Error", error.message);
        else fetchPdfs();

        setLoading(false);
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
            <TouchableOpacity 
                onPress={uploadPdf} 
                style={{
                    backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center",
                }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Upload PDF</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

            <FlatList
                data={pdfs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd",
                    }}>
                        <Text>{item.title} ({item.category})</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity 
                                onPress={() => Alert.alert("Download", `File URL: ${item.file_url}`)}
                                style={{ marginRight: 10, backgroundColor: "#28a745", padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: "#fff" }}>Download</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => deletePdf(item.id, item.file_url)}
                                style={{ backgroundColor: "#dc3545", padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: "#fff" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default NotesSharing;
