import express from "express";
import {
  getDocumentController,
  getUsersForDocumentController,
  getDocumentsForUserController,
  shareDocumentController,
  deleteDocumentController,
} from "./documentController.js";
const documentRoutes = express.Router();
documentRoutes.get("/documents/:id", getDocumentController);
documentRoutes.get("/documents/:id/users", getUsersForDocumentController);
documentRoutes.get(
  "/documents/user/:userId/folder/:folderId",
  getDocumentsForUserController
);
documentRoutes.post("/document/:id/share", shareDocumentController);
documentRoutes.delete("/document/:id", deleteDocumentController);
export default documentRoutes;
