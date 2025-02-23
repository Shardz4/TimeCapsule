import React from "react";
import CapsuleList from "../Components/CapsuleList"; // Ensure correct path

const sampleCapsules = [
  {
    _id: "1",
    title: "My Happy Memory",
    content: "This is a wonderful moment I want to cherish forever!",
    releaseDate: "2025-03-01",
    media: "https://res.cloudinary.com/dosnuagvu/image/upload/v1737217730/milindsir_syuchr.jpg",
    hashValid: true,
    locked: false,
    emotions: {
      happy: 0.8,
      emotional: 0.6,
      love: 0.9,
    },
  },
];

function App() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-r from-[#34ace0] to-[#55E6C1]">
        <CapsuleList capsules={sampleCapsules} />
      </div>
    );
  }
  

export default App;
