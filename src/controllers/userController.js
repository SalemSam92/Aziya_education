import bcrypt from "bcrypt";
import {
  firstnameRegex,
  lastnameRegex,
  mailRegex,
  passwordRegex,
  schoolNameRegex,
  siretRegex,
} from "../services/regexDirector.js";
import {
  ChangePassword,
  ChangePasswordById,
  createProfessor,
  deleteProfessor,
  getSchoolBySiret,
  getUpdateProfessor,
  login,
  nbProfessor,
  postUpdateProfessor,
  registerDirector,
  selectProfessor,
} from "../../prisma/repository/userRepository.js";
import {
  classroom,
  classroomWithProfessor,
  deleteAffectationProf,
  nbClassroom,
  nbStudentMaxByClassroom,
  selectClassroom,
  studentsByProfessor,
} from "../../prisma/repository/classroomRepository.js";
import {
  nbStudent,
  nbStudentClassroom,
  selectStudent,
  selectStudentByClassroom,
  selectStudentById,
  studentAddClassroom,
} from "../../prisma/repository/studentRepository.js";
import {
  imputationByStudent,
  listImputationsByStudent,
} from "../../prisma/repository/imputationRepository.js";
import { transporter } from "../services/mailer.js";
import { generateToken, verifieToken } from "../services/jwt.js";

export async function getLandingPage(req, res) {
  try {
    res.render("pages/landingPage.twig", {
      title: "AziyaEducation",
    });
  } catch (error) {
    console.log(error);
  }
}
export async function getContact(req, res) {
  try {
    const contactSuccess = req.session.contactSuccess;
    const contactError = req.session.contactError;
    req.session.contactSuccess = null;
    req.session.contactError = null;

    res.render("pages/contact.twig", {
      title: "Contact",
      contactSuccess,
      contactError,
    });
  } catch (error) {
    console.log(error);
  }
}

// Traitement du formulaire de contact — envoi d'un e-mail vers l'adresse de destination définie
export async function postContact(req, res) {
  const { lastname, mail, subject, message } = req.body;

  if (!lastname || !mail || !message) {
    req.session.contactError = "Veuillez remplir tous les champs requis.";
    return res.redirect("/contact");
  }
  if( !mailRegex.test(mail)) {
    req.session.contactError = "Veuillez saisir une adresse e-mail valide.";
    return res.redirect("/contact");
  }
  if (!lastnameRegex.test(lastname)) { 
    req.session.contactError = "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/contact");
  }
  if (subject && subject.length > 100) {// Vérification de la longueur du sujet si fourni, si le subject est vide, on ne fait pas de vérification
    req.session.contactError = "Le sujet ne doit pas dépasser 100 caractères.";
    return res.redirect("/contact");
  }
if (message.length > 1000) {  
  req.session.contactError = "Le message ne doit pas dépasser 1000 caractères.";
  return res.redirect("/contact");
}

  try {
    // const dest = process.env.MAIL_USER;
    await transporter.sendMail({
      from: process.env.MAIL_USER ,
      to: process.env.MAIL_USER,
      subject: subject || `Nouveau message de contact de ${lastname}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:25px; text-align:left; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <!-- Logo textuel -->
    <div style="font-size:32px; font-weight:bold; text-align:center; margin-bottom:25px;">
      <span style="color:#35895f;">Aziya</span><span style="color:#000000;">Education</span>
    </div>

    <!-- Titre -->
    <h2 style="color:#2c3e50; margin-bottom:20px; text-align:center;">
          Nouveau message de contact 
    </h2>

    <!-- Contenu -->
    <p style="font-size:16px; color:#333; line-height:1.6;">
      <strong>Nom :</strong> ${lastname}
    </p>

    <p style="font-size:16px; color:#333; line-height:1.6;">
      <strong>Email :</strong> ${mail}
    </p>

    <p style="font-size:16px; color:#333; line-height:1.6; margin-top:25px;">
      <strong>Message :</strong>
    </p>

    <div style="font-size:16px; color:#333; line-height:1.6; background:#f8f8f8; padding:15px; border-radius:6px; border:1px solid #eee;">
      ${message.replace(/\n/g, "<br/>")}
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

    <p style="font-size:12px; color:#999; text-align:center;">
      Ceci est un message automatique, merci de ne pas y répondre.
    </p>

  </div>
</div>`
});

    req.session.contactSuccess = "Votre message a bien été envoyé.";
    return res.redirect("/contact");
  } catch (error) {
    console.log("Erreur envoi mail contact:", error);
    req.session.contactError =
      "Une erreur est survenue lors de l'envoi du message.";
    return res.redirect("/contact");
  }
}

