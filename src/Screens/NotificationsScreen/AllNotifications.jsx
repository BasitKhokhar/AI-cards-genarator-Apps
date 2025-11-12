// import React from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { colors } from "../../Themes/colors";
// import { fonts } from "../../Themes/fonts";

// function AllNotifications() {
//   // 📨 Static notification data
//   const notifications = [
//     {
//       id: "1",
//       title: "Welcome to CardiFy-AI 🎉",
//       message:
//         "Thank you for joining! Explore stunning AI-generated greeting cards and designs.",
//       time: "2 mins ago",
//     },
//     {
//       id: "2",
//       title: "New AI Feature Unlocked 🚀",
//       message:
//         "Introducing our AI Wedding Card Generator — create elegant invites instantly!",
//       time: "1 hour ago",
//     },
//     {
//       id: "3",
//       title: "Special Offer 💎",
//       message:
//         "Get 20% off on your next premium card generation — today only!",
//       time: "Yesterday",
//     },
//     {
//       id: "4",
//       title: "System Update ⚙️",
//       message:
//         "Improved AI models for faster image generation and smoother performance.",
//       time: "2 days ago",
//     },
//     {
//       id: "5",
//       title: "Reminder 🔔",
//       message:
//         "Your saved templates are ready to customize — open CardiFy-AI now!",
//       time: "3 days ago",
//     },
//     {
//       id: "6",
//       title: "New Template Drop 🎨",
//       message:
//         "Explore 25+ brand-new templates for birthdays, weddings, and festivals — now live!",
//       time: "4 days ago",
//     },
//     {
//       id: "7",
//       title: "Exclusive Pro Access 🔓",
//       message:
//         "You’ve unlocked free access to our Pro templates for the next 48 hours!",
//       time: "5 days ago",
//     },
//     {
//       id: "8",
//       title: "AI Greeting Suggestions ✨",
//       message:
//         "Not sure what to write? Let our AI craft the perfect message for your card.",
//       time: "6 days ago",
//     },
//     {
//       id: "9",
//       title: "Boost Your Creativity 💡",
//       message:
//         "Use the 'Inspire Me' button to get fresh design ideas tailored for you!",
//       time: "1 week ago",
//     },
//     {
//       id: "10",
//       title: "Your Friend Loved Your Card ❤️",
//       message:
//         "Someone viewed and appreciated your latest greeting design — great job!",
//       time: "1 week ago",
//     },
//     {
//       id: "11",
//       title: "New Festival Pack 🎊",
//       message:
//         "Celebrate Eid, Diwali & Christmas with our exclusive seasonal template bundle.",
//       time: "2 weeks ago",
//     },
//     {
//       id: "12",
//       title: "Performance Boost ⚡",
//       message:
//         "Card previews now load 2x faster! Update your app for the best experience.",
//       time: "2 weeks ago",
//     },
//     {
//       id: "13",
//       title: "AI Avatar Update 🧠",
//       message:
//         "Your favorite photo enhancer now supports custom avatar generation in HD!",
//       time: "3 weeks ago",
//     },
//     {
//       id: "14",
//       title: "Weekly Inspiration 🪄",
//       message:
//         "Check out this week’s trending AI card styles — now available in Trending tab.",
//       time: "3 weeks ago",
//     },
//     {
//       id: "15",
//       title: "Thank You 💖",
//       message:
//         "We’ve reached 10,000 users! Thank you for supporting CardiFy-AI and helping us grow.",
//       time: "1 month ago",
//     },
//   ];

//   // 💬 Render Each Notification
//   const renderNotification = ({ item }) => (
//     <View style={styles.card}>
//       {/* <LinearGradient
//         colors={colors.gradients.ocean}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.titleWrapper}
//       > */}
//         <Text style={styles.title}>{item.title}</Text>
//       {/* </LinearGradient> */}
//       <Text style={styles.message}>{item.message}</Text>
//       <Text style={styles.time}>{item.time}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item.id}
//         renderItem={renderNotification}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }

// export default AllNotifications;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     paddingBottom: 50,
//     backgroundColor: colors.bodybackground,
//   },
//   card: {
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 16,
//     padding: 15,
//     marginVertical: 8,
//     borderWidth: 1,
//     borderColor: colors.border,
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   titleWrapper: {
//     padding: 8,
//     borderRadius: 10,
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 15,
//     color: colors.primary,
//     marginBottom: 6,
//     fontFamily: fonts.heading, 
//   },
//   message: {
//     fontSize: 14,
//     color: colors.mutedText,
//     lineHeight: 20,
//     fontFamily: fonts.body, 
//   },
//   time: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 8,
//     textAlign: "right",
//     fontFamily: fonts.light,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../Themes/colors";
import { fonts } from "../../Themes/fonts";
import { apiFetch } from "../../apiFetch";
import { useGeneration } from "../../Context/ImageGenerationContext";

function AllNotifications() {
  const { notifications, fetchNotifications } = useGeneration();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingRead, setLoadingRead] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // ✅ Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      setLoadingRead(true);
      await apiFetch(`/notifications/mark-as-read/${id}`, { method: "PUT" });
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setLoadingRead(false);
    }
  };

  // ✅ When user opens a notification → open modal & mark as read
  const handleNotificationPress = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
    if (!item.read) markAsRead(item.id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      {/* Seen / Unseen badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: item.read ? "#4CAF50" : "#FF5252" },
        ]}
      >
        <Text style={styles.statusText}>{item.isRead ? "Seen" : "Unseen"}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet.</Text>
        }
      />

      {/* Modal for detail view */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {selectedNotification ? (
              <>
                <Text style={styles.modalTitle}>
                  {selectedNotification.title}
                </Text>
                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>
                <Text style={styles.modalTime}>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </Text>

                {loadingRead ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ marginTop: 15 }}
                  />
                ) : (
                  <Pressable
                    onPress={handleCloseModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>Close</Text>
                  </Pressable>
                )}
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default AllNotifications;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bodybackground },

  card: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  unreadCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fonts.body,
  },
  title: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.heading,
    marginBottom: 6,
    paddingRight: 60, // avoid overlap with badge
  },
  message: {
    fontSize: 14,
    color: colors.mutedText,
    fontFamily: fonts.body,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
    fontFamily: fonts.light,
  },
  emptyText: {
    textAlign: "center",
    color: colors.mutedText,
    marginTop: 50,
    fontFamily: fonts.body,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.primary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginBottom: 12,
  },
  modalTime: {
    fontSize: 12,
    color: "#999",
    fontFamily: fonts.light,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontFamily: fonts.heading,
    fontSize: 15,
  },
});

