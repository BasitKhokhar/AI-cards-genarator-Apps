import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { apiFetch } from "../../apiFetch";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function PrivacyPolicy() {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                setLoading(true);
                const res = await apiFetch("/content/privacy-policy");

                if (!res.ok) throw new Error("Failed to fetch privacy policy");

                const data = await res.json();
                setPolicy(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load privacy policy. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView  showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#ff3d9b" style={{ marginTop: 50 }} />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : policy ? (
                    <View style={styles.textContainer}>
                        {/* <Text style={styles.title}>{policy.title}</Text> */}
                        <Text style={styles.content}>{policy.content}</Text>
                    </View>
                ) : (
                    <Text style={styles.error}>No privacy policy found.</Text>
                )}
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0d0d", // Same dark theme
        padding: 16,
        paddingBottom: 50,
    },
    textContainer: {
        // backgroundColor: "#141414",
        // borderRadius: 16,
        // padding: 18,
        // borderWidth: 1,
        // borderColor: "rgba(139,61,255,0.3)",
        // shadowColor: "#8b3dff",
        // shadowOpacity: 0.4,
        // shadowRadius: 8,
        // elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        color: "#ff3d9b",
        marginBottom: 16,
        textTransform: "uppercase",
        textShadowColor: "#8b3dff",
        textShadowRadius: 8,
        textShadowOffset: { width: 0, height: 0 },
    },
    content: {
        fontSize: 15,
        color: "#d4d4d4",
        lineHeight: 25,
        fontWeight: "500",
    },
    error: {
        fontSize: 16,
        color: "#ff3d9b",
        textAlign: "center",
        marginTop: 20,
    },
});
