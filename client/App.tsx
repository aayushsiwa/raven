import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,  // Add TouchableOpacity for making the title clickable
} from "react-native";
import axios from "axios";
import { Linking } from "react-native";  // Import Linking module to handle URL opening

export default function App() {
    // State to store articles and loading status
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch articles from the Express API
    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/tech-articles"
                );
                setArticles(response.data); // Set the fetched articles in the state
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setError("Failed to load articles");
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    // Handle article click
    const handleArticlePress = (url: string) => {
        // Open the article URL in the default browser
        Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    };

    // Render each article in a FlatList
    const renderItem = ({ item }) => (
        <View style={styles.articleContainer}>
            <TouchableOpacity onPress={() => handleArticlePress(item.link)}>
                <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
            <Text style={styles.author}>By {item.author}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
        </View>
    );

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
                renderItem={renderItem}
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
    articleContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007bff",  // Make title color blue to indicate it's clickable
    },
    author: {
        fontSize: 14,
        color: "gray",
    },
    date: {
        fontSize: 12,
        color: "gray",
    },
    category: {
        fontSize: 12,
        color: "gray",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
