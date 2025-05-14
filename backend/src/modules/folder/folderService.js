import { db } from "../../index.js"

// Créer un dossier
export function createFolder(name, parentId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO folders (name, parent_id, user_id) VALUES (?, ?, ?)",
      [name, parentId || null, userId],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, parentId, userId });
      }
    );
  });
}

// Récupérer les dossiers enfants
export function getFoldersByParent(parentId, userId){
  return new Promise((resolve, reject)=>{
    db.all("SELECT * FROM folders WHERE parent_id IS ? AND user_id = ?", [parentId, userId], (err, rows)=>{
      if(err) return reject(err)
      resolve(rows)
    })
  })
}

// Récupérer les documents d’un dossier 
export function getDocumentsInFolder(folderId, userId){
  return new Promise((resolve, reject)=>{
    db.all(`SELECT documents.*, users.email FROM documents
       INNER JOIN users ON users.id = documents.user_id_last_update
       INNER JOIN user_documents ON documents.id = user_documents.document_id 
       WHERE documents.folder_id IS ? AND user_documents.user_id = ?`, [folderId, userId], (err, rows)=>{
      if(err) return reject(err)
      resolve(rows)
    })
  })
}

// supprimer un dossier
export function deleteFolder(folderId, userId){
  return new Promise((resolve, reject)=>{
    db.run("DELETE FROM folders WHERE id = ?", [folderId], (err)=>{
      if(err) return reject(err)
      resolve()
    })
  })
}