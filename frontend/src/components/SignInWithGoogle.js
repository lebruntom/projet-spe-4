import React from "react";
import { FaGoogle } from "react-icons/fa";

//Composant qui appel la route api pour se connecter ou s'inscrire avec google
const SignInWithGoogle = () => {
  return (
    <a
      href="http://localhost:8000/auth/google/callback"
      className="w-full h-[50px] border border-1 flex items-center justify-center cursor-pointer"
    >
      <FaGoogle className="text-blue" />
    </a>
  );
};

export default SignInWithGoogle;
