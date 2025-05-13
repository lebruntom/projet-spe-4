import React, { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import { userIsLogged } from "../axios/auth";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

// Création du contexte qui va gerer le maintient ou non de la connexion coté frontend
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies();

  const updateAuthContext = () => {
    //Call api qui verifie si le token est valide
    userIsLogged()
      .then((res) => {
        try {
          //S'il est valide il renvoi le token donc on peut le decoder
          const decoded = jwtDecode(res.data.token);
          if (decoded.email && decoded.id) {
            //Si on arrive a le decoder et qu'il contient un email on rempli le contexte
            setCurrentUser({ email: decoded.email, id: decoded.id });
          } else {
            //Sinon contexte à null (donc user pas connecté)
            setCurrentUser(null);
          }
          setLoading(false);
        } catch (err) {
          //Si on arrive pas à le decoder contexte à null aussi
          setCurrentUser(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        //Si le call api n'aboutit pas egalement
        setCurrentUser(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cookies.token !== null && cookies.token !== undefined) {
      updateAuthContext();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await updateAuthContext();
    };

    // Appel initial
    // Mettre à jour toutes les 10 sec pour voir si l'utilisateur est toujours co
    if (cookies.token !== null && cookies.token !== undefined) {
      const intervalId = setInterval(() => {
        fetchData();
      }, 10000);

      // Nettoyer l'intervalle lors du démontage du composant
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setLoading(false);
    }
  }, [updateAuthContext]);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
