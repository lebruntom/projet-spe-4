import React from "react";
import { useContext } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";

const FileRow = ({ infos }) => {
  const handleNavigate = (e) => {
    window.open(`http://localhost:8000${infos.path}`);
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
            {infos.path}
          </div>
        </div>
        <div className="col-span-2 text-gray-600">{infos.path.split('.')[1]}</div>
      </div>
    </li>
  );
};

export default FileRow;
