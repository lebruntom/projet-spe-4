import express from "express";
import {getDocumentController, addUserToDocumentController, getUsersForDocumentController, getDocumentsForUserController} from "./documentController.js";
const documentRoutes = express.Router();
documentRoutes.get('/documents/:id', getDocumentController);
documentRoutes.get('/documents/:id/users', getUsersForDocumentController);
documentRoutes.get('/documents/:id/users/:userId', getDocumentsForUserController);
documentRoutes.post('/documents/:id/users/:userId', addUserToDocumentController);


export default documentRoutes;
