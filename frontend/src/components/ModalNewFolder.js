import React, { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { useLocation } from "react-router-dom";

const ModalNewFolder = ({ setShowModal, handleCreateFolder }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  return (
    <form
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onSubmit={handleCreateFolder}
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Nouveau dossier</h2>
        <input
          type="text"
          placeholder="Nom du dossier"
          name="name"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-black rounded"
          >
            Créer
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModalNewFolder;
