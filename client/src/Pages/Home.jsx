import React from "react";
import { useNavigate } from "react-router-dom";
import CapsuleForm from "../Components/CapsuleForm";

const Home = () => {
  const navigate = useNavigate();

  const handleCapsuleListClick = () => {
    navigate("/capsule-list");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-r from-[#34ace0] to-[#55E6C1] ">
      <div className="w-full max-w-lg space-y-2">
        <CapsuleForm />
        <button
          type="button"
          onClick={handleCapsuleListClick}
          className="w-full md:w-auto px-6 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          Capsule List
        </button>
      </div>
    </div>
  );
};

export default Home;