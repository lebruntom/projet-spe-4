import express from "express";
import bodyParser from "body-parser";
import authRoute from "./modules/auth/authRoute.js";
import sqlite3 from "sqlite3";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import documentRoutes from "./modules/document/documentRoute.js";
import folderRoutes from "./modules/folder/folderRoute.js";
import { Server } from "socket.io";
import setupSocket from "./socket.js";
import http from "http";
import uploadRoute from "./modules/upload/uploadRoute.js";
import userRoute from "./modules/user/userRoute.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Créez une instance de la base de données SQLite
export const db = new sqlite3.Database("user.db");

//Création de la table user si elle n'existe pas + création de l'utilisateur admin
db.serialize(() => {
  db.run(
    " CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, secret TEXT, password TEXT, role TEXT DEFAULT 'user', blocked BOOLEAN DEFAULT false, qrCode INTEGER DEFAULT 0)"
  );
  db.get(
    `SELECT * FROM users WHERE email = ?`,
    ["admin@admin.com"],
    (err, row) => {
      if (err) {
        console.error("Erreur lors de la vérification de l'admin :", err);
      } else if (!row) {
        db.run(
          `INSERT INTO users (email, secret, password, role) VALUES (?, ?, ?, ?)`,
          [
            "admin@admin.com",
            "JFZFQGTYBYUVUWBS",
            "$2b$10$C9F7myjhy1lzwJna4CM5h.PQktuw86bCA.oSWbsZYWRSgU8347ipq", // Mot de passe hashé
            "admin",
          ],
          (err) => {
            if (err) {
              console.error("Erreur lors de la création de l'admin :", err);
            } else {
              console.log("Utilisateur admin créé");
            }
          }
        );
      } else {
        console.log("L'utilisateur admin existe déjà");
      }
    }
  );
  
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES folders(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)
})


db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        title TEXT,
        folder_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id_last_update INTEGER,
        FOREIGN KEY (folder_id) REFERENCES folders(id),
        FOREIGN KEY (user_id_last_update) REFERENCES users(id)

      )
    `);
});

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS user_documents (
        user_id INTEGER,
        document_id TEXT,
        PRIMARY KEY (user_id, document_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (document_id) REFERENCES documents(id)
      )
    `);
});

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS file (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        folder_id INTEGER,
        path TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        FOREIGN KEY (folder_id) REFERENCES folders(id)
      )
    `);
});

app.use(
  session({
    secret: "azertyuiop",
    resave: true,
    saveUninitialized: true,
  })
);


//Appel des routes
app.use(authRoute);
app.use(documentRoutes);
app.use(folderRoutes);
app.use(uploadRoute);
app.use(userRoute);
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
setupSocket(io);
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
