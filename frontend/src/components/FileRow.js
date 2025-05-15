import React from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const FileRow = ({ infos, handleDeleteDocument }) => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`../../../docs/${infos.id}`);
  };

  return (
    <li
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4 list-none hover:bg-gray-300 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <div
            className="flex items-center text-gray-800 hover:text-blue-400"
            target="_blank"
          >
            <FaFileAlt className="mr-3" size={20} />
            {infos.title}
          </div>
        </div>
        <div className="col-span-5 text-gray-600">{"file"}</div>
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

export default FileRow;
