import express from "express";
import { db } from "../../index.js";

const router = express.Router();

router.get("/admin/users", (req, res) => {
  db.all("SELECT id, email, blocked FROM users where role = 'user'", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.status(200).json(rows);
  });
});

router.put("/admin/users/:id/block", (req, res) => {
  db.run("UPDATE users SET blocked = ? WHERE id = ?", [1, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: "Erreur blocage" });
    res.status(200).json({ message: "Utilisateur bloqué" });
  });
});

router.put("/admin/users/:id/unblock", (req, res) => {
  db.run("UPDATE users SET blocked = ? WHERE id = ?", [0, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: "Erreur déblocage" });
    res.status(200).json({ message: "Utilisateur débloqué" });
  });
});

export default router;
