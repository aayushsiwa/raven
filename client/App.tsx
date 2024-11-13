import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Text,
    Button,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import ArticleCard from "./components/ArticleCard"; // Import the ArticleCard component

const App = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("tech"); // Default category

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await axios.get(
                    `${API_URL}/verge-tech/${category}`
                );
                setArticles(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load articles");
                setLoading(false);
            }
        }

        fetchArticles();
    }, [category]);

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
    };

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
            <Text style={styles.heading}>
                Articles -{" "}
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <View style={styles.categoryContainer}>
                <Button
                    title="Tech"
                    onPress={() => handleCategoryChange("tech")}
                />
                <Button
                    title="Gadgets"
                    onPress={() => handleCategoryChange("gadgets")}
                />
                <Button
                    title="Apple"
                    onPress={() => handleCategoryChange("apple")}
                />
                {/* Add more buttons for other categories */}
            </View>
            <FlatList
                data={articles}
                renderItem={({ item }) => <ArticleCard article={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    categoryContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 15,
    },
});
