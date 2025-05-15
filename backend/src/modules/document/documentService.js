import { db } from "../../index.js";

export function getOrCreateDocument(id, userId, folderId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      if (row) {
        return resolve({
          id: row.id,
          data: JSON.parse(row.data),
          title: row.title,
        });
      } else {
        db.run(
          "INSERT INTO documents (id, data, user_id_last_update, folder_id) VALUES (?, ?, ?, ?)",
          [id, JSON.stringify({}), userId, folderId],
          (err) => {
            if (err) return reject(err);
            return resolve({ id, data: {}, title: "" });
          }
        );
        addUserToDocument(userId, id);
      }
    });
  });
}

export function updateDocument(id, data, title, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE documents SET data = ?, title= ?, user_id_last_update = ? WHERE id = ?",
      [JSON.stringify(data), title, userId, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function addUserToDocument(userId, documentId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT OR IGNORE INTO user_documents (user_id, document_id) VALUES (?, ?)",
      [userId, documentId],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function getUsersForDocument(documentId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT users.* FROM users
      inner join user on user.id = documents.user_id_last_update
       INNER JOIN user_documents ON users.id = user_documents.user_id
       WHERE user_documents.document_id = ?`,
      [documentId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

export function getDocumentsForUser(userId, folderId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT documents.*, users.email FROM documents
      INNER JOIN users on users.id = documents.user_id_last_update
       INNER JOIN user_documents ON documents.id = user_documents.document_id
       WHERE user_documents.user_id = ? 
       AND documents.folder_id = ?`,
      [userId, folderId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

export function deleteDocument(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM documents WHERE id = ?", [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
