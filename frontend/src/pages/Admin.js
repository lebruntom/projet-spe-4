import React from "react";
import RegisterForm from "../components/RegisterForm";
import AdminPanel from "../components/AdminPanel"; // nouveau composant
import axios from "axios";
import { useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur de chargement des utilisateurs", err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white max-w-[800px] p-6 rounded-lg min-w-[300px] w-3/4 shadow-md">
        <div className="text-center text-lg font-bold text-blue-700 mb-4">
          Administration
        </div>
        <div className="mb-6">
          <RegisterForm  fetchUsers={fetchUsers}/>
        </div>
        <AdminPanel users={users} fetchUsers={fetchUsers} />
      </div>
    </div>
  );
};

export default Admin;
