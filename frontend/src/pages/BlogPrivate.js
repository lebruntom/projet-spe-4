import React, { useEffect, useState } from "react";
import { findAllBlogPrivate } from "../axios/blog";
import BlogCard from "../components/BlogCard";

const BlogPrivate = () => {
  const [blogs, setBlogs] = useState([]);

  //Récupération des blogs
  useEffect(() => {
    findAllBlogPrivate().then((res) => {
      //Si la réponse est 200 on rempli le state
      if (res.status === 200) {
        setBlogs(res.data);
      }
    });
  }, []);

  return (
    <div>
      <div className="font-bold text-center text-xl mb-4 text-blue">
        Liste des blogs privés
      </div>
      {/* On parcours et on affiche les blogs  */}
      <div className="flex flex-wrap justify-around">
        {blogs.map((blog) => {
          return (
            <BlogCard
              key={`${blog.id}- privateblog`}
              email={blog.email}
              date={blog.created_at}
              content={blog.subject}
              title={blog.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BlogPrivate;