export async function getRegisterDirector(req, res) {
  try {
    res.render("pages/register.twig", {
      title: "Inscription",
    });
  } catch (error) {
    console.log(error);
  }
}

// Traitement du formulaire d'inscription du directeur
export async function postRegisterDirector(req, res) {
  const { schoolName, siret, lastname, firstname, mail, password } = req.body; 
  
  // Validation des données du formulaire d'inscription du directeur avec les regex définies dans services/regexDirector.js
  if (!schoolNameRegex.test(schoolName) || !schoolName) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error:
        "Veuillez saisir un nom d'établissement valide (2 à 40 caractères).",
    });
  }
  if (!siretRegex.test(siret) || !siret) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error:
        "Veuillez saisir un numéro SIRET valide (14 chiffres, sans espaces ni lettres)",
    });
  }
  if (!lastnameRegex.test(lastname) || !lastname) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error:
        "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!firstnameRegex.test(firstname) || !firstname) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error:
        "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!mailRegex.test(mail) || !mail) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error: "Veuillez saisir une adresse e-mail valide",
    });
  }
  if (!passwordRegex.test(password) || !password) {
    return res.render("pages/register.twig", {
      title: "Inscription",
      error:
        "Le mot de passe doit contenir au mininum 8 caractères, au moins un chiffre et au moins une lettre majuscule.",
    });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10); // Hashage du mot de passe avec bcrypt pour sécuriser le stockage dans la base de données

    const user = await login(mail); // Vérification que l'utilisateur n'existe pas déjà dans la base de données via son e-mail
    if (user) {
      return res.render("pages/register.twig", {
        title: "Inscription",
        error: "Un utilisateur avec cette adresse e-mail existe déjà.",
      });
    }
    const school = await getSchoolBySiret(siret); // Vérification que l'école n'existe pas déjà dans la base de données via son numéro SIRET
    if (school) { 
      return res.render("pages/register.twig", {
        title: "Inscription",       
        error: "Une école avec ce numéro SIRET existe déjà.",
      });
    }
    await registerDirector(
      // Appel de la fonction registerDirector pour créer le directeur dans la base de données avec les données du formulaire
      schoolName,
      siret,
      lastname,
      firstname,
      mail,
      passwordHash,
    );
  
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
    res.render("pages/register.twig", {
      title: "Inscription",
    });
  }
}

// Affichage de la page de connexion pour le directeur et le professeur
export async function getLogin(req, res) {
  try {
    res.render("pages/login.twig", {
      title: "Connexion",
    });
  } catch (error) {
    console.log(error);
  }
}

// Traitement du formulaire de connexion du directeur ou du professeur
export async function postLogin(req, res, next) {
  const { mail, password } = req.body;

  if (!mailRegex.test(mail) || !mail) {
    return res.render("pages/login.twig", {
      title: "Connexion",
      errorLogin: "Identifiants invalide",
    });
  }
  if (!passwordRegex.test(password) || !password) {
    return res.render("pages/login.twig", {
      title: "Connexion",
      errorLogin: "Identifiants invalide",
    });
  }
  try {
    const user = await login(mail); // Vérification que l'utilisateur existe dans la base de données via son e-mail

    if (!user) {
      throw new Error("Utilisateur inconnu");
    }

    const passwordHashed = await bcrypt.compare(password, user.password);

    if (!passwordHashed) {
      throw new Error("Mot de passe incorrect");
    }

    req.session.userId = user.id; // Stockage de l'ID de l'utilisateur dans la session pour maintenir la connexion
    console.log(req.session.userId);

    next();
  } catch (error) {
    console.log(error.message);
    res.render("pages/login.twig", {
      title: "Connexion",
      errorLogin: "Identifiants invalide",
    });
  }
}

