import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLock, FaUnlock } from "react-icons/fa";

const UserAdminPanel = () => {
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

  const handleBlockToggle = async (user) => {
    const url = `http://localhost:8000/admin/users/${user.id}/${user.blocked ? "unblock" : "block"}`;
    try {
      await axios.put(url, {}, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors du changement de statut", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Gestion des utilisateurs</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      user.blocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.blocked ? "Bloqué" : "Actif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                      user.blocked
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {user.blocked ? <FaUnlock /> : <FaLock />}
                    {user.blocked ? "Débloquer" : "Bloquer"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAdminPanel;
