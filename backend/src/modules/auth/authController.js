import {
  changeUserPassword,
  checkUserExists,
  getSecretDoubleAuth,
  loginUser,
  qrCodeStatus,
  registerUser,
  registerUserWithoutPassword,
  updateQrCodeStatus,
} from "./authService.js";
import { authenticator } from "otplib";
import qrcode from "qrcode";
import passport from "passport";
import jwt from "jsonwebtoken";

//const authenticatorSecret = "unsecretvraimenttressecret";
const secretKey = "fds4gfqdsJ5KDLjlf7Jdion8oifd9iOfnJoin$$$28fdsfdKofkDpfkdj";

//Liste noire de token
let revokedEmails = [];

//Controller d'inscription
export async function registerUserController(req, res) {
  try {
    //On recupere les infos
    const { email, password } = req.body;

    //On créé le user
    const message = await registerUser(email, password);

    const userExists = await checkUserExists(email);

    //On supprime l'email de la liste noire
    revokedEmails = revokedEmails.filter((element) => element !== email);

    //On créé le token
    var token = jwt.sign(
      {
        loggedIn: true,
        email: email,
        id: userExists.id,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { sameSite: "Lax" });
    res.status(201).json({ message, email: email, id: userExists.id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Controller de connexion
export async function loginUserController(req, res) {
  try {
    //On recupere les infos
    const { email, password } = req.body;
    //On verifie les infos
    const result = await loginUser(email, password);
    const id = result.id;
    //Si ca reusssi on créé le token
    if (result.success) {
      //On supprime l'email de la liste noire
      revokedEmails = revokedEmails.filter((element) => element !== email);

      const token = jwt.sign(
        {
          loggedIn: true,
          id: id,
          email: email,
        },
        secretKey,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, { sameSite: "Lax" });

      res
        .status(200)
        .json({ message: "Authentication successful", email: email, id: id });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Controller generation qrcode double auth
export async function createDoubleAuthentification(req, res) {
  const { email } = req.body;
  const nameService = "Projet Dev-Drive";
  const authenticatorSecret = await getSecretDoubleAuth(email);

  const otPauth = authenticator.keyuri(email, nameService, authenticatorSecret);

  // Génère un qrcode à partir de cette clef
  const imageUrl = qrcode.toDataURL(otPauth, (err, imageUrl) => {
    if (err) {
      res.status(500).json({ message: "Erreur dans la génération du code" });
      return;
    } else {
      res.status(200).json({ imageUrl });
    }
  });

  return imageUrl;
}

//Controller on verifie la double auth
export async function verifyDoubleAuthentification(req, res) {
  const { token, email } = req.body;

  try {
    //S'il n'y a pas de token
    if (!token) {
      res.status(401).json({ error: "Please supply a token" });
    }
    const authenticatorSecret = await getSecretDoubleAuth(email);

    //On check si le token est valide
    const isValid = authenticator.check(token, authenticatorSecret);

    if (isValid) {
      // Si le token est valide
      await updateQrCodeStatus(email, 1);
      res.status(200).json({ message: "Le token est valide", res: true });
    } else {
      // Si le token n'est pas valide, c'est non
      res
        .status(403)
        .json({ message: "Le code fourni n'est pas bon", res: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Controller auth google
export function authGoogleCallbackController(req, res, next) {
  passport.authenticate(
    "google",
    { failureRedirect: "http://localhost:3000/login" },
    async (err, user) => {
      if (err) {
        return res.redirect("/"); // Redirect to an error page
      }

      try {
        const email = user._json.email;
        //Check si le user existe en bdd
        const userExists = await checkUserExists(email);
        //S'il n'existe pas on le créé
        if (!userExists) {
          await registerUserWithoutPassword(email);
        }

        //On supprime l'email de la liste noire
        revokedEmails = revokedEmails.filter((element) => element !== email);

        //Création du token
        const token = jwt.sign(
          {
            loggedIn: true,
            email: email,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { sameSite: "Lax" });
        // Successful authentication
        res.redirect("http://localhost:3000"); // Redirect to the desired page
      } catch (error) {
        res.redirect("/error"); // Redirect to an error page
      }
    }
  )(req, res, next);
}

//Controller auth github
export function authGithubCallbackController(req, res) {
  passport.authenticate(
    "github",
    { failureRedirect: "http://localhost:3000/login" },
    async (err, user) => {
      if (err) {
        return res.redirect("/"); // Redirect to an error page
      }

      try {
        const email = user.emails[0].value;
        //Check si le user existe en bdd
        const userExists = await checkUserExists(email);
        //S'il n'existe pas on le créé
        if (!userExists) {
          await registerUserWithoutPassword(email);
        }

        //On supprime l'email de la liste noire
        revokedEmails = revokedEmails.filter((element) => element !== email);

        //Création du token
        const token = jwt.sign(
          {
            loggedIn: true,
            email: email,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { sameSite: "Lax" });

        // Successful authentication
        res.redirect("http://localhost:3000"); // Redirect to the desired page
      } catch (error) {
        res.redirect("/error"); // Redirect to an error page
      }
    }
  )(req, res);
}

//Controller check si le user est connecté
export function userIsLoggedController(req, res) {
  // On récupère le token dans les cookies
  const token = req.cookies.token;

  try {
    // On vérifie si le token est dans la liste noire
    const decoded = jwt.decode(token, secretKey);

    if (revokedEmails.includes(decoded.email)) {
      res.status(200).json({ message: "Le token a été révoqué", token: null });
    } else {
      // On vérifie le token
      var isValid = jwt.verify(token, secretKey);

      // S'il est valide, on l'envoie au front, sinon on envoie null
      if (isValid) {
        res.status(200).json({ message: "Le token est valide", token: token });
      } else {
        res
          .status(200)
          .json({ message: "Le token n'est pas valide", token: null });
      }
    }
  } catch (error) {
    res.status(200).json({ message: "Le token est vide", token: null });
  }
}

//Controller deconnexion d'un user
export function logoutController(req, res) {
  // On récupère le token dans les cookies
  const token = req.cookies.token;

  // On ajoute l'email à la liste noire
  const decoded = jwt.decode(token, secretKey);
  revokedEmails.push(decoded.email);

  // On supprime le token des cookies
  res.clearCookie("token");
  res.clearCookie("doubleAuth");
  res.redirect("http://localhost:3000/login");
}

export async function qrCodeStatusController(req, res) {
  const token = req.cookies.token;

  try {
    //On verifie le token
    const decoded = jwt.verify(token, secretKey);
    if (decoded) {
      const email = decoded.email;

      const result = await qrCodeStatus(email);
      res.status(200).json({ status: result });
    } else {
      res
        .status(403)
        .json({ message: "L'utilisateur n'est pas connecté", token: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function changePasswordController(req, res) {
  try {
    // On récupère le token dans les cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }
    

    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const message = await changeUserPassword(
      email,
      currentPassword,
      newPassword
    );
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message || "Erreur inconnue" });
  }
}
