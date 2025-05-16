import React from "react";
import { FaFileAlt } from "react-icons/fa";

const FileRow = ({ infos }) => {
  const handleNavigate = () => {
    window.open(`http://localhost:8000${infos.path}`, "_blank");
  };

  return (
    <li
      onClick={handleNavigate}
      className="list-none border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-100 shadow-sm transition p-4 mb-3 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition">
          <FaFileAlt size={18} className="text-green-500" />
          <span className="font-normal truncate max-w-xs">
            {infos.path.split("/").pop()}
          </span>
        </div>
        <div className="text-xs text-gray-400 capitalize">
          {infos.path.split(".").pop()}
        </div>
      </div>
    </li>
  );
};

export default FileRow;
