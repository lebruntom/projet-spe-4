import { createFolder, getFoldersByParent, getDocumentsInFolder, deleteFolder } from "./folderService.js";

export async function createFolderController(req, res){
  try{
    const { name, parentId, userId } = req.body
    const folder = await createFolder(name, parentId, userId)
    res.status(201).json(folder)
  } catch (err){
    res.status(500).json({ error: err.message }) 
  }
}

export async function getFoldersByParentController(req, res){
  try{
    const { parentId, userId } = req.params
    const folders = await getFoldersByParent(parentId === "null" ? null : parentId, userId)
    res.json(folders)
  } catch (err){
    res.status(500).json({ error: err.message })
    
  }
}

export async function getDocumentsInFolderController(req, res){
  try{
    const { folderId, userId } = req.params
    const docs = await getDocumentsInFolder(folderId === "null" ? null : folderId, userId)
    res.json(docs)
  } catch (err){
    res.status(500).json({ error: err.message })
  }
}

export async function deleteFolderController(req, res){
  try{
    const { folderId, userId } = req.params
    const folder = await deleteFolder(folderId, userId)
    res.status(200).json(folder)
  } catch (err){
    res.status(500).json({ error: err.message })
  }
}