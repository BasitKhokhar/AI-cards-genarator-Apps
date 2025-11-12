// import React, { createContext, useState, useContext } from "react";

// const GenerationContext = createContext();

// export const GenerationProvider = ({ children }) => {
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [generationStatus, setGenerationStatus] = useState({
//     isLoading: false,
//     progress: 0,
//     message: "",
//   });

//   const startMockGeneration = async (payload) => {
//     console.log("🚀 Starting mock generation:", payload);

//     setGenerationStatus({
//       isLoading: true,
//       progress: 0,
//       message: "Preparing input...",
//     });

//     // Simulate 10s mock API process
//     for (let i = 1; i <= 10; i++) {
//       await new Promise((res) => setTimeout(res, 1000));
//       setGenerationStatus((prev) => ({
//         ...prev,
//         progress: i * 10,
//         message: i < 10 ? `Processing... ${i * 10}%` : "✅ Generation complete",
//       }));
//     }

//     // After completion
//     setTimeout(() => {
//       setGenerationStatus({ isLoading: false, progress: 100, message: "" });
//       setRefreshKey((prev) => prev + 1); // 🔁 trigger gallery refresh
//     }, 1200);
//   };

//   return (
//     <GenerationContext.Provider
//       value={{ generationStatus, startMockGeneration, refreshKey }}
//     >
//       {children}
//     </GenerationContext.Provider>
//   );
// };

// export const useGeneration = () => useContext(GenerationContext);
// 📁 contexts/GenerationContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { apiFetch } from "../apiFetch";

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [generationStatus, setGenerationStatus] = useState({
    isLoading: false,
    progress: 0,
    message: "",
  });

  // 🆕 Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 📡 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/notifications/allnotifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("⚠️ Error fetching notifications:", err);
    }
  };

  // 🧠 Start mock generation (same logic)
  const startMockGeneration = async (payload) => {
    console.log("🚀 Starting mock generation:", payload);

    setGenerationStatus({
      isLoading: true,
      progress: 0,
      message: "Preparing input...",
    });

    for (let i = 1; i <= 10; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      setGenerationStatus((prev) => ({
        ...prev,
        progress: i * 10,
        message: i < 10 ? `Processing... ${i * 10}%` : "✅ Generation complete",
      }));
    }

    // When complete → create notification
    try {
      await apiFetch("/notifications/Createnotifications", {
        method: "POST",
        body: JSON.stringify({
          title: "AI Image Generated ✅",
          message: `Your prompt "${payload.prompt}" has been generated successfully.`,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("⚠️ Error saving notification:", err);
    }

    setTimeout(() => {
      setGenerationStatus({ isLoading: false, progress: 100, message: "" });
      setRefreshKey((prev) => prev + 1); // refresh gallery
      fetchNotifications(); // 🔁 refresh notification list
    }, 1000);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <GenerationContext.Provider
      value={{
        generationStatus,
        startMockGeneration,
        refreshKey,
        notifications,
        unreadCount,
        fetchNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => useContext(GenerationContext);
