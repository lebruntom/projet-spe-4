// modules/upload/uploadRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../../index.js"; // <-- Assure-toi que le chemin est correct
import { randomUUID as uuidv4 } from "crypto";

const router = express.Router();

// Créer le dossier uploads si nécessaire
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// Route POST pour l'upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.body.userId; // Doit être envoyé par le client
  const folderId = req.body.folderId; // Doit être envoyé par le client
  const fileId = uuidv4();
  const filePath = `/uploads/${req.file.filename}`;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  // Insertion dans la table file
  db.run(
    `INSERT INTO file (id, user_id, path, folder_id) VALUES (?, ?, ?, ?)`,
    [fileId, userId, filePath, folderId],
    (err) => {
      if (err) {
        console.error("Erreur lors de l'insertion en base de données :", err);
        return res.status(500).json({ message: "Database insert error" });
      }

      return res.status(200).json({
        message: "File uploaded and saved successfully",
        fileId,
        filePath,
      });
    }
  );
});

function getFilesByUser(userId, folderId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM file WHERE user_id = ? AND folder_id = ?`,
      [userId, folderId],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

// Route pour récuperer les fichiers d'un user
router.get("/files/:userId/folder/:folderId", async (req, res) => {
  const userId = req.params.userId;
  const folderId = req.params.folderId;


  try {
    const files = await getFilesByUser(userId, folderId);
    res.status(200).json(files);
  } catch (err) {
    console.error("Erreur récupération des fichiers", err);
    res.status(500).json({ message: "Erreur récupération des fichiers" });
  }
});

export default router;
