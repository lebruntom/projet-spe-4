import {
    getOrCreateDocument,
    updateDocument,
} from "./modules/document/documentService.js";

const documentUsers = {}; 
const activeCalls = {};

function setupSocket(io) {
    io.on("connection", (socket) => {

        socket.on("join-document", (documentId) => {
            socket.join(documentId);

            if (!documentUsers[documentId]) documentUsers[documentId] = [];
            documentUsers[documentId].push(socket.id);

            socket.to(documentId).emit("user-joined", {socketId: socket.id});

            socket.on("disconnect", () => {
                documentUsers[documentId] = documentUsers[documentId]?.filter(
                    (id) => id !== socket.id
                );
                console.log(`Déconnecté de ${documentId}`, documentUsers[documentId]);
                socket.to(documentId).emit("user-left", {socketId: socket.id});
            });
        });

        // WebRTC Signaling
        socket.on("webrtc-signal", ({documentId, signal}) => {
            if (!documentUsers[documentId]) return;

            // Envoyer à tous les autres sauf l'émetteur
            documentUsers[documentId].forEach((otherSocketId) => {
                if (otherSocketId !== socket.id) {
                    io.to(otherSocketId).emit("webrtc-signal", {
                        from: socket.id,
                        signal,
                    });
                }
            });
        });

        // Quand quelqu’un démarre un appel
        socket.on("start-call", (documentId) => {
            activeCalls[documentId] = true;
            socket.to(documentId).emit("call-started"); 
        });

// Quand quelqu’un quitte un appel
        socket.on("end-call", (documentId) => {
            activeCalls[documentId] = false;
            socket.to(documentId).emit("call-ended"); 
        });

// Permet au client de vérifier s'il y a un appel actif
        socket.on("check-call", (documentId, callback) => {
            callback(activeCalls[documentId] || false);
        });

        socket.on("get-document", async (documentId, userId, folderId) => {
            const document = await getOrCreateDocument(documentId, userId, folderId);
            socket.join(documentId);
            socket.join(userId);

            socket.emit("load-document", document.data, document.title);

            socket.on("send-changes", (delta, title) => {
                socket.broadcast.to(documentId).emit("receive-changes", delta, title);
            });

            socket.on("save-document", async (data, title, userId) => {
                await updateDocument(documentId, data, title, userId);
            });
        });
    });
}

export default setupSocket;
