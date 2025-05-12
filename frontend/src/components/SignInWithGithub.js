import { FaGithub } from "react-icons/fa";

//Composant qui appel la route api pour se connecter ou s'inscrire avec github
const SignInWithGithub = () => {
  return (
    <a
      href="http://localhost:8000/auth/github/callback"
      className="w-full h-[50px] border border-1 flex items-center justify-center cursor-pointer"
    >
      <FaGithub className="text-blue" />
    </a>
  );
};

export default SignInWithGithub;
