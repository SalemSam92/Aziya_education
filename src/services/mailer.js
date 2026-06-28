import nodemailer from "nodemailer";

// Configuration du transporteur SMTP pour l'envoi d'e-mails
export const transporter = nodemailer.createTransport({
  host: "smtp.laposte.net", // Serveur SMTP de La Poste
  port: 465, // Port Laposte.net sécurisé pour le protocole SMTP
  secure: true, // Utilisation du protocole sécurisé SSL/TLS
  auth: {
    user: process.env.MAIL_USER, // Adresse e-mail de l'expéditeur (définie dans les variables d'environnement)
    pass: process.env.MAIL_PASS, // Mot de passe de l'expéditeur (définie dans les variables d'environnement)
  },
});


