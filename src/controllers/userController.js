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
  createProfessor,
  login,
  nbProfessor,
  registerDirector,
  selectProfessor,
} from "../../prisma/repository/userRepository.js";
import {
  classroomWithProfessor,
  nbClassroom,
  nbStudentMaxByClassroom,
  selectClassroom,
} from "../../prisma/repository/classroomRepository.js";
import {
  nbStudent,
  selectStudent,
  studentAddClassroom,
} from "../../prisma/repository/studentRepository.js";

export async function getLandingPage(req, res) {
  try {
    res.render("pages/landingPage.twig", {
      title: "AziyaEducation",
    });
  } catch (error) {
    console.log(error);
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

export async function postRegisterDirector(req, res) {
  const { schoolName, siret, lastname, firstname, mail, password } = req.body;

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
    const passwordHash = await bcrypt.hash(password, 10);

    await registerDirector(
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

export async function getLogin(req, res) {
  try {
    res.render("pages/login.twig", {
      title: "Connexion",
    });
  } catch (error) {
    console.log(error);
  }
}

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
    const user = await login(mail);

    if (!user) {
      throw new Error("Utilisateur inconnu");
    }

    const passwordHashed = await bcrypt.compare(password, user.password);

    if (!passwordHashed) {
      throw new Error("Mot de passe incorrect");
    }

    req.session.userId = user.id;
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

export async function postCreateProfessor(req, res) {
  const { lastname, firstname, mail, password } = req.body;
  const { school_id } = req.params;

  if (!lastnameRegex.test(lastname) || !lastname) {
    return res.render("pages/formAddProfessor.twig", {
      error:
        "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!firstnameRegex.test(firstname) || !firstname) {
    return res.render("pages/formAddProfessor.twig", {
      error:
        "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!mailRegex.test(mail) || !mail) {
    return res.render("pages/formAddProfessor", {
      error: "Veuillez saisir une adresse e-mail valide",
    });
  }
  if (!passwordRegex.test(password) || !password) {
    return res.render("pages/formAddProfessor.twig", {
      error:
        "Le mot de passe doit contenir au mininum 8 caractères, au moins un chiffre et au moins une lettre majuscule.",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    await createProfessor(
      lastname,
      firstname,
      mail,
      hashPassword,
      Number(school_id),
    );
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error);
  }
}

export async function getDashboardDirector(req, res) {
  try {
    const totalProfessor = await nbProfessor(req.session.user.school_id);
    const totalStudent = await nbStudent(req.session.user.school_id);
    const totalClassroom = await nbClassroom(req.session.user.school_id);

    const professors = await selectProfessor(req.session.user.school_id);
    const classrooms = await selectClassroom(req.session.user.school_id);
    const studentsWithClassroom = await studentAddClassroom(req.session.user.school_id);
    const capaciteMaxClassroom = await nbStudentMaxByClassroom(req.session.user.school_id)
    // const professorWithClassroom = await classroomWithProfessor(req.session.user.school_id,);
    console.log(req.session.user);
    
    //faire sessionError et sessionSuccès

    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professors,
      classrooms,
      totalProfessor,
      totalStudent,
      totalClassroom,
      studentsWithClassroom,
      capaciteMaxClassroom
    });
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      error,
    });
  }
}

export async function getDashboarProfessor(req, res) {
  try {
    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
    });
  } catch (error) {
    console.log(error);
  }
}
