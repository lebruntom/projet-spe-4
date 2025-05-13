import { getOrCreateDocument, updateDocument } from './modules/document/documentService.js';

function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('get-document', async (documentId) => {
      const document = await getOrCreateDocument(documentId);
      socket.join(documentId);
      socket.emit('load-document', document.data);

      socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save-document', async data => {
        await updateDocument(documentId, data);
      });
    });
  });
}

export default setupSocket;