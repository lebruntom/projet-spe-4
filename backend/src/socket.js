import {
  getOrCreateDocument,
  updateDocument,
} from "./modules/document/documentService.js";

function setupSocket(io) {
  io.on("connection", (socket) => {
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
