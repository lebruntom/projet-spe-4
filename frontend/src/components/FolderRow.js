import React from "react";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";

const FolderRow = ({ name, id }) => {
  return (
    <Link to={`${id}`}>
      <li className="list-none border border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 shadow-md transition p-4 mb-3 flex items-center gap-3 cursor-pointer">
        <FaFolder className="text-blue-600" size={22} />
        <span className="text-blue-800 font-semibold text-lg hover:underline transition">
          {name}
        </span>
      </li>
    </Link>
  );
};

export default FolderRow;
