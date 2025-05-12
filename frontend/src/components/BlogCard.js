import React from "react";
import { deleteBlog } from "../axios/blog";
import { showToastMessage } from "../utils/common";

const BlogCard = ({
  email,
  title,
  content,
  date,
  id,
  setNeedRefresh,
  blog,
  setArticleToUpdate,
}) => {
  //Actualiser la liste des blogs quand on en crée un nouveau
  const handleDeleteBlog = () => {
    deleteBlog(id)
      .then((res) => {
        setNeedRefresh(true);
        showToastMessage("Article supprimé", "success");
      })
      .catch((err) => {
        showToastMessage("erreur veuillez réssayer", "error");
      });
  };

  return (
    <div className="bg-white p-4 rounded-lg m-2 w-1/4 min-w-[300px]">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue mr-4 rounded-[50%] flex justify-center items-center text-white text-sm">
          {email.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-bold">{email}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
      </div>
      <div className="text-lg font-bold text-gray-800">{title}</div>
      <div className="text-sm mb-4">{content}</div>
      {id && (
        <div className="flex justify-between">
          <button
            type="button"
            className="border border-gray-500 text-xs rounded-lg py-1 px-2 cursor-pointer transition duration-200 hover:bg-gray-100 text-sm flex items-center"
            onClick={() => setArticleToUpdate(blog)}
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={handleDeleteBlog}
            className="border border-gray-500 text-xs rounded-lg py-1 px-2 cursor-pointer transition duration-200 hover:bg-gray-100 text-sm flex items-center"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
