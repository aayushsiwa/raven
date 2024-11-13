import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Linking } from "react-native";

// ArticleCard Component to display individual article details
interface Article {
    title: string;
    author: string;
    published: string;
    link: string;
}

const ArticleCard = ({ article }: { article: Article }) => {
    const handleArticlePress = (url:string) => {
        Linking.openURL(url).catch((err) =>
            console.error("Failed to open URL:", err)
        );
    };

    return (
        <View style={styles.articleContainer}>
            <TouchableOpacity onPress={() => handleArticlePress(article.link)}>
                <Text style={styles.title}>{article.title}</Text>
            </TouchableOpacity>
            <Text style={styles.author}>By {article.author}</Text>
            <Text style={styles.date}>Published: {article.published}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
        color: "#007bff", // Blue title color to indicate it's clickable
    },
    author: {
        fontSize: 14,
        color: "gray",
    },
    date: {
        fontSize: 12,
        color: "gray",
    },
});

export default ArticleCard;
