import React, { useEffect, useState } from "react";
import { myblogs } from "../axios/blog";
import BlogCard from "./BlogCard";

const MyBlogs = ({ needRefresh, setNeedRefresh, setArticleToUpdate }) => {
  const [blogs, setBlogs] = useState([]);

  //récuperation de tous les blogs de l'utilisateur
  useEffect(() => {
    myblogs().then((res) => {
      //On rempli le state
      setBlogs(res.data);

      needRefresh && setNeedRefresh(false);
    });
  }, [needRefresh]);

  return (
    <div className="bg-white p-4">
      <div className="text-lg font-bold text-blue">Mes blogs</div>
      <div className="flex flex-wrap justify-around">
        {/* On affiche les blogs  */}
        {blogs.map((blog) => {
          return (
            <div key={`${blog.id}- myblogs`}>
              <BlogCard
                blog={blog}
                email={blog.email}
                date={blog.created_at}
                content={blog.subject}
                title={blog.title}
                id={blog.id}
                setNeedRefresh={setNeedRefresh}
                setArticleToUpdate={setArticleToUpdate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBlogs;