// Affichage de la page "Mot de passe oublié" via le lien "Mot de passe oublié" sur la page de connexion
export async function getNewPassword(req, res) {
  try {
    res.render("pages/newPassword.twig", {
      title: "Réinitialisation mot de passe",
    });
  } catch (error) {
    console.log(error);
  }
}

// Envoi du mail pour réinitialiser le mot de passe via le lien "Mot de passe oublié" sur la page de connexion
export async function postNewPassword(req, res) {
  const { token, mail } = req.body;

  try {
    const user = await login(mail); // Vérification que l'utilisateur existe dans la base de données via son e-mail

    if (!user) {
      res.render("pages/newPassword.twig", {
        title: "Réinitialisation du mot de passe",
        errorUser: "Aucun compte associé à cette adresse e-mail",
      });
    }
    const token = generateToken(user.id); // Génération d'un token JWT pour l'utilisateur avec son ID en paramètre afin de sécuriser le lien de réinitialisation du mot de passe

    await transporter.sendMail({
      // Envoi du mail de réinitialisation du mot de passe avec le lien contenant le token
      from: process.env.MAIL_USER,
      to: mail,
      subject: "Réinitialisation du mot de passe",
      html: `<div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:25px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <!-- Logo textuel -->
    <div style="font-size:32px; font-weight:bold; margin-bottom:25px;">
      <span style="color:#35895f;">Aziya</span><span style="color:#000000;">Education</span>
    </div>

    <!-- Titre de bienvenue -->
    <h2 style="color:#2c3e50; margin-bottom:20px; text-align:center;">
      Bonjour
       <font color="#35895f">Aziya</font><font color="#000000">Education</font>
    </h2>
    
    <!-- Texte principal -->
    <p style="font-size:16px; color:#333; line-height:1.6;">
      Vous allez modifier votre mot de passe sur 
      <strong style="color:#35895f;">AziyaEducation</strong>.
    </p>

    <p style="font-size:16px; color:#333; line-height:1.6;">
      Pour des raisons de sécurité, vous devez définir votre propre mot de passe avant de pouvoir vous connecter.
    </p>

    <!-- Bouton vert -->
    <div style="margin:30px 0;">
      <a href="http://localhost:3002/changePassword?token=${token}"
         style="background:#35895f; color:white; padding:12px 22px; text-decoration:none; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </div>

    <!-- Lien alternatif -->
    <p style="font-size:14px; color:#555; line-height:1.6;">
      Si le bouton ne fonctionne pas :
    </p>

    <div style="margin:20px 0;">
      <a href="http://localhost:3002/changePassword?token=${token}" 
         style="color:#35895f; font-weight:bold; text-decoration:none;">
        Cliquer ici
      </a>
    </div>
    
    <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

    <p style="font-size:12px; color:#999;">
      Ceci est un message automatique, merci de ne pas y répondre.
    </p>

  </div>
</div>`,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
}

// Affichage de la page "Nouveau mot de passe" via le lien envoyé par mail  pour réinitialiser le mot de passe
export async function getChangePassword(req, res) {
  const { token } = req.query; // Récupération du token depuis la query string de l'URL (ex: /changePassword?token=abc123)
  try {
    res.render("pages/changePassword.twig", {
      title: "Nouveau mot de passe",
      token, // <-- ON PASSE LE TOKEN AU TEMPLATE
    });
  } catch (error) {
    console.log(error);
  }
}

// Traitement du formulaire pour réinitialiser le mot de passe via le lien envoyé par mail
export async function postChangePassword(req, res) {
  const { password } = req.body;
  const { token } = req.body;

  // Si le token est absent, on affiche un message d'erreur et on ne procède pas à la mise à jour du mot de passe
  if (!token) {
    return res.render("pages/changePassword.twig", {
      title: "Mot de passe oublié",
      errorNewPassword: "Lien invalide ou expiré",
    });
  }

  // Validation du mot de passe dans TOUS les cas (token ou pas)
  if (!passwordRegex.test(password) || !password) {
    return res.render("pages/changePassword.twig", {
      title: token ? "Nouveau mot de passe" : "Mot de passe oublié",
      errorNewPassword: "Identifiants invalide",
    });
  }

  try {
    // --- FLUX AVEC TOKEN ---
    // Vérification du token et récupération de l'ID du professeur depuis le payload du token

    const payload = verifieToken(token); // Vérifie et décode le token (token est un objet contenant l'ID du professeur dans payload.id)

    const professorId = await getUpdateProfessor(payload.id); // Vérifie que le professeur existe dans la base de données via l'ID contenu dans le token

    // Si le professeur n'existe pas, on affiche un message d'erreur et on ne procède pas à la mise à jour du mot de passe
    if (!professorId) {
      return res.render("pages/changePassword.twig", {
        title: "Nouveau mot de passe",
        errorNewPassword: "Compte introuvable",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await ChangePasswordById(payload.id, passwordHash); // Mise à jour via ID

    return res.render("pages/changePassword.twig", {
      title: "Nouveau mot de passe",
      succesChangePassword: "Votre mot de passe a été modifié avec succès.",
    });
  } catch (error) {
    console.log(error);
    res.render("pages/changePassword.twig", {
      // title: token ? "Nouveau mot de passe" : "Mot de passe oublié",
      errorNewPassword: "Identifiants invalide",
    });
  }
}

export async function postCreateProfessor(req, res) {
  const { lastname, firstname, mail, password } = req.body;
  const { school_id } = req.params;

  if (!lastnameRegex.test(lastname) || !lastname) {
    req.session.errorAdd =
      "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/dashboardDirector");
  }

  if (!firstnameRegex.test(firstname) || !firstname) {
    req.session.errorAdd =
      "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/dashboardDirector");
  }

  if (!mailRegex.test(mail) || !mail) {
    req.session.errorAdd = "Veuillez saisir une adresse e-mail valide.";
    return res.redirect("/dashboardDirector");
  }
  if (!passwordRegex.test(password) || !password) {
    req.session.errorAdd =
      "Le mot de passe doit contenir au mininum 8 caractères, au moins un chiffre et au moins une lettre majuscule.";
    return res.redirect("/dashboardDirector");
  }

  try {
    const user = await login(mail);
    const hashPassword = await bcrypt.hash(password, 10);

    if (!user) {
      // Aucun utilisateur n'existe avec cet e‑mail : on peut créer le professeur
      const newUser = await createProfessor(
        lastname,
        firstname,
        mail,
        hashPassword,
        Number(school_id),
      );
      const token = generateToken(newUser.id); // Génération d'un token JWT pour le nouveau professeur afin de sécuriser le lien de création du mot de passe

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: mail,
        subject: "Votre compte professeur a été créé",
        html: `<div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:25px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <!-- Logo textuel -->
    <div style="font-size:32px; font-weight:bold; margin-bottom:25px;">
      <span style="color:#35895f;">Aziya</span><span style="color:#000000;">Education</span>
    </div>

    <!-- Titre de bienvenue -->
    <h2 style="color:#2c3e50; margin-bottom:20px; text-align:center;">
      Bonjour ${lastname} ${firstname}, bienvenue sur 
       <font color="#35895f">Aziya</font><font color="#000000">Education</font>
    </h2>
    
    <!-- Texte principal -->
    <p style="font-size:16px; color:#333; line-height:1.6;">
      Votre directeur vient de créer votre compte professeur sur la plateforme 
      <strong style="color:#35895f;">AziyaEducation</strong>.
    </p>

    <p style="font-size:16px; color:#333; line-height:1.6;">
      Pour des raisons de sécurité, vous devez définir votre propre mot de passe avant de pouvoir vous connecter.
    </p>

    <!-- Bouton vert -->
    <div style="margin:30px 0;">
      <a href="http://localhost:3002/changePassword?token=${token}"
         style="background:#35895f; color:white; padding:12px 22px; text-decoration:none; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
        Définir mon mot de passe
      </a>
    </div>

    <!-- Lien alternatif -->
    <p style="font-size:14px; color:#555; line-height:1.6;">
      Si le bouton ne fonctionne pas, :
    </p>

    <div style="margin:20px 0;">
      <a href="http://localhost:3002/changePassword?token=${token}" 
         style="color:#35895f; font-weight:bold; text-decoration:none;">
        Cliquer ici
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

    <p style="font-size:12px; color:#999;">
      Ceci est un message automatique, merci de ne pas y répondre.
    </p>

  </div>
</div>`,
      });
      req.session.succes =
        "Création effectuée, un e-mail à été envoyé au nouveau professeur";
      res.redirect("/dashboardDirector");
    }
    if (user) {
      // Si Un utilisateur existe déjà avec cet e‑mail : création refusé et on affiche une erreur
      req.session.errorAdd = "Cette adresse e‑mail est déjà utilisée.";
      return res.redirect("/dashboardDirector");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getDashboardDirector(req, res) {
  try {
    const totalProfessor = await nbProfessor(req.session.user.school_id); // Récupération du nombre total de professeurs pour l'école du directeur connecté
    const totalStudent = await nbStudent(req.session.user.school_id); // Récupération du nombre total d'élèves pour l'école du directeur connecté
    const totalClassroom = await nbClassroom(req.session.user.school_id); // Récupération du nombre total de classes pour l'école du directeur connecté

    const professors = await selectProfessor(req.session.user.school_id); // Récupération de la liste des professeurs pour l'école du directeur connecté
    const classrooms = await selectClassroom(req.session.user.school_id); // Récupération de la liste des classes pour l'école du directeur connecté
    const studentsWithClassroom = await studentAddClassroom(
      // Récupération de la liste des élèves avec leur classe pour l'école du directeur connecté
      req.session.user.school_id,
    );
    const capaciteMaxClassroom = await nbStudentMaxByClassroom(
      // Récupération de la capacité maximale des classes pour l'école du directeur connecté
      req.session.user.school_id,
    );
    const professorWithClassroom = await classroomWithProfessor(
      // Récupération de la liste des professeurs avec leur classe (dans classroomRepository) pour l'école du directeur connecté
      req.session.user.school_id,
    );

    //faire sessionError et sessionSuccès
    const errorAdd = req.session.errorAdd;
    const messSucces = req.session.succes;
    // Nettoyage après affichage
    req.session.errorAdd = null;
    req.session.succes = null;

    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professors,
      classrooms,
      professorWithClassroom,
      totalProfessor,
      totalStudent,
      totalClassroom,
      studentsWithClassroom,
      capaciteMaxClassroom,
      errorAdd,
      messSucces,
    });
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      error,
    });
  }
}

// PARTIE GESTION DES PROFESSEURS

//AFFICHE LA PAGE EN MODE LSTE
export async function getManagementProfessor(req, res) {
  // Récupération des messages stockés dans la session
  const errorUpdate = req.session.errorUpdate;
  const messSucces = req.session.succes;
  // Nettoyage après affichage
  req.session.errorUpdate = null;
  req.session.succes = null;
  try {
    const professors = await selectProfessor(req.session.user.school_id); // Récupération de la liste des professeurs pour l'école du directeur connecté
    res.render("pages/professor.twig", {
      title: "Gestion professeurs",
      user: req.session.user,
      professors,
      errorUpdate,
      messSucces,
    });
  } catch (error) {
    console.log(error);
  }
}

// AFFICHE LA PAGE EN MODE EDITION
export async function getUpdate(req, res) {
  const { professor_id } = req.params; // Récupération de l'ID du professeur à modifier depuis les paramètres de l'URL (ex: /professor/update/123)
  try {
    const professors = await selectProfessor(req.session.user.school_id); // Récupération de la liste des professeurs pour l'école du directeur connecté
    const updateProf = await getUpdateProfessor(Number(professor_id)); // Récupération des informations du professeur à modifier pour l'école du directeur connecté
    console.log(updateProf.id);

    res.render("pages/professor.twig", {
      title: "Gestion professeurs",
      user: req.session.user,
      professors,
      updateProf: updateProf.id, // On passe l'ID du professeur à modifier pour l'affichage du formulaire d'édition
    });
  } catch (error) {
    console.log(error);
  }
}

export async function postUpdate(req, res) {
  const { lastname, firstname, mail } = req.body;
  const { professor_id } = req.params; // Récupération de l'ID du professeur à modifier depuis les paramètres de l'URL (ex: /professor/update/123)

  if (!lastnameRegex.test(lastname) || !lastname) {
    req.session.errorUpdate =
      "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/professor");
  }
  if (!firstnameRegex.test(firstname) || !firstname) {
    req.session.errorUpdate =
      "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/professor");
  }
  if (!mailRegex.test(mail) || !mail) {
    req.session.errorUpdate = "Veuillez saisir une adresse e-mail valide.";
    return res.redirect("/professor");
  }
  try {
    await postUpdateProfessor(Number(professor_id), lastname, firstname, mail); // Mise à jour des informations du professeur dans la base de données via l'ID du professeur et les nouvelles valeurs
    req.session.succes = "Modification enregistrée.";
    res.redirect("/professor");
  } catch (error) {
    console.log(errorUpdate.message);
    res.render("pages/professor.twig", {
      title: "Gestion professeurs",
      errorUpdate,
    });
  }
}

