import React, { useEffect, useState } from "react";
import { findFiveLastBlog } from "../axios/blog";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  //Récupération des blogs
  useEffect(() => {
    findFiveLastBlog().then((res) => {
      //Si la réponse est 200 on rempli le state
      if (res.status === 200) {
        setBlogs(res.data);
      }
    });
  }, []);

  return (
    <div>
      <div className="font-bold text-center text-xl mb-4 text-blue">
        5 derniers blogs
      </div>
      {/* On parcours et on affiche les blogs  */}
      <div className="flex flex-wrap justify-around">
        {blogs.map((blog) => {
          return (
            <BlogCard
              key={`${blog.id}- five last`}
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

export default Home;
