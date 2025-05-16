// Met à jour le mot de passe d'un utilisateur
import { db } from "../../index.js";
export function updateUserPassword(email, newHashedPassword) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET password = ? WHERE email = ?",
      [newHashedPassword, email],
      function (err) {
        if (err) {
          console.error(err.message);
          reject(new Error("Erreur lors de la mise à jour du mot de passe"));
        } else {
          resolve("Mot de passe mis à jour avec succès");
        }
      }
    );
  });
}

export function blockUser(email) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET blocked = ? WHERE email = ?",
      [true, email],
      function (err) {
        if (err) {
          console.error(err.message);
          reject(new Error("Erreur lors du blocage de l'utilisateur"));
        } else {
          resolve("Utilisateur bloqué avec succès");
        }
      }
    );
  });
}

export function unblockUser(email) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET blocked = ? WHERE email = ?",
      [false, email],
      function (err) {
        if (err) {
          console.error(err.message);
          reject(new Error("Erreur lors du déblocage de l'utilisateur"));
        } else {
          resolve("Utilisateur débloqué avec succès");
        }
      }
    );
  });
}

export function getUsers () {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users WHERE role = user", (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error("Erreur lors de la récupération des utilisateurs"));
      } else {
        resolve(rows);
      }
    });
  });
}

