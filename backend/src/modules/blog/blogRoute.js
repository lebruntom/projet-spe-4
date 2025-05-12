import express from "express";
import {
    createBlog,
    deleteBlogController,
    updateBlog,
    findAllBlogController,
    findFiveLastBlogController,
    findAllPrivate,
    findMyBlogsController,
} from "./blogController.js";

//On initialise
const blogRoute = express.Router();

blogRoute.get("/blog/findAll", findAllBlogController);
blogRoute.get("/blog/findFiveLast", findFiveLastBlogController);
blogRoute.post("/blog/create", createBlog);
//Delete Blog
blogRoute.delete("/blog/delete/:id", deleteBlogController);

//Update Blog
blogRoute.post("/blog/update/:id", updateBlog);

//Update Blog
blogRoute.get("/blog/findAllPrivate", findAllPrivate);

blogRoute.get("/blog/myBlogs", findMyBlogsController);

//Exportation des routes
export default blogRoute;
