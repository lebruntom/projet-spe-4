import express from "express";
import {
  getDocumentController,
  getUsersForDocumentController,
  getDocumentsForUserController,
  shareDocumentController,
} from "./documentController.js";
const documentRoutes = express.Router();
documentRoutes.get("/documents/:id", getDocumentController);
documentRoutes.get("/documents/:id/users", getUsersForDocumentController);
documentRoutes.get("/documents/user/:userId", getDocumentsForUserController);
documentRoutes.post("/document/:id/share", shareDocumentController);

export default documentRoutes;
