import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../Themes/colors";

function AllNotifications() {
  // 📨 Static notification data
  const notifications = [
    {
      id: "1",
      title: "Welcome to CardiFy-AI 🎉",
      message:
        "Thank you for joining! Explore stunning AI-generated greeting cards and designs.",
      time: "2 mins ago",
    },
    {
      id: "2",
      title: "New AI Feature Unlocked 🚀",
      message:
        "Introducing our AI Wedding Card Generator — create elegant invites instantly!",
      time: "1 hour ago",
    },
    {
      id: "3",
      title: "Special Offer 💎",
      message:
        "Get 20% off on your next premium card generation — today only!",
      time: "Yesterday",
    },
    {
      id: "4",
      title: "System Update ⚙️",
      message:
        "Improved AI models for faster image generation and smoother performance.",
      time: "2 days ago",
    },
    {
      id: "5",
      title: "Reminder 🔔",
      message:
        "Your saved templates are ready to customize — open CardiFy-AI now!",
      time: "3 days ago",
    },
    {
      id: "6",
      title: "New Template Drop 🎨",
      message:
        "Explore 25+ brand-new templates for birthdays, weddings, and festivals — now live!",
      time: "4 days ago",
    },
    {
      id: "7",
      title: "Exclusive Pro Access 🔓",
      message:
        "You’ve unlocked free access to our Pro templates for the next 48 hours!",
      time: "5 days ago",
    },
    {
      id: "8",
      title: "AI Greeting Suggestions ✨",
      message:
        "Not sure what to write? Let our AI craft the perfect message for your card.",
      time: "6 days ago",
    },
    {
      id: "9",
      title: "Boost Your Creativity 💡",
      message:
        "Use the 'Inspire Me' button to get fresh design ideas tailored for you!",
      time: "1 week ago",
    },
    {
      id: "10",
      title: "Your Friend Loved Your Card ❤️",
      message:
        "Someone viewed and appreciated your latest greeting design — great job!",
      time: "1 week ago",
    },
    {
      id: "11",
      title: "New Festival Pack 🎊",
      message:
        "Celebrate Eid, Diwali & Christmas with our exclusive seasonal template bundle.",
      time: "2 weeks ago",
    },
    {
      id: "12",
      title: "Performance Boost ⚡",
      message:
        "Card previews now load 2x faster! Update your app for the best experience.",
      time: "2 weeks ago",
    },
    {
      id: "13",
      title: "AI Avatar Update 🧠",
      message:
        "Your favorite photo enhancer now supports custom avatar generation in HD!",
      time: "3 weeks ago",
    },
    {
      id: "14",
      title: "Weekly Inspiration 🪄",
      message:
        "Check out this week’s trending AI card styles — now available in Trending tab.",
      time: "3 weeks ago",
    },
    {
      id: "15",
      title: "Thank You 💖",
      message:
        "We’ve reached 10,000 users! Thank you for supporting CardiFy-AI and helping us grow.",
      time: "1 month ago",
    },
  ];

  // 💬 Render Each Notification
  const renderNotification = ({ item }) => (
    <View style={styles.card}>
      {/* <LinearGradient
        colors={colors.gradients.ocean}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.titleWrapper}
      > */}
        <Text style={styles.title}>{item.title}</Text>
      {/* </LinearGradient> */}
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default AllNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
    backgroundColor: colors.bodybackground,
  },
  card: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    // shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  titleWrapper: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700", marginBottom:6,
    color: colors.primary,
  },
  message: {
    fontSize: 14,
    color: colors.mutedText,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "right",
  },
});