// SUPPRESSION D'UN PROFESSEUR
export async function deleteProf(req, res) {
  const { professor_id } = req.params;
  try {
    await deleteProfessor(Number(professor_id));
    req.session.succes = "Suppression effectuée.";
    res.redirect("/professor");
  } catch (error) {
    console.log(error);
  }
}

// SUPPRESSION D'UNE AFFECTATION PROFESSEUR-CLASSE
export async function deleteAffectProf(req, res) {
  const { classroom, professor } = req.body;
  const { professor_id } = req.params; // Récupération de l'ID du professeur à supprimer depuis les paramètres de l'URL (ex: /professor/deleteAffectation/123)
  console.log(req.body);

  try {
    await deleteAffectationProf(
      Number(classroom),
      Number(professor),
      Number(professor_id),
    );
    req.session.succes = "Affectation supprimée";
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error);
  }
}

// PARTIE GESTION DU DASHBOARD DU PROFESSEUR

export async function getDashboarProfessor(req, res) {
  try {
    const student = await selectStudent(req.session.user.school_id); // Récupération de la liste des élèves pour l'école du professeur connecté
    let id;
    student.forEach((eleve) => {
      id = eleve.id;
    }); // est envoyé à la fonction selectStudentById(studentId) pour récupérer un élève par son ID pour le formulaire de sélection d'élève dans le dashboard du professeur
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    ); // Récupération de la liste des classes pour l'école du professeur connecté

    const listStudentByProfessor = await studentsByProfessor(
      req.session.userId,
    ); // Récupération de la liste des élèves par classe pour le professeur connecté

    const studentId = await selectStudentById(Number(id)); // Récupération des informations de l'élève sélectionné pour le calendrier

    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professorWithClassroom,
      listStudentByProfessor,
      studentId,
      modal: false,
      modalCalendar: false,
    });
  } catch (error) {
    console.log(error);
  }
}

