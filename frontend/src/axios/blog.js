import axios from "axios";

const base = "http://localhost:8000";

//Route pour check si le code de double auth saisi est le bon
export const createBlog = async (body) => {
  const res = await axios.post(`${base}/blog/create`, body, {
    withCredentials: true,
  });
  return res;
};

//Route pour mettre à jour un article
export const updateBlog = async (body, id) => {
  const res = await axios.post(`${base}/blog/update/${id}`, body, {
    withCredentials: true,
  });
  return res;
};
//Route pour supprimer un blog
export const deleteBlog = async (id) => {
  const res = await axios.delete(`${base}/blog/delete/${id}`, {
    withCredentials: true,
  });
  return res;
};
//Route pour recuperer tous les blogs public
export const findAllBlog = async (id) => {
  const res = await axios.get(`${base}/blog/findAll`, {
    withCredentials: true,
  });
  return res;
};
//ROute pour récuperer les 5 derniers blogs
export const findFiveLastBlog = async (id) => {
  const res = await axios.get(`${base}/blog/findFiveLast`, {
    withCredentials: true,
  });
  return res;
};
//Route pour récuperer tous les blogs privés
export const findAllBlogPrivate = async (id) => {
  const res = await axios.get(`${base}/blog/findAllPrivate`, {
    withCredentials: true,
  });
  return res;
};
//Route pour récupérer tous les blogs d'un utilisateur
export const myblogs = async () => {
  const res = await axios.get(`${base}/blog/myBlogs`, {
    withCredentials: true,
  });
  return res;
};
