import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      className="flex items-center text-gray-800 hover:text-blue-400"
      onClick={handleBack}
    >
      <FaArrowLeft className="mr-2" />
      Retour
    </button>
  );
};

export default BackButton;
