import express from "express";
import {getDocumentController} from "./documentController.js";
const documentRoutes = express.Router();
documentRoutes.get('/documents/:id', getDocumentController);

export default documentRoutes;
