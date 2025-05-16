import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../store/AuthContext";
import { useLocation } from "react-router-dom";

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
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", currentUser.id);
    formData.append(
      "folderId",
      location.pathname.split("/")[location.pathname.split("/").length - 1] !==
        "documents"
        ? parseInt(
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          )
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
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload a File</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
      {message && <p className="mt-4">{message}</p>}
      {uploadedUrl && (
        <div className="mt-2">
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
