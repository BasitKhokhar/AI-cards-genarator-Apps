// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   TouchableOpacity,
//   Modal,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { colors } from "../../Themes/colors";
// import { fonts } from "../../Themes/fonts";
// import { apiFetch } from "../../apiFetch";

// function AllNotifications() {
//   const navigation = useNavigation();

//   const [notifications, setNotifications] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [loadingRead, setLoadingRead] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // 📡 Fetch notifications (called when screen opens or refreshes)
//   const fetchNotifications = async () => {
//     try {
//       const res = await apiFetch("/notifications/allnotifications");
//       const data = await res.json();
//       if (data.success) {
//         setNotifications(data.notifications);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching notifications:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // 🔁 Refresh handler
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchNotifications();
//   };

//   // 👁️ Mark a single notification as read
//   const markAsRead = async (id) => {
//     try {
//       setLoadingRead(true);
//       await apiFetch(`/notifications/mark-as-read/${id}`, { method: "PUT" });
//       await fetchNotifications();
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     } finally {
//       setLoadingRead(false);
//     }
//   };

//   // 📱 When screen mounts → fetch notifications
//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const handleNotificationPress = (item) => {
//     setSelectedNotification(item);
//     setModalVisible(true);
//     if (!item.isRead) markAsRead(item.id);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setSelectedNotification(null);
//   };

//   const handleGoToAssets = () => {
//     setModalVisible(false);
//      navigation.navigate("BottomTabs", { screen: "Assets" }); // 👈 ensure this screen name matches your navigator
//   };

//   const renderNotification = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.card, !item.isRead && styles.unreadCard]}
//       onPress={() => handleNotificationPress(item)}
//     >
//       <View style={styles.headingrow}>
//         <Text style={styles.title}>{item.title}</Text>
//         <View>
//           <Text
//             style={[
//               styles.statusText,
//               {
//                 backgroundColor: item.isRead
//                   ? colors.border
//                   : colors.error,
//               },
//             ]}
//           >
//             {item.isRead ? "Seen" : "Unseen"}
//           </Text>
//         </View>
//       </View>
//       <Text style={styles.message} numberOfLines={2}>
//         {item.message}
//       </Text>
//       <Text style={styles.time}>
//         {new Date(item.createdAt).toLocaleString()}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color={colors.primary}
//           style={{ marginTop: 50 }}
//         />
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderNotification}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No notifications yet.</Text>
//           }
//         />
//       )}

//       {/* Modal for detail view */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={handleCloseModal}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalBox}>
//             {selectedNotification ? (
//               <>
//                 <Text style={styles.modalTitle}>
//                   {selectedNotification.title}
//                 </Text>
//                 <Text style={styles.modalMessage}>
//                   {selectedNotification.message}
//                 </Text>

//                 <View style={styles.bottomRow}>
//                   <Text style={styles.modalTime}>
//                     {new Date(selectedNotification.createdAt).toLocaleString()}
//                   </Text>

//                   {/* 🎯 Only show this button for generated image notifications */}
//                   {selectedNotification.title === "New Generated Image" && (
//                     <Pressable
//                       onPress={handleGoToAssets}
//                       style={styles.goToAssetsBtn}
//                     >
//                       <Text style={styles.goToAssetsText}>Go to Assets</Text>
//                     </Pressable>
//                   )}
//                 </View>

//                 {loadingRead ? (
//                   <ActivityIndicator
//                     size="small"
//                     color={colors.primary}
//                     style={{ marginTop: 15 }}
//                   />
//                 ) : (
//                   <Pressable
//                     onPress={handleCloseModal}
//                     style={styles.closeButton}
//                   >
//                     <Text style={styles.closeText}>Close</Text>
//                   </Pressable>
//                 )}
//               </>
//             ) : null}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// export default AllNotifications;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: colors.bodybackground },
//   card: {
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 16,
//     padding: 15,
//     marginVertical: 8,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   headingrow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   unreadCard: {},
//   statusText: {
//     color: "#fff",
//     fontSize: 11,
//     fontFamily: fonts.body,
//     borderRadius: 50,
//     paddingVertical: 2,
//     paddingHorizontal: 10,
//     fontWeight: "600",
//   },
//   title: {
//     fontSize: 15,
//     color: colors.primary,
//     fontFamily: fonts.heading,
//     marginBottom: 6,
//     paddingRight: 60,
//   },
//   message: {
//     fontSize: 14,
//     color: colors.mutedText,
//     fontFamily: fonts.body,
//   },
//   time: {
//     fontSize: 12,
//     color: "#999",
//     marginTop: 6,
//     textAlign: "right",
//     fontFamily: fonts.light,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: colors.mutedText,
//     marginTop: 50,
//     fontFamily: fonts.body,
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalBox: {
//     backgroundColor: colors.cardsbackground,
//     borderRadius: 20,
//     padding: 20,
//     width: "100%",
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontFamily: fonts.heading,
//     color: colors.primary,
//     marginBottom: 8,
//   },
//   modalMessage: {
//     fontSize: 15,
//     fontFamily: fonts.body,
//     color: colors.mutedText,
//     marginBottom: 12,
//   },
//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modalTime: {
//     fontSize: 12,
//     color: colors.text,
//     fontFamily: fonts.light,
//   },
//   goToAssetsBtn: {
//     backgroundColor: colors.primary,
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//   },
//   goToAssetsText: {
//     color: "#fff",
//     fontFamily: fonts.heading,
//     fontSize: 13,
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: colors.border,
//     borderRadius: 12,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   closeText: {
//     color: "#fff",
//     fontFamily: fonts.heading,
//     fontSize: 15,
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
import { useNavigation } from "@react-navigation/native";
function AllNotifications() {
    const navigation = useNavigation();
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

    const handleGoToAssets = () => {
    setModalVisible(false);
     navigation.navigate("BottomTabs", { screen: "Assets" }); // 👈 ensure this screen name matches your navigator
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
       <View style={styles.headingrow}>
         <Text style={styles.title}>{item.title}</Text>
         <View>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: item.isRead
                  ? colors.border
                  : colors.error,
              },
            ]}
          >
            {item.isRead ? "Seen" : "Unseen"}
          </Text>
        </View>
      </View>
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

                <View style={styles.bottomRow}>
                  <Text style={styles.modalTime}>
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </Text>

                  {/* 🎯 Only show this button for generated image notifications */}
                  {selectedNotification.title === "New Generated Image" && (
                    <Pressable
                      onPress={handleGoToAssets}
                      style={styles.goToAssetsBtn}
                    >
                      <Text style={styles.goToAssetsText}>Go to Assets</Text>
                    </Pressable>
                  )}
                </View>

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
   headingrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // unreadCard: {
  //   borderColor: colors.primary,
  //   borderWidth: 1.5,
  // },
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
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontWeight: "600",
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
    width: "100%",
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
   bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTime: {
    fontSize: 12,
    color: colors.text,
    fontFamily: fonts.light,
  },
  goToAssetsBtn: {
    // backgroundColor: colors.primary,
    borderWidth:1,borderColor:colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  goToAssetsText: {
    color: "#fff",
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.border,
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

