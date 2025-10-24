import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ Added this import
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { apiFetch } from "../../apiFetch";
import Loader from "../../Components/Loader/Loader";
import { colors } from "../../Themes/colors";

const PAGE_SIZE = 10;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const CommunityCategoryTemplatesScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { categoryId, categoryName } = route.params;

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchTemplates = useCallback(
        async (pageNum = 1) => {
            try {
                if (pageNum === 1) setLoading(true);
                else setLoadingMore(true);

                const res = await apiFetch(
                    `/cards/categories/${categoryId}/templates?page=${pageNum}&limit=${PAGE_SIZE}`,
                    {},
                    navigation
                );

                if (!res.ok) throw new Error("Failed to fetch category templates");
                const data = await res.json();
                const { templates: fetched, hasMore: moreAvailable } = data;

                const processed = await Promise.all(
                    fetched.map(
                        (item) =>
                            new Promise((resolve) => {
                                const uri = item.imageUrl || "https://via.placeholder.com/150";
                                Image.getSize(
                                    uri,
                                    (w, h) => {
                                        const aspectRatio = w / h || 1;
                                        const imgHeight = CARD_WIDTH / aspectRatio;
                                        resolve({ ...item, aspectRatio, height: imgHeight });
                                    },
                                    () => resolve({ ...item, aspectRatio: 1, height: 180 })
                                );
                            })
                    )
                );

                if (pageNum === 1) setTemplates(processed);
                else setTemplates((prev) => [...prev, ...processed]);

                setHasMore(moreAvailable);
            } catch (err) {
                console.error("❌ Fetch error:", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [categoryId, navigation]
    );

    useEffect(() => {
        fetchTemplates(1);
    }, [fetchTemplates]);

    const handleLoadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;
        const nextPage = Math.floor(templates.length / PAGE_SIZE) + 1;
        fetchTemplates(nextPage);
    }, [loadingMore, hasMore, templates.length, fetchTemplates]);

    // ✅ Masonry Layout split
    const formatMasonry = (data) => {
        const left = [];
        const right = [];
        data.forEach((item, index) => {
            if (index % 2 === 0) left.push(item);
            else right.push(item);
        });
        return [left, right];
    };

    const [leftCol, rightCol] = formatMasonry(templates);

    const renderCard = (item) => (
        <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={[styles.card, { height: item.height }]}
            onPress={() =>
                navigation.navigate("templatefeatures", { templateId: item.id })
            }
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={[styles.image, { height: item.height }]}
                resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title || "Template"}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderMasonry = () => (
        <View style={styles.masonryContainer}>
            <View style={styles.column}>{leftCol.map(renderCard)}</View>
            <View style={styles.column}>{rightCol.map(renderCard)}</View>
        </View>
    );

    // ✅ Empty state component (same as EnhancedImageGallery)
    const renderEmptyComponent = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                    name="view-grid-outline"
                    size={50}
                    color={colors.mutedText}
                    style={{ marginBottom: 12 }}
                />
                <Text style={styles.emptyTitle}>No Templates Yet</Text>
                <Text style={styles.emptySubtitle}>
                    Community templates for this category will appear here once uploaded.
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <LinearGradient
                colors={colors.gradients.ocean}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientHeader}
            >
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.gradientTitle}>{categoryName} Templates</Text>
                </View>

                <Text style={styles.gradientDescription}>
                    Browse creative templates shared by our community.
                </Text>
            </LinearGradient>

            {/* ✅ Use real data conditionally */}
            <FlatList
                data={templates.length > 0 ? [{}] : []} 
                renderItem={renderMasonry}
                keyExtractor={() => "masonry"}
                ListEmptyComponent={renderEmptyComponent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loadingMore ? (
                        <Text style={styles.loadingText}>Loading more...</Text>
                    ) : null
                }
            />
        </View>
    );
};

export default CommunityCategoryTemplatesScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodybackground,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bodybackground,
    },

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 120,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.mutedText,
        textAlign: "center",
        width: "80%",
    },

    gradientHeader: {
        paddingTop: 30, paddingBottom: 20,
        paddingHorizontal: 20,
        // borderBottomLeftRadius: 18,
        // borderBottomRightRadius: 18,
        marginBottom: 10,
    },
    backButton: {
        // position: "absolute",
        // top: 12,
        // left: 16,
        // zIndex: 5,
    },
    // backButtonText: {
    //     color: colors.text,
    //     fontSize: 24,
    //     fontWeight: "600",
    // },
    gradientSubtitle: {
        color: colors.mutedText,
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    gradientTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        // marginTop: 5,
    },
    gradientDescription: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        marginTop: 8,
        lineHeight: 20,
    },
    masonryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    column: {
        flex: 1,
    },
    card: {
        margin: 6,
        borderRadius: 14,
        backgroundColor: colors.cardsbackground,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: "100%",
        borderRadius: 12,
    },
    cardOverlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingVertical: 8,
        backgroundColor: "rgba(0,0,0,0.55)",
    },
    cardTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    loadingText: {
        textAlign: "center",
        color: colors.text,
        marginVertical: 10,
    },
});
