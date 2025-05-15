import { checkUserExists } from "../auth/authService.js";
import {
  getOrCreateDocument,
  addUserToDocument,
  getUsersForDocument,
  getDocumentsForUser,
  deleteDocument,
} from "./documentService.js";

export async function getDocumentController(req, res) {
  try {
    const { id, userId, folderId } = req.params;
    const doc = await getOrCreateDocument(id, userId, folderId);

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDocumentsForUserController(req, res) {
  try {
    const { userId, folderId } = req.params;
    const docs = await getDocumentsForUser(userId, folderId);

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsersForDocumentController(req, res) {
  try {
    const { documentId } = req.params;
    const users = await getUsersForDocument(documentId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function shareDocumentController(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const userExists = await checkUserExists(email);
    if (!userExists) {
      return res.status(500).json({ error: "L'utilisateur n'existe pas" });
    }

    await addUserToDocument(userExists.id, id);

    res.status(200).json({ message: "Document shared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteDocumentController(req, res) {
  try {
    const { id } = req.params;
    await deleteDocument(id);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
