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
