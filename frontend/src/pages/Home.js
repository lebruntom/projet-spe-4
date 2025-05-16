import React, { useContext, useEffect, useState } from "react";
import DoubleAuth from "../components/DoubleAuth";
import { useCookies } from "react-cookie";
import { AuthContext } from "../store/AuthContext";

const Home = () => {
  const [cookies] = useCookies();

  const { currentUser } = useContext(AuthContext);
  // On initialise l'autorisation à false par defaut
  // Le user n'a pas encore passé la double vérification
  const [authorize, setAuthorize] = useState(false);

  useEffect(() => {
    if (cookies.doubleAuth) {
      setAuthorize(true);
    }
  }, [cookies]);

  return (
    <div>
      <div className="text-center text-xl font-bold text-blue">Accueil</div>

      {/* S'il a passé la double vérification (auhorize === true) on affiche son espace personnel */}
      {/* Sinon on affiche la double authentification */}
      {authorize ? (
        <div></div>
      ) : (
        <div
          style={{ minHeight: "calc(100vh - 150px)" }}
          className="flex items-center justify-center "
        >
          {currentUser && <DoubleAuth setAuthorize={setAuthorize} />}
        </div>
      )}
    </div>
  );
};

export default Home;
