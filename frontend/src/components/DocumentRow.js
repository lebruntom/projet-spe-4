import React from "react";
import { useContext } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";

const DocumentRow = ({ infos, handleDeleteDocument }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`../../../docs/${infos.id}`);
  };

  console.log("infos", infos);

  return (
    <li
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4 list-none hover:bg-gray-300 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-4 flex items-center">
          <div
            className="flex items-center text-gray-800 hover:text-blue-400"
            target="_blank"
          >
            <FaFileAlt className="mr-3" size={20} />
            {infos.title}
          </div>
        </div>
        <div className="col-span-2 text-gray-600">{"file"}</div>
        <div className="col-span-4 text-gray-600">
          <span className="text-gray-400">Modifié le :</span>{" "}
          {infos.updated_at
            ? new Date(infos.updated_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : ""}
          <span className="text-gray-400"> par </span>
          {infos.email ? infos.email : "inconnu"}
        </div>
        <div className="col-span-1 text-gray-600">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={(e) => handleDeleteDocument(e, infos.id)}
            >
              <FaTrash />
            </button>
        </div>
      </div>
    </li>
  );
};

export default DocumentRow;
