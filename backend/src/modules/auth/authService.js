// userService.js
import bcrypt from "bcrypt";
import { db } from "../../index.js";
import { authenticator } from "otplib";

//Regarde si l'email en parametre existe en bdd
export async function checkUserExists(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || false); // Renvoie la row si trouvée, sinon false
      }
    });
  });
}

//Insert un user en bdd s'il n'existe pas
export async function registerUser(email, password) {
  const userExists = await checkUserExists(email);
  if (userExists) {
    throw new Error("Cet e-mail est déjà enregistré.");
  }
  const secret = authenticator.generateSecret();
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, secret, password) VALUES (?, ?, ?)",
      [email, secret, hashedPassword],
      function (err) {
        if (err) {
          reject(new Error("Error registering user" + err));
        } else {
          resolve("User registered successfully");
        }
      }
    );
  });
}

//Verifie le user et password d'un user en parametre
export async function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        reject({ success: false, error: "Error authenticating user" });
        return;
      }

      if (!row) {
        resolve({ success: false, error: "Invalid email or password" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, row.password);

      if (isPasswordValid) {
        resolve({ success: true, id: row.id });
        return;
      } else {
        resolve({ success: false, error: "Invalid email or password" });
        return;
      }
    });
  });
}

//Insert un user s'il n'existe pas en bdd sans password
export async function registerUserWithoutPassword(email) {
  const userExists = await checkUserExists(email);
  if (userExists) {
    throw new Error("Cet e-mail est déjà enregistré.");
  }
  const secret = authenticator.generateSecret();
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, secret) VALUES (?, ?)",
      [email, secret],
      function (err) {
        if (err) {
          reject(new Error("Error registering user" + err));
        } else {
          resolve("User registered successfully");
        }
      }
    );
  });
}

//Get clef secret pour la double authentification
export function getSecretDoubleAuth(email) {
  return new Promise((resolve, reject) => {
    db.all("SELECT secret FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error("Error: " + err));
      } else {
        const firstResult = rows.length > 0 ? rows[0].secret : null;
        resolve(firstResult);
      }
    });
  });
}

//Update l'affichage du grcode
export function updateQrCodeStatus(email, newStatus) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET qrCode = ? WHERE email = ?",
      [newStatus, email],
      (err) => {
        if (err) {
          console.error(err.message);
          reject(new Error("Error: " + err));
        } else {
          resolve("QrCode entry updated successfully");
        }
      }
    );
  });
}

//GET le grcode status
export function qrCodeStatus(email) {
  return new Promise((resolve, reject) => {
    db.all("SELECT qrCode FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(new Error("Error: " + err));
      } else {
        const firstResult = rows.length > 0 ? rows[0].qrCode : null;
        resolve(firstResult);
      }
    });
  });
}
