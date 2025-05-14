import { checkUserExists } from "../auth/authService.js";
import {
  getOrCreateDocument,
  addUserToDocument,
  getUsersForDocument,
  getDocumentsForUser,
} from "./documentService.js";

export async function getDocumentController(req, res) {
  try {
    const { id, userId } = req.params;
    const doc = await getOrCreateDocument(id);

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDocumentsForUserController(req, res) {
  try {
    const { userId } = req.params;
    const docs = await getDocumentsForUser(userId);

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
