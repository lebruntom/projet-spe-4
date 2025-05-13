import {getOrCreateDocument} from "./documentService.js";

export async function getDocumentController (req, res) {
  try {
    const { id } = req.params;
    const doc = await getOrCreateDocument(id);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

