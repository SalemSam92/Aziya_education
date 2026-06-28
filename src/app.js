import express from "express" // Importation du framework Express pour créer l'application web
import "dotenv/config" // Importation de la configuration des variables d'environnement depuis le fichier .env
import session from "express-session" // Importation du middleware express-session pour gérer les sessions utilisateur
import { userRouter } from "./routes/userRouter.js"
import { studentRouter } from "./routes/studentRouter.js"
import { classroomRouter } from "./routes/classroom.Router.js"
import { imputationRouter } from "./routes/imputationRouter.js"





const app = express() // Création de l'application Express
app.use(express.static("./public")) // Définir le dossier public comme dossier statique pour servir les fichiers CSS, JS, images, etc.
app.use(express.urlencoded({extended:true})) // Middleware pour parser les données du formulaire en JSON
app.use(session({
    secret : process.env.SECRET,
    resave : true,
    saveUninitialized : true
})) // Middleware pour gérer les sessions utilisateur

app.use(userRouter) // Utilisation du routeur pour les routes liées aux utilisateurs
app.use(classroomRouter) // Utilisation du routeur pour les routes liées aux classes
app.use(studentRouter) // Utilisation du routeur pour les routes liées aux élèves
app.use(imputationRouter) // Utilisation du routeur pour les routes liées aux imputations

app.listen(process.env.PORT,(error)=>{
    error ? console.log(error) : console.log("serveur start");
}) // Démarrage du serveur sur le port défini dans les variables d'environnement et affichage d'un message en cas de succès ou d'erreur                                                     