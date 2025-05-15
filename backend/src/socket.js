const documentUsers = {}; // { documentId: [socket.id, ...] }

function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log("Nouvelle connexion socket:", socket.id);

        socket.on("join-document", (documentId) => {
            socket.join(documentId);

            if (!documentUsers[documentId]) documentUsers[documentId] = [];
            documentUsers[documentId].push(socket.id);

            console.log(`Users dans document ${documentId}:`, documentUsers[documentId]);

            // Option : notifier les autres qu'un nouveau user est là
            socket.to(documentId).emit("user-joined", { socketId: socket.id });

            socket.on("disconnect", () => {
                documentUsers[documentId] = documentUsers[documentId]?.filter((id) => id !== socket.id);
                console.log(`Déconnecté de ${documentId}`, documentUsers[documentId]);
                socket.to(documentId).emit("user-left", { socketId: socket.id });
            });
        });

        // WebRTC Signaling
        socket.on("webrtc-signal", ({ documentId, signal }) => {
            if (!documentUsers[documentId]) return;

            // Envoyer à tous les autres sauf l'émetteur
            documentUsers[documentId].forEach((otherSocketId) => {
                if (otherSocketId !== socket.id) {
                    io.to(otherSocketId).emit("webrtc-signal", { from: socket.id, signal });
                }
            });
        });
    });
}

export default setupSocket;
