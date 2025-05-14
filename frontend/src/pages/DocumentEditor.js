import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Button from "../components/ui/Button";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import { showToastMessage } from "../utils/common";
const SAVE_INTERVAL_MS = 2000;
export default function DocumentEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [quill, setQuill] = useState();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document, title) => {
      console.log("Document loaded:", document, title);
      quill.setContents(document);
      setTitle(title);
      quill.enable();
    });

    socket.emit("get-document", documentId, currentUser.id);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, _title) => {
      quill.updateContents(delta);
      setTitle(_title);
    };

    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket, quill, title]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta, title);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill, title]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents(), title, currentUser.id);
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill, title]);

  const wrapperRef = useRef();
  useEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);
    const q = new Quill(editor, { theme: "snow" });
    q.disable();
    q.setText("Loading...");
    setQuill(q);

    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = "";
      }
    };
  }, []);

  const handleShare = (e) => {
    e.preventDefault();
    // Logique d'envoi d'email ou de partage
    const email = e.target.email.value;
    console.log("Partage avec :", email);

    axios
      .post(`http://localhost:8000/document/${documentId}/share`, {
        email,
      })
      .then((response) => {
        showToastMessage("Utilisateur invité", "success");
      })
      .catch((error) => {
        console.error(error);
        showToastMessage("User inexistant", "error");
      });

    setShowModal(false);
  };

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.emit("send-changes", null, title); // Pas de delta (null), mais mise à jour du titre
  }, [title]); // À chaque changement de titre

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Partager</Button>

      {showModal && (
        <form
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onSubmit={handleShare}
        >
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Partager le document</h2>
            <input
              type="email"
              placeholder="Adresse e-mail"
              name="email"
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
                Partager
              </button>
            </div>
          </div>
        </form>
      )}
      <input
        type="text"
        placeholder="Titre du document"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4"
      />

      <div className="container" ref={wrapperRef}></div>
    </>
  );
}
