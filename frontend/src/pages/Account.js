import React, { useEffect, useState } from "react";
import DoubleAuth from "../components/DoubleAuth";
import CreateBlog from "../components/CreateBlog";
import { useSearchParams } from "react-router-dom";
import { showToastMessage } from "../utils/common";
import MyBlogs from "../components/MyBlogs";
import UpdateBlog from "../components/UpdateBlog";
import { useCookies } from "react-cookie";

const Account = () => {
  const [searchParams] = useSearchParams();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [articleToUpdate, setArticleToUpdate] = useState(null);
  const [cookies] = useCookies();
  // On initialise l'autorisation à false par defaut
  // Le user n'a pas encore passé la double vérification
  const [authorize, setAuthorize] = useState(false);

  //Affiche le toast connexion réussi si dans l'url il y a le param login
  useEffect(() => {
    const loginParam = searchParams.get("login");
    if (loginParam) {
      setShowToast(true);
    }
  }, [searchParams]);

  useEffect(() => {
    showToast && showToastMessage("Connexion réussie", "success");
  }, [showToast]);

  useEffect(() => {
    if (cookies.doubleAuth) {
      setAuthorize(true);
    }
  }, [cookies]);

  return (
    <div>
      <div className="text-center text-xl font-bold text-blue">
        Mon espace personnel
      </div>

      {/* S'il a passé la double vérification (auhorize === true) on affiche son espace personnel */}
      {/* Sinon on affiche la double authentification */}
      {authorize ? (
        <div>
          <div className="flex">
            <div className="w-1/2 bg-white m-2 p-4">
              <div className="text-lg font-bold text-blue">Créer un blog</div>
              <CreateBlog setNeedRefresh={setNeedRefresh} />
            </div>
            {articleToUpdate && (
              <div className="w-1/2 bg-white m-2 p-4">
                <div className="text-lg font-bold text-blue">
                  Modifier un blog
                </div>
                <UpdateBlog
                  setNeedRefresh={setNeedRefresh}
                  blog={articleToUpdate}
                />
              </div>
            )}
          </div>

          <MyBlogs
            needRefresh={needRefresh}
            setNeedRefresh={setNeedRefresh}
            setArticleToUpdate={setArticleToUpdate}
          />
        </div>
      ) : (
        <div
          style={{ minHeight: "calc(100vh - 150px)" }}
          className="flex items-center justify-center "
        >
          <DoubleAuth setAuthorize={setAuthorize} />
        </div>
      )}
    </div>
  );
};

export default Account;
