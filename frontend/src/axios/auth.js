import axios from "axios";

const base = "http://localhost:8000";

//Route de connexion
export const login = async (body) => {
  const res = await axios.post(`${base}/login`, body, {
    withCredentials: true,
  });

  return res;
};

//Route d'inscription
export const register = async (body) => {
  const res = await axios.post(`${base}/register`, body, {
    withCredentials: true,
  });

  return res;
};

//Route pour generer le qrCode pour la double auth
export const createDoubleAuth = async (body) => {
  const res = await axios.post(`${base}/createDoubleAuth`, body, {
    withCredentials: true,
  });
  return res;
};

//Route pour check si le code de double auth saisi est le bon
export const verifyDoubleAuth = async (body) => {
  const res = await axios.post(`${base}/verifyDoubleAuth`, body, {
    withCredentials: true,
  });
  return res;
};

//Route qui verifie si le token du user est encore valide
export const userIsLogged = async () => {
  const res = await axios.get(`${base}/userIsLogged`, {
    withCredentials: true,
  });
  return res;
};

//route qui Recupere l'info si on doit afficher le qrcode
export const qrCodeStatus = async () => {
  const res = await axios.get(`${base}/qrCodeStatus`, {
    withCredentials: true,
  });
  return res;
};
