import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import SignInWithGoogle from "../components/SignInWithGoogle";
import SignInWithGithub from "../components/SignInWithGithub";

//Page d'inscription
const Register = () => {
  return (
    <div
      style={{ minHeight: "calc(100vh - 150px)" }}
      className="flex items-center justify-center "
    >
      <div className="bg-white max-w-[500px] p-6 rounded-lg min-w-[300px] w-1/2 shadow-md">
        <div className="text-center text-lg font-bold text-blue">
          S'inscrire
        </div>
        {/* On affiche les services d'authentification externe */}
        <div className="my-4 flex">
          <SignInWithGoogle />
          <SignInWithGithub />
        </div>
        {/* On affiche le formulaire classique (login, mdp) */}
        <div>
          <RegisterForm />
        </div>
        {/* Lien vers la page de connexion */}
        <div className="text-center mt-4 text-xs">
          Vous avez déja un compte ?{" "}
          <Link to={"/login"} className="font-bold text-blue">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
