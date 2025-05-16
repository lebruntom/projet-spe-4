import React, { useEffect, useState } from "react";
import axios from "axios";

const UserAdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/admin/users", { withCredentials: true });
    setUsers(res.data);
  };

  const handleBlockToggle = async (user) => {
    const url = `http://localhost:8000/admin/users/${user.id}/${user.blocked ? "unblock" : "block"}`;
    await axios.put(url, {}, { withCredentials: true });
    fetchUsers(); // refresh list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Gestion des utilisateurs</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-500 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-2">Email</th>
            <th scope="col" className="px-4 py-2">Statut</th>
            <th scope="col" className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b">
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.blocked ? "Bloqué" : "Actif"}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleBlockToggle(user)}
                  className={`px-2 py-1 rounded ${
                    user.blocked ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {user.blocked ? "Débloquer" : "Bloquer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdminPanel;