//Afficher modal avec liste des elèves par classe dans le dashboardProfessor
export async function postListStudentByProfessor(req, res) {
  const { classroom_id } = req.body;

  if (!classroom_id) {
    req.session.errorSelect = "Veuillez selectionner une classe";
  }
  const errorSelect = req.session.errorSelect;
  req.session.errorSelect = null;

  try {
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );
    const students = await selectStudentByClassroom(Number(classroom_id)); // Récupération de la liste des élèves pour la classe sélectionnée par le professeur connecté pour la modalListStudent.twig

    const nbStudentByClassroom = await nbStudentClassroom(
      req.session.user.school_id,
    ); // Récupération du nombre d'élèves par classe pour le professeur connecté

    const listStudentByProfessor = await studentsByProfessor(
      req.session.userId,
    ); // Récupération de la liste des élèves pour le professeur connecté

    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professorWithClassroom,
      students,
      nbStudentByClassroom,
      listStudentByProfessor,
      errorSelect,
      modal: true,
      modalCalendar: false,
      selectedClassroom: classroom_id, // On passe l'ID de la classe sélectionnée récuperer avec le req.body pour l'affichage de la modalListStudent.twig
    });
  } catch (error) {
    console.log(error);
  }
}

//Afficher modal avec calendrier des imputations par élève dans le dashboardProfessor
export async function postCalendar(req, res) {
  const { student_id } = req.body;
  const { student } = req.params;

  if (!student_id) {
    req.session.errorSelect = "Veuillez sélectionner un élève";
  }
  const errorSelect = req.session.errorSelect;
  req.session.errorSelect = null;
  try {
    const professorWithClassroom = await classroomWithProfessor(
      // Récupération des classes du professeur connecté
      req.session.user.school_id,
    );
    //  const students = await selectStudentByClassroom(Number(classroom_id));//

    const nbStudentByClassroom = await nbStudentClassroom(
      // Récupération du nombre d'élèves par classe pour le professeur connecté
      req.session.user.school_id,
    );
    const studentId = await selectStudentById(Number(student_id)); // Récupération des informations de l'élève sélectionné pour le calendrier

    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professorWithClassroom,
      studentId,
      nbStudentByClassroom,
      errorSelect,
      modalCalendar: true,
      modal: false,
    });
  } catch (error) {
    console.log(error);
  }
}

