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
  deleteProfessor,
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
    console.log(user);
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
      req.session.succes = "Création effectuée.";
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
    const totalProfessor = await nbProfessor(req.session.user.school_id);
    const totalStudent = await nbStudent(req.session.user.school_id);
    const totalClassroom = await nbClassroom(req.session.user.school_id);

    const professors = await selectProfessor(req.session.user.school_id);
    const classrooms = await selectClassroom(req.session.user.school_id);
    const studentsWithClassroom = await studentAddClassroom(
      req.session.user.school_id,
    );
    const capaciteMaxClassroom = await nbStudentMaxByClassroom(
      req.session.user.school_id,
    );
    const professorWithClassroom = await classroomWithProfessor(
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

//AFFICHE LA PAGE EN MODE LSTE
export async function getManagementProfessor(req, res) {
  // Récupération des messages stockés dans la session
  const errorUpdate = req.session.errorUpdate;
  const messSucces = req.session.succes;
  // Nettoyage après affichage
  req.session.errorUpdate = null;
  req.session.succes = null;
  try {
    const professors = await selectProfessor(req.session.user.school_id);
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
  const { professor_id } = req.params;
  try {
    const professors = await selectProfessor(req.session.user.school_id);
    const updateProf = await getUpdateProfessor(Number(professor_id));
    console.log(updateProf.id);

    res.render("pages/professor.twig", {
      title: "Gestion professeurs",
      user: req.session.user,
      professors,
      updateProf: updateProf.id,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function postUpdate(req, res) {
  const { lastname, firstname, mail } = req.body;
  const { professor_id } = req.params;

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
    await postUpdateProfessor(Number(professor_id), lastname, firstname, mail);
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

export async function deleteAffectProf(req, res) {
  const { classroom, professor } = req.body;
  const { professor_id } = req.params;
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

export async function getDashboarProfessor(req, res) {
  try {
    const student = await selectStudent(req.session.user.school_id);
    let id;
    student.forEach((eleve) => {
      id = eleve.id;
    });
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );
    const listStudentByProfessor = await studentsByProfessor(
      req.session.userId,
    );
    const studentId = await selectStudentById(Number(id));

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
    const students = await selectStudentByClassroom(Number(classroom_id));
    const nbStudentByClassroom = await nbStudentClassroom(
      req.session.user.school_id,
    );
    const listStudentByProfessor = await studentsByProfessor(
      req.session.userId,
    );

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
      selectedClassroom: classroom_id,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function postCalendar(req, res) {
  const { student_id } = req.body;
  const { student } = req.params;

  if (!student_id) {
    req.session.errorSelect = "Veuillez sélectionner un élève"
  }
  const errorSelect = req.session.errorSelect;
  req.session.errorSelect = null;
  try {
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );
    // const students = await selectStudentByClassroom(Number(classroom_id));
    const nbStudentByClassroom = await nbStudentClassroom(
      req.session.user.school_id,
    );
    const studentId = await selectStudentById(Number(student_id));

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

export async function getCalendar(req, res) {
  const { student_id } = req.params;
  try {
    const imputations = await listImputationsByStudent(Number(student_id));
    const events = imputations.map((imputation) => ({    // .map() transforme tes imputations en événements FullCalendar.
      title: imputation.isPresent ? "Présent" : "Absent",   // Si l'élève est présent, affiche "Présent", sinon affiche "Absent".
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
