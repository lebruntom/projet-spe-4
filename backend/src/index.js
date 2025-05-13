import express from "express";
import bodyParser from "body-parser";
import authRoute from "./modules/auth/authRoute.js";
import sqlite3 from "sqlite3";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import cookieParser from "cookie-parser";
import documentRoutes from "./modules/document/documentRoute.js";
import { Server } from "socket.io";
import setupSocket from "./socket.js";
import http from "http";

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

//Création de la table user si elle n'existe pas
db.serialize(() => {
  db.run(
    " CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, secret TEXT, password TEXT, qrCode INTEGER DEFAULT 0)"
  );
});

//Création de la table blog si elle n'existe pas
db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Initialisation strategie google
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID:
        "842898098260-j0jfpvm2el3694u3kag9b1jo5l69t3ov.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["openid", "email", "profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Utilisateur authentifié
      return done(null, profile);
    }
  )
);
//Initialisation strategie github
passport.use(
  new GitHubStrategy(
    {
      clientID: "7b0145a02b5fdd320695",
      clientSecret: "bac34c0d4204e2f8a126b4515064421b5ae02935",
      callbackURL: "http://localhost:8000/auth/github/callback",
      scope: ["user:email"], // Ajoutez cette ligne pour demander l'accès à l'adresse e-mail de l'utilisateur
    },
    function (accessToken, refreshToken, profile, done) {
      // Utilisateur authentifié
      return done(null, profile);
    }
  )
);

// Serialize user information to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

//Appel des routes auth
app.use(authRoute);
app.use(documentRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
setupSocket(io);
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