// Récupération des événements pour le calendrier
export async function getCalendar(req, res) {
  const { student_id } = req.params;
  try {
    const imputations = await listImputationsByStudent(Number(student_id));
    const events = imputations.map((imputation) => ({
      // .map() permet de transformer chaque élément du tableau imputations en un nouvel objet avec les propriétés nécessaires pour FullCalendar
      // On crée un objet pour chaque imputation avec les propriétés nécessaires pour FullCalendar

      title: imputation.isPresent ? "Présent" : "Absent", // Si l'élève est présent, affiche "Présent", sinon affiche "Absent".
      color: imputation.isPresent ? "green" : "red", // Met l'événement en vert si présent, en rouge si absent.
      start: imputation.dateTime.toISOString().split("T")[0], // toISOString().split("T")[0] sert à convertir la date en YYYY-MM-DD pour FullCalendar
    }));

    res.json(events);
  } catch (error) {
    console.log(error);
  }
}

//Fonction logout pour le director et le professeur
export async function logout(req, res) {
  const role = req.session.user.role; //Récupération du rôle avant la destruction de la session

  req.session.destroy(function (err) {
    // Destruction de la session côté serveur pour déconnecter complètement l'utilisateur

    if (!err) {
      // Si aucune erreur : la session est détruite, on renvoie l'utilisateur vers la page de connexion
      return res.redirect("/login");
    }

    // Si une erreur survient → on renvoie vers le bon dashboard selon le rôle
    if (role === "DIRECTOR") {
      return res.render("pages/dashboardDirector.twig", {
        title: "Tableau de bord",
        err: "Erreur lors de la déconnexion",
      });
    }
    if (role === "PROFESSOR") {
      return res.render("pages/dashboardProfessor.twig", {
        title: "Tableau de bord",
        err: "Erreur lors de la déconnexion",
      });
    }

    //Si aucun rôle n'est trouvé
    return res.redirect("/login");
  });
}
