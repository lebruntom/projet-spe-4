import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import Button from "../components/ui/Button";
import FolderRow from "../components/FolderRow";
import DocumentRow from "../components/DocumentRow";
import ModalNewFolder from "../components/ModalNewFolder";
import { v4 as uuidV4 } from "uuid";
import { showToastMessage } from "../utils/common";
import FileUpload from "../components/FileUpload";
import FileRow from "../components/FileRow";
import { FaFile, FaFolder } from "react-icons/fa";

export default function Documents() {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const folderId =
    location.pathname.split("/").slice(-1)[0] !== "documents"
      ? parseInt(location.pathname.split("/").slice(-1)[0])
      : null;

  const loadFolders = () => {
    axios
      .get(
        `http://localhost:8000/folders/${folderId ?? "null"}/user/${
          currentUser.id
        }`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setFolders(res.data))
      .catch((err) => console.error("Erreur récupération dossiers", err));
  };

  const loadFiles = () => {
    axios
      .get(
        `http://localhost:8000/files/${currentUser.id}/folder/${
          folderId ?? "null"
        }`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Erreur récupération des fichiers", err));
  };

  useEffect(() => {
    if (!currentUser?.id) return;

    axios
      .get(
        `http://localhost:8000/documents/user/${currentUser.id}/folder/${folderId}`,
        { withCredentials: true }
      )
      .then((res) => setDocuments(res.data))
      .catch((err) => console.error("Erreur récupération documents", err));
    if (folderId) {
      axios
        .get(`http://localhost:8000/folders/breadcrumb/${folderId}`, {
          withCredentials: true,
        })
        .then((res) => setBreadcrumb(res.data))
        .catch((err) =>
          console.error("Erreur récupération du breadcrumb", err)
        );
    }
    loadFiles();
    loadFolders();
  }, [currentUser, location.pathname]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;

    try {
      await axios.post(
        "http://localhost:8000/folders",
        {
          name,
          parentId: folderId,
          userId: currentUser.id,
        },
        { withCredentials: true }
      );
      showToastMessage("Le dossier a été créé avec succès.", "success");
      loadFolders();
      setShowModal(false);
    } catch (err) {
      console.error("Erreur création dossier", err);
    }
  };

  const handleDeleteDocument = (e, id) => {
    e.stopPropagation();
    axios
      .delete(`http://localhost:8000/document/${id}`, { withCredentials: true })
      .then(() => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        showToastMessage("Le document a été supprimé avec succès.", "success");
      })
      .catch((err) => console.error("Erreur suppression document", err));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-6">
          <Button
            className="bg-black hover:bg-gray-800 text-white font-semibold rounded-lg px-6 py-6 shadow flex flex-col items-center min-w-[160px] transition-transform hover:scale-105"
            onClick={() =>
              navigate(`/docs/${uuidV4()}?folderId=${folderId ?? "null"}`)
            }
          >
            <span className="text-4xl font-extrabold mb-3 leading-none select-none">
              +
            </span>
            <div className="flex items-center gap-3 text-lg">
              <FaFile className="text-xl" />
              <span>Créer un fichier</span>
            </div>
          </Button>

          <Button
            className="bg-black hover:bg-gray-800 text-white font-semibold rounded-lg px-6 py-6 shadow flex flex-col items-center min-w-[160px] transition-transform hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            <span className="text-4xl font-extrabold mb-3 leading-none select-none">
              +
            </span>
            <div className="flex items-center gap-3 text-lg">
              <FaFolder className="text-xl" />
              <span>Créer un dossier</span>
            </div>
          </Button>
        </div>

        <div className="flex-grow min-w-[280px] max-w-[400px]">
          <FileUpload loadFiles={loadFiles} />
        </div>
      </div>

      {showModal && (
        <ModalNewFolder
          setShowModal={setShowModal}
          handleCreateFolder={handleCreateFolder}
        />
      )}
      {breadcrumb.length > 0 && (
        <div className="text-sm text-gray-600 mb-4 flex items-center flex-wrap gap-1">
          <span
            onClick={() => navigate("/documents")}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Accueil
          </span>
          {breadcrumb.map((folder, index) => (
            <span key={folder.id} className="flex items-center gap-1">
              <span className="mx-1 text-gray-400">/</span>
              <span
                onClick={() => navigate(`/documents/${folder.id}`)}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {folder.name}
              </span>
            </span>
          ))}
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mes documents</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Dossiers</h3>
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <FolderRow key={folder.id} name={folder.name} id={folder.id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Aucun dossier disponible.</p>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Fichiers texte
        </h3>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                infos={doc}
                handleDeleteDocument={handleDeleteDocument}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Aucun document disponible.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Documents</h3>
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <FileRow key={file.id} infos={file} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Aucun fichier disponible.</p>
        )}
      </section>

      {folders.length === 0 && documents.length === 0 && files.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          Aucun document ou dossier partagé avec vous.
        </p>
      )}
    </div>
  );
}
