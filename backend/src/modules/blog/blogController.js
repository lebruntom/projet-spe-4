import {
    addBlog,
    deleteBlog,
    findAllBlog,
    findAllBlogPrivate,
    findFiveLastBlog,
    findMyBlogs,
    updateBlogEntry,
} from "./blogService.js";
import jwt from "jsonwebtoken";

const secretKey = "fds4gfqdsJ5KDLjlf7Jdion8oifd9iOfnJoin$$$28fdsfdKofkDpfkdj";

//Fonction pour créer un blog
export async function createBlog(req, res) {
    try {
        const token = req.cookies.token;
        const {email, subject, title, status} = req.body;

        //On verifie le token
        const decoded = jwt.verify(token, secretKey);
        if (decoded) {
            const result = await addBlog(email, subject, title, status);
            res.status(201).json({result});
        } else {
            res
                .status(403)
                .json({message: "L'utilisateur n'est pas connecté", token: null});
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour delete un blog
export async function deleteBlogController(req, res) {
    try {
        const blogId = req.params.id;

        const result = await deleteBlog(blogId);
        res.status(202).json({result});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour update un blog
export async function updateBlog(req, res) {
    try {
        const {subject, title, status} = req.body;
        const blogId = req.params.id;

        const result = await updateBlogEntry(blogId, subject, title, status);
        res.status(201).json({result});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour getAll les blogs
export async function findAllBlogController(req, res) {
    try {
        const result = await findAllBlog();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour get les 5 derniers blogs
export async function findFiveLastBlogController(req, res) {
    try {
        const result = await findFiveLastBlog();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour getAll les blogs privés
export async function findAllPrivate(req, res) {
    const token = req.cookies.token;

    try {
        //On verifie le token
        const decoded = jwt.verify(token, secretKey);
        if (decoded) {
            const result = await findAllBlogPrivate();
            res.status(200).json(result);
        } else {
            res
                .status(403)
                .json({message: "L'utilisateur n'est pas connecté", token: null});
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

//Fonction pour get mes blogs
export async function findMyBlogsController(req, res) {
    const token = req.cookies.token;

    try {
        //On verifie le token
        const decoded = jwt.verify(token, secretKey);
        if (decoded) {
            const email = decoded.email;

            const result = await findMyBlogs(email);

            //   const result = await findMyBlogs();
            res.status(200).json(result);
        } else {
            res
                .status(403)
                .json({message: "L'utilisateur n'est pas connecté", token: null});
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}
