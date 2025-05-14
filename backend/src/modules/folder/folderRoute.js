import express from 'express';
import { createFolderController, getFoldersByParentController, getDocumentsInFolderController, deleteFolderController } from './folderController.js';

const folderRoutes = express.Router()
folderRoutes.post('/folders', createFolderController)
folderRoutes.get('/folders/:parentId/user/:userId', getFoldersByParentController)
folderRoutes.get('/folders/:folderId/documents/:userId', getDocumentsInFolderController)
folderRoutes.delete('/folders/:folderId/user/:userId', deleteFolderController)

export default folderRoutes