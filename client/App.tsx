import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Text,
} from "react-native";
import axios from "axios";
import { Linking } from "react-native";
import { API_URL } from "@env";
import ArticleCard from "./components/ArticleCard"; // Import the ArticleCard component

export default function App() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await axios.get(`${API_URL}/verge-tech`);
                setArticles(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load articles");
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={articles}
                renderItem={({ item }) => <ArticleCard article={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
