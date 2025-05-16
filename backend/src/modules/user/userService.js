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


