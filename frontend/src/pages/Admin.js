import RegisterForm from "../components/RegisterForm";
import React from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white max-w-[500px] p-6 rounded-lg min-w-[300px] w-1/2 shadow-md">
        <div className="text-center text-lg font-bold text-blue">
          Administration
        </div>
        <div className="mt-4">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Admin;