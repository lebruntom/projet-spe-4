import React from "react";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";

const FolderRow = ({ name, id }) => {
  return (
    <Link to={`${id}`}>
      <li className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4 list-none hover:bg-gray-300">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-6 flex items-center">
            <div className="flex items-center text-gray-800 hover:text-blue-400">
              <FaFolder className="mr-3" size={20} />
              {name}
            </div>
          </div>
          <div className="col-span-3 text-gray-400"></div>
          <div className="col-span-3 text-gray-400"></div>
        </div>
      </li>
    </Link>
  );
};

export default FolderRow;
