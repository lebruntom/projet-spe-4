import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import SignInWithGoogle from "../components/SignInWithGoogle";
import SignInWithGithub from "../components/SignInWithGithub";

//Page de login
const Login = () => {
  return (
    <div
      style={{ minHeight: "calc(100vh - 150px)" }}
      className="flex items-center justify-center "
    >
      <div className="bg-white max-w-[500px] p-6 rounded-lg min-w-[300px] w-1/2 shadow-md">
        <div className="text-center text-lg font-bold text-blue">
          Se connecter
        </div>
        {/* On affiche les services d'authentification externe */}
        <div className="my-4 flex">
          <SignInWithGoogle />
          <SignInWithGithub />
        </div>
        {/* On affiche le formulaire classique (login, mdp) */}
        <div>
          <LoginForm />
        </div>
        {/* Lien vers la page d'inscription */}
        <div className="text-center mt-4 text-xs">
          Vous n’avez pas encore de compte ?{" "}
          <Link to={"/register"} className="font-bold text-blue">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
