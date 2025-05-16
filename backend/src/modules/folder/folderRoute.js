import express from 'express';
import { createFolderController, getFoldersByParentController, getDocumentsInFolderController, deleteFolderController } from './folderController.js';
import { db } from "../../index.js";

const folderRoutes = express.Router()
folderRoutes.post('/folders', createFolderController)
folderRoutes.get('/folders/:parentId/user/:userId', getFoldersByParentController)
folderRoutes.get('/folders/:folderId/documents/:userId', getDocumentsInFolderController)
folderRoutes.delete('/folders/:folderId/user/:userId', deleteFolderController)
folderRoutes.get("/folders/breadcrumb/:folderId", (req, res) => {
  const { folderId } = req.params;
  const path = [];

  const findParent = (id) => {
    db.get("SELECT * FROM folders WHERE id = ?", [id], (err, folder) => {
      if (err) return res.status(500).send("Erreur serveur");

      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        if (folder.parent_id) {
          findParent(folder.parent_id);
        } else {
          res.json(path);
        }
      } else {
        res.json(path);
      }
    });
  };

  if (folderId && folderId !== "null") {
    findParent(folderId);
  } else {
    res.json([]);
  }
});
export default folderRoutes