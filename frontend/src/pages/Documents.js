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

export default function Documents() {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const loadFolders = () => {
    axios
      .get(
        `http://localhost:8000/folders/${
          location.pathname.split("/")[
            location.pathname.split("/").length - 1
          ] !== "documents"
            ? parseInt(
                location.pathname.split("/")[
                  location.pathname.split("/").length - 1
                ]
              )
            : "null"
        }/user/${currentUser.id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setFolders(res.data);
      })
      .catch((err) => {
        console.error("Erreur récupération dossiers", err);
      });
  };

  const loadFiles = () => {
    axios
      .get(
        `http://localhost:8000/files/${currentUser.id}/folder/${
          location.pathname.split("/")[
            location.pathname.split("/").length - 1
          ] !== "documents"
            ? parseInt(
                location.pathname.split("/")[
                  location.pathname.split("/").length - 1
                ]
              )
            : "null"
        }`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.error("Erreur récupération des fichiers", err);
      });
  };

  useEffect(() => {
    if (!currentUser?.id) return;

    axios
      .get(
        `http://localhost:8000/documents/user/${currentUser.id}/folder/${
          location.pathname.split("/")[
            location.pathname.split("/").length - 1
          ] !== "documents"
            ? parseInt(
                location.pathname.split("/")[
                  location.pathname.split("/").length - 1
                ]
              )
            : null
        }`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setDocuments(res.data);
      })
      .catch((err) => {
        console.error("Erreur récupération documents", err);
      });

    loadFiles();

    loadFolders();
  }, [currentUser, location.pathname]);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    const fileName = e.target.name.value;

    axios.post("http://localhost:8000/folders", {
      name: fileName,
      parentId:
        location.pathname.split("/")[
          location.pathname.split("/").length - 1
        ] !== "documents"
          ? parseInt(
              location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ]
            )
          : null,
      userId: currentUser.id,
    });

    loadFolders();
    showToastMessage("Le dossier a été créé avec succès.", "success");
    setShowModal(false);
  };

  const handleDeleteDocument = (e, id) => {
    e.stopPropagation();

    axios
      .delete(`http://localhost:8000/document/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
        showToastMessage("Le document a été supprimé avec succès.", "success");
      })
      .catch((err) => {
        console.error("Erreur suppression document", err);
      });
  };

  return (
    <div>
      <h2 className="text-xl text-center font-semibold">Mes documents</h2>
      <div className=" flex gap-2 my-8">
        <Button
          className="bg-gray-800 hover:bg-gray-600 text-white"
          onClick={() =>
            navigate(
              `/docs/${uuidV4()}?folderId=${
                location.pathname.split("/")[
                  location.pathname.split("/").length - 1
                ] !== "documents"
                  ? parseInt(
                      location.pathname.split("/")[
                        location.pathname.split("/").length - 1
                      ]
                    )
                  : "null"
              }`
            )
          }
        >
          Créer un fichier
        </Button>
        <Button
          className="bg-gray-800 hover:bg-gray-600 text-white"
          onClick={() => setShowModal(true)}
        >
          Créer un dossier
        </Button>
        <FileUpload loadFiles={loadFiles} />
      </div>
      {showModal && (
        <ModalNewFolder
          setShowModal={setShowModal}
          handleCreateFolder={handleCreateFolder}
        />
      )}

      {folders.map((folder) => (
        <FolderRow key={folder.id} name={folder.name} id={folder.id} />
      ))}
      {documents.length === 0 && folders.length === 0 && (
        <p>Aucun document ou dossier partagé avec vous.</p>
      )}
      {documents.map((doc) => (
        <DocumentRow
          key={doc.id}
          infos={doc}
          handleDeleteDocument={handleDeleteDocument}
        />
      ))}
      {files.map((file) => (
        <FileRow key={file.id} infos={file} />
      ))}
    </div>
  );
}
