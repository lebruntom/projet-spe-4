import {getOrCreateDocument, addUserToDocument, getUsersForDocument, getDocumentsForUser} from "./documentService.js";

export async function getDocumentController (req, res) {
  try {
    const { id } = req.params;
    const doc = await getOrCreateDocument(id);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getDocumentsForUserController (req, res) {
  try {
    const { userId } = req.params;
    const docs = await getDocumentsForUser(userId);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getUsersForDocumentController (req, res) {
  try {
    const { documentId } = req.params;
    const users = await getUsersForDocument(documentId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function addUserToDocumentController (req, res) {
  try {
    const { userId, documentId } = req.params;
    await addUserToDocument(userId, documentId);
    res.status(200).json({ message: 'User added to document' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



