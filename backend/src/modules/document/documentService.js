import {db} from "../../index.js";

export function getOrCreateDocument (id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM documents WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      if (row) {
        return resolve({ id: row.id, data: JSON.parse(row.data) });
      } else {
        db.run('INSERT INTO documents (id, data) VALUES (?, ?)', [id, JSON.stringify({})], (err) => {
          if (err) return reject(err);
          return resolve({ id, data: {} });
        });
      }
    });
  });
};

export function updateDocument (id, data) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE documents SET data = ? WHERE id = ?', [JSON.stringify(data), id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export function addUserToDocument(userId, documentId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO user_documents (user_id, document_id) VALUES (?, ?)',
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

export function getDocumentsForUser(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT documents.* FROM documents
       INNER JOIN user_documents ON documents.id = user_documents.document_id
       WHERE user_documents.user_id = ?`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

