import express from "express";
import {
    authGithubCallbackController,
    authGoogleCallbackController,
    createDoubleAuthentification,
    loginUserController,
    registerUserController,
    userIsLoggedController,
    verifyDoubleAuthentification,
    logoutController,
    qrCodeStatusController,
} from "./authController.js";
import passport from "passport";

//On initialise
const authRoute = express.Router();

//Inscription
authRoute.post("/register", registerUserController);
//Connexion
authRoute.post("/login", loginUserController);
//Generation d'un qrcode double auth
authRoute.post("/createDoubleAuth", createDoubleAuthentification);
//Vérification de la double auth
authRoute.post("/verifyDoubleAuth", verifyDoubleAuthentification);
//Verifie si le user est connecté
authRoute.get("/userIsLogged", userIsLoggedController);
//Recupere l'info si on doit afficher le qrcode coté front
authRoute.get("/qrCodeStatus", qrCodeStatusController);
//Deconnexion
authRoute.get("/logout", logoutController);

// auth avec google
authRoute.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["https://www.googleapis.com/auth/plus.login", "email", "profile"],
    })
);
authRoute.get("/auth/google/callback", authGoogleCallbackController);

//Auth avec github
authRoute.get("/auth/github", passport.authenticate("github", {}));
authRoute.get("/auth/github/callback", authGithubCallbackController);

//Exportation des routes
export default authRoute;
