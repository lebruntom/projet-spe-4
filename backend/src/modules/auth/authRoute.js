import express from "express";
import {
    createDoubleAuthentification,
    loginUserController,
    registerUserController,
    userIsLoggedController,
    verifyDoubleAuthentification,
    logoutController,
    qrCodeStatusController,
    changePasswordController
} from "./authController.js";


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
//Change le mot de passe
authRoute.post("/change-password", changePasswordController);


//Exportation des routes
export default authRoute;
