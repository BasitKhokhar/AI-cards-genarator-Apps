// // context/GenerationContext.js
// import React, { createContext, useState, useContext } from "react";

// const GenerationContext = createContext();

// export const GenerationProvider = ({ children }) => {
//   const [generationStatus, setGenerationStatus] = useState(null); // "generating" | "completed" | null

//   return (
//     <GenerationContext.Provider value={{ generationStatus, setGenerationStatus }}>
//       {children}
//     </GenerationContext.Provider>
//   );
// };

// export const useGeneration = () => useContext(GenerationContext);
import React, { createContext, useState, useContext } from "react";

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [generationStatus, setGenerationStatus] = useState({
    isLoading: false,
    progress: 0,
    message: "",
  });

  const startMockGeneration = async (payload) => {
    console.log("🚀 Starting mock generation:", payload);

    setGenerationStatus({
      isLoading: true,
      progress: 0,
      message: "Preparing input...",
    });

    // Simulate 10s mock API process
    for (let i = 1; i <= 10; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      setGenerationStatus((prev) => ({
        ...prev,
        progress: i * 10,
        message: i < 10 ? `Processing... ${i * 10}%` : "✅ Generation complete",
      }));
    }

    setTimeout(() => {
      setGenerationStatus({ isLoading: false, progress: 100, message: "" });
    }, 1200);
  };

  return (
    <GenerationContext.Provider value={{ generationStatus, startMockGeneration }}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => useContext(GenerationContext);
