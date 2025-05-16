import React from "react";
import RegisterForm from "../components/RegisterForm";
import UserAdminPanel from "../components/AdminPanel"; // nouveau composant

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white max-w-[800px] p-6 rounded-lg min-w-[300px] w-3/4 shadow-md">
        <div className="text-center text-lg font-bold text-blue-700 mb-4">
          Administration
        </div>
        <div className="mb-6">
          <RegisterForm />
        </div>
        <UserAdminPanel />
      </div>
    </div>
  );
};

export default Admin;
