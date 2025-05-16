import React from "react";
import LoginForm from "../components/LoginForm";


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
        {/* On affiche le formulaire classique (login, mdp) */}
        <div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
