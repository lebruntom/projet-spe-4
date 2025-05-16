import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import Button from "../components/ui/Button";
import { AuthContext } from "../store/AuthContext";
import axios from "axios";
import { showToastMessage } from "../utils/common";
import Peer from 'simple-peer/simplepeer.min.js';
const SAVE_INTERVAL_MS = 2000;
export default function DocumentEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [quill, setQuill] = useState();
  const { currentUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
    const [inCall, setInCall] = useState(false);
    const [callActive, setCallActive] = useState(false);

  const folderId = searchParams.get("folderId");

    // WebRTC state
    const myVideo = useRef();
    const partnerVideo = useRef();
    const [peer, setPeer] = useState(null);

    useEffect(() => {
        const s = io("http://localhost:8000");
        setSocket(s);

        s.emit("join-document", documentId);

        setTimeout(() => {
            s.emit("check-call", documentId, (isCallActive) => {
                setCallActive(isCallActive);
            });
        }, 200);

        return () => s.disconnect();
    }, [documentId]);
    useEffect(() => {
        if (!socket || !documentId) return;

        // Vérifie si un appel est déjà actif à la connexion
        socket.emit("check-call", documentId, (isCallActive) => {
            setCallActive(isCallActive);
        });

        // Écoute les changements en temps réel
        socket.on("call-started", () => setCallActive(true));
        socket.on("call-ended", () => setCallActive(false));

        return () => {
            socket.off("call-started");
            socket.off("call-ended");
        };
    }, [socket, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document, title) => {
      quill.setContents(document);
      setTitle(title);
      quill.enable();
    });

    socket.emit("get-document", documentId, currentUser.id, folderId);
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

    socket.emit("send-changes", null, title); 
  }, [title]);


    // WebRTC logic
    const safeSignal = (signal) => {
        if (peer && !peer.destroyed) {
            peer.signal(signal);
        } else {
            console.warn("Tentative de signal alors que le peer est null ou détruit.");
        }
    };
    const startCall = () => {
        if (!socket) {
            console.error("Socket non initialisé.");
            return;
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                    myVideo.current.play();
                }

                const newPeer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream,
                });

                newPeer.on("signal", (data) => {
                    socket.emit("webrtc-signal", { documentId, signal: data });
                });

                newPeer.on("stream", (partnerStream) => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = partnerStream;
                        partnerVideo.current.play();
                    }
                });

                newPeer.on("error", (err) => console.error("Peer error:", err));
                newPeer.on("close", () => console.log("Peer fermé"));

                setPeer(newPeer);

                socket.on("webrtc-signal", ({ signal }) => {
                    safeSignal(signal);
                });
                socket.emit("start-call", documentId);
                setInCall(true);
            })
            .catch((err) => {
                console.error("Erreur accès caméra/micro :", err);
            });
    };
    const joinCall = () => {
        if (!socket) {
            console.error("Socket non initialisé.");
            return;
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                    myVideo.current.play();
                }

                const newPeer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream,
                });

                newPeer.on("signal", (data) => {
                    socket.emit("webrtc-signal", { documentId, signal: data });
                });

                newPeer.on("stream", (partnerStream) => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = partnerStream;
                        partnerVideo.current.play();
                    }
                });

                newPeer.on("error", (err) => console.error("Peer error:", err));
                newPeer.on("close", () => console.log("Peer fermé"));

                setPeer(newPeer);

                socket.on("webrtc-signal", ({ signal }) => {
                    safeSignal(signal);
                });
                setInCall(true);
            })
            .catch((err) => {
                console.error("Erreur accès caméra/micro :", err);
            });
    };
    useEffect(() => {
        if (!socket) return;
        const handler = ({ from, signal }) => {
            console.log("Signal reçu de", from);
            safeSignal(signal);
        };
        socket.on("webrtc-signal", handler);

        return () => socket.off("webrtc-signal", handler);
    }, [socket, peer]);
    const handleLeaveCall = () => {
        if (peer) {
            peer.destroy();
            setPeer(null);
        }

        if (myVideo.current?.srcObject) {
            myVideo.current.srcObject.getTracks().forEach(track => track.stop());
            myVideo.current.srcObject = null;
        }

        if (partnerVideo.current?.srcObject) {
            partnerVideo.current.srcObject.getTracks().forEach(track => track.stop());
            partnerVideo.current.srcObject = null;
        }

        // Émettre l'événement pour prévenir les autres que l'appel est terminé
        if (socket && documentId) {
            socket.emit("end-call", documentId);
        }

        setInCall(false);
    };

    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Bouton de partage */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Titre du document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            onClick={() => setShowModal(true)}
            className="ml-4 px-6 py-2 bg-black text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Partager
          </Button>
        </div>
    
        {/* Modale de partage */}
        {showModal && (
          <form
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
            onSubmit={handleShare}
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Partager le document</h2>
              <input
                type="email"
                placeholder="Adresse e-mail"
                name="email"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-gray-300 text-white rounded-lg"
                >
                  Partager
                </button>
              </div>
            </div>
          </form>
        )}
    
        {/* Éditeur */}
        <div className="bg-white rounded-xl shadow-lg p-4" ref={wrapperRef}></div>
    
        {/* Appel vidéo */}
        <div className="mt-8">
          {!inCall ? (
            <div className="flex gap-4">
              <Button onClick={startCall} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700">
                Démarrer un appel
              </Button>
              {callActive && (
                <Button onClick={joinCall} className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-600">
                  Rejoindre l'appel
                </Button>
              )}
            </div>
          ) : (
            <Button
              onClick={handleLeaveCall}
              className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700"
            >
              Quitter l'appel
            </Button>
          )}
    
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <video
              ref={myVideo}
              muted
              autoPlay
              playsInline
              className="w-full rounded-lg border shadow"
            />
            <video
              ref={partnerVideo}
              autoPlay
              playsInline
              className="w-full rounded-lg border shadow"
            />
          </div>
        </div>
      </div>
    );
}
