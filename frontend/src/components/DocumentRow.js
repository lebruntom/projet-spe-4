import React, { useContext } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";

const DocumentRow = ({ infos, handleDeleteDocument }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleNavigate = (e) => {
    // Évite la navigation si on clique sur le bouton supprimer
    if (e.target.closest("button")) return;
    navigate(`../../../docs/${infos.id}`);
  };

  return (
    <li
      onClick={handleNavigate}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50list-none border border-gray-300 bg-gray-200  rounded-md hover:bg-gray-100 shadow-sm transition p-4 mb-3 cursor-pointer cursor-pointer transition"
    >
      <div className="flex items-center gap-3 w-full md:w-1/3">
        <FaFileAlt className="text-blue-500" size={20} />
        <span className="text-gray-800 font-medium">{infos.title}</span>
      </div>

      <div className="hidden md:block text-sm text-gray-500 w-1/6">
        Texte
      </div>

      <div className="text-sm text-gray-500 w-full md:w-1/2">
        <span className="text-gray-400">Modifié le :</span>{" "}
        {infos.updated_at
          ? new Date(infos.updated_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : ""}
        <span className="text-gray-400"> par </span>
        {infos.email || "inconnu"}
      </div>

      <div className="text-right">
        <button
          onClick={(e) => handleDeleteDocument(e, infos.id)}
          className="text-red-500 hover:text-red-700 transition"
          title="Supprimer"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </li>
  );
};

export default DocumentRow;
