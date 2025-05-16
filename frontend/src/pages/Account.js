import React, { useState } from "react";

const Account = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Mot de passe mis à jour avec succès.");
      } else {
        setMessage(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon compte</h1>
      <p className="text-gray-600">Gérez vos informations personnelles.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-medium py-2.5 rounded transition"
        >
          Mettre à jour le mot de passe
        </button>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("succès")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Account;
