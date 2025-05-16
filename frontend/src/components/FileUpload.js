import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../store/AuthContext";
import { useLocation } from "react-router-dom";
import { FaUpload, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function FileUpload({ loadFiles }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setUploadedUrl("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", currentUser.id);
    formData.append(
      "folderId",
      location.pathname.split("/").pop() !== "documents"
        ? parseInt(location.pathname.split("/").pop())
        : "null"
    );

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setMessage(res.data.message);
      setUploadedUrl(`http://localhost:8000${res.data.filePath}`);
      loadFiles();
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload.");
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="flex items-center gap-3 text-3xl font-semibold text-gray-800 mb-6">
        <FaUpload className="text-blue-600" />
        Importer un fichier
      </h2>

      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-12 mb-6 text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-colors"
      >
        {file ? (
          <span className="text-lg font-medium text-gray-800">{file.name}</span>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 6v6"
              />
            </svg>
            <span className="text-sm font-semibold">Cliquez ou glissez un fichier ici pour uploader</span>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <button
        onClick={handleUpload}
        className="w-full bg-black hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!file}
      >
        Envoyer
      </button>

      {message && (
        <div
          className={`mt-5 flex items-center gap-2 text-sm font-medium ${
            message.toLowerCase().includes("erreur")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message.toLowerCase().includes("erreur") ? (
            <FaExclamationTriangle className="text-red-600" />
          ) : (
            <FaCheckCircle className="text-green-600" />
          )}
          {message}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4 text-sm text-center">
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Voir le fichier importé
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
