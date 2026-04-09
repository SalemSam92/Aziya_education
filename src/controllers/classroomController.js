import {
  nameClassroomRegex,
  nbMaxStudentRegex,
} from "../services/regexDirector.js";
import {
  affectProfessor,
  countStudent,
  createClassroom,
  deleteAffectation,
  deleteClassroom,
  dipslayStudentByClassroom,
  nbClassroomByProfessor,
  postUpdateClassroom,
  selectClassroom,
} from "../../prisma/repository/classroomRepository.js";
import { nbStudentClassroom } from "../../prisma/repository/studentRepository.js";

export async function postCreateClassroom(req, res) {
  const { name, nbMaxStudent } = req.body;
  const { school_id } = req.params;

  console.log(req.body);
  console.log(req.params.school_id);

  if (!nameClassroomRegex.test(name) || !name) {
    req.session.errorAdd =
      "Veuillez saisir un nom de classe valide en majuscule (ex : CM2 A).";
    return res.redirect("/dashboardDirector");
  }

  if (!nbMaxStudentRegex.test(nbMaxStudent) || !nbMaxStudent) {
    req.session.errorAdd =
      "Le nombre d'élèves doit être compris entre 0 et 35.";
    return res.redirect("/dashboardDirector");
  }
  try {
    await createClassroom(name, Number(nbMaxStudent), Number(school_id));
    req.session.succes = "Création effectuée.";
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error.message);
    res.render("pages/dashboardDirector.twig", {
      tile: "Tableau de bord",
      error,
    });
  }
}

export async function affectProfessorToClassroom(req, res) {
  const { professor, classroom } = req.body;
  const confirm = req.body.confirm === "true";
  console.log(req.body);
  console.log(req.body.confirm);
  
  if (!professor || !classroom) {
    req.session.errorAdd =
      "Veuillez sélectionner un professeur et une classe avant de poursuivre.";
    return res.redirect("/dashboardDirector");
  }

  try {
    const professorHasClass = await nbClassroomByProfessor(Number(professor));

    if (professorHasClass >= 1 && !confirm) {
      //Si le prof possède déjà une classe ou plus et que le confirm n'existe pas (form du dashboard)=> redirection modal

      return res.render("pages/dashboardDirector.twig", {
        confirmAffectation: true,
        professor,
        classroom,
      });
    }

    await affectProfessor(Number(professor), Number(classroom));
    req.session.succes = "Affectation réalisée avec succès.";
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      tile: "Tableau de bord",
      error,
    });
  }
}

export async function getManagementClassroom(req, res) {
  const classroomId = req.query.id; //Récupération de l'id de la classe via ?id=xxx dans modalClassroom.js

  try {
    const classrooms = await selectClassroom(req.session.user.school_id);
    const countStud = await nbStudentClassroom(req.session.user.school_id);
    const allStudentByClassroom = classroomId
      ? await dipslayStudentByClassroom(
          req.session.user.school_id,
          Number(classroomId),
        )
      : null; // Charge les élèves de la classe si un id est fourni(classromId), sinon renvoie null
    const arrayClassroom = []; // Fusion des deux tableaux (classrooms et countStud)

    classrooms.forEach((classroom) => {
      let nb = 0;

      countStud.forEach((count) => {
        if (count.classroom_id === classroom.id) {
          nb = count._count.id;
        }
      });
      arrayClassroom.push({
        id: classroom.id,
        name: classroom.name,
        nbMaxStudent: classroom.nbMaxStudent,
        nbStud: nb,
      });
    });

    // Récupération des messages stockés dans la session
    const errorUpdate = req.session.errorUpdate;
    const messSucces = req.session.succes;
    // Nettoyage après affichage
    req.session.errorUpdate = null;
    req.session.succes = null;

    res.render("pages/classroom.twig", {
      title: "Gestion des classes",
      user: req.session.user,
      classrooms: arrayClassroom,
      updateClassroom: Number(req.params.id),
      allStudentByClassroom,
      errorUpdate,
      messSucces,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function postUpdate(req, res) {
  const { name, nbMaxStudent } = req.body;
  const { id } = req.params;
  if (!nameClassroomRegex.test(name) || !name) {
    req.session.errorUpdate =
      "Veuillez saisir un nom de classe valide en majuscule (ex : CM2 A).";
    return res.redirect("/classroom");
  }

  if (!nbMaxStudentRegex.test(nbMaxStudent) || !nbMaxStudent) {
    req.session.errorUpdate =
      "Le nombre d'élèves doit être compris entre 0 et 35..";
    return res.redirect("/classroom");
  }
  try {
    await postUpdateClassroom(Number(id), name, Number(nbMaxStudent));
    req.session.succes = "Modification enregistrée.";
    res.redirect("/classroom");
  } catch (error) {
    console.log(error);
  }
}
export async function deleteClass(req, res) {
  const { id } = req.params;
  try {
    await deleteClassroom(Number(id));
    req.session.succes = "Suppression effectuée.";
    res.redirect("/classroom");
  } catch (error) {
    console.log(error);
  }
}

export async function disconnectClass(req, res) {
  const { student_id } = req.body;
  const { id } = req.params;
  try {
    console.log(req.body);
    await deleteAffectation(Number(id), Number(student_id));
    res.redirect("/classroom");
  } catch (error) {
    console.log(error);
  }
}
