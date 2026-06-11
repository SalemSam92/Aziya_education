import {
  birthdayRegex,
  firstnameRegex,
  lastnameRegex,
} from "../services/regexDirector.js";
import {
  affectClassroom,
  createStudent,
  deleteAffectation,
  deleteStudent,
  nbClassroomForStudent,
  nbStudentClassroom,
  postUpdateStudent,
  selectStudent,
} from "../../prisma/repository/studentRepository.js";
import { dateAge } from "../services/verifieAge.js";
import {
  nbStudentMaxByClassroom,
  selectClassroom,
} from "../../prisma/repository/classroomRepository.js";

// Crée un nouvel élève après validation des champs.
export async function postCreateStudent(req, res) {
  const { lastname, firstname, birthday } = req.body;
  const { school_id } = req.params;
  console.log(req.body);
  console.log(req.params);

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
  if (!birthdayRegex.test(birthday) || !birthday) {
    req.session.errorAdd =
      "Veuillez saisir une date de naissance valide au format JJ/MM/AAAA.";
    return res.redirect("/dashboardDirector");
  }

  if (dateAge(birthday) <= 5 || dateAge(birthday) >= 12) {
    req.session.errorAdd =
      "L'âge de l'éleve doit être compris entre 5 et 12 ans";
    return res.redirect("/dashboardDirector");
  }
  try {
    await createStudent(
      lastname,
      firstname,
      new Date(birthday),
      Number(school_id),
    );
    req.session.succes = "Création effectuée.";
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error.message);
    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      error,
    });
  }
}

// Affecte une classe à un élève sélectionné.
export async function affectClassroomToStudent(req, res) {
  const { student_id, classroom_id } = req.body;

  console.log(req.body);

  if (!student_id || !classroom_id) {
    req.session.errorAdd =
      "Veuillez sélectionner un élève et une classe avant de poursuivre.";
    return res.redirect("/dashboardDirector");
  }
  try {
    await affectClassroom(Number(student_id), Number(classroom_id));
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

// Affiche la page de gestion des élèves avec données et messages.
export async function getManagementStudent(req, res) {
  try {
    const students = await selectStudent(req.session.user.school_id);
    const classrooms = await selectClassroom(req.session.user.school_id);
    const capaciteMaxClassroom = await nbStudentMaxByClassroom(
      req.session.user.school_id,
    );
    const arrayStudent = [];

    students.forEach((student) => {
      let classroomName = "";
      let classroom_id;

      classrooms.forEach((classroom) => {
        if (!student.classroom) {
          return (classroomName = "Pas de classe assignée");
        }

        if (classroom.id == student.classroom.id) {
          classroomName = classroom.name;
          classroom_id = classroom.id;
        }
      });
      return arrayStudent.push({
        id: student.id,
        lastname: student.lastname,
        firstname: student.firstname,
        birthday: student.birthday,
        classroom: classroomName,
        classroomId: classroom_id,
      });
    });
    // Récupération des messages stockés dans la session
    const errorUpdate = req.session.errorUpdate;
    const messSucces = req.session.succes;
    // Nettoyage après affichage
    req.session.errorUpdate = null;
    req.session.succes = null;

    res.render("pages/student.twig", {
      title: "Gestion des élèves",
      user: req.session.user,
      students: arrayStudent,
      capaciteMaxClassroom,
      updateStudent: Number(req.params.id),
      errorUpdate,
      messSucces,
    });
  } catch (error) {
    console.log(error);
  }
}

// Met à jour un élève après validation de ses informations.
export async function postUpdate(req, res) {
  const { lastname, firstname, birthday, classroom_id } = req.body;
  const { id } = req.params;

  if (!lastnameRegex.test(lastname) || !lastname) {
    req.session.errorUpdate =
      "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/student");
  }
  if (!firstnameRegex.test(firstname) || !firstname) {
    req.session.errorUpdate =
      "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).";
    return res.redirect("/student");
  }

  if (!birthdayRegex.test(birthday) || !birthday) {
    req.session.errorUpdate =
      "Veuillez saisir une date de naissance valide au format JJ/MM/AAAA.";
    return res.redirect("/student");
  }

  if (dateAge(birthday) <= 5 || dateAge(birthday) >= 12) {
    req.session.errorUpdate =
      "L'âge de l'éleve doit être compris entre 5 et 12 ans";
    return res.redirect("/student");
  }

  let classroomId = classroom_id;

  if (classroomId === "") {
    //Convertit classroom_id : si le champ est vide on met null, sinon on le transforme en nombre pour éviter les erreurs de clé étrangère.
    classroomId = null;
  } else {
    classroomId = Number(classroom_id);
  }
  try {
    await nbStudentMaxByClassroom(req.session.user.id);
    await postUpdateStudent(
      Number(id),
      lastname,
      firstname,
      new Date(birthday),
      classroomId,
    );
    req.session.succes = "Modification enregistrée.";
    res.redirect("/student");
  } catch (error) {
    console.log(error);
    res.render("pages/student.twig", {
      title: "Gestion des élèves",
      errorUpdate,
    });
  }
}

// Supprime l'affectation de classe d'un élève.
export async function disconnectClassroom(req, res) {
  const { classrom_id } = req.body;
  const { id } = req.params;
  try {
    console.log(req.body);
    await deleteAffectation(Number(id), classrom_id);
    req.session.succes = "Modification enregistrée.";
    res.redirect("/student");
  } catch (error) {
    console.log(error);
  }
}

// Supprime un élève par son id.
export async function deleteStud(req, res) {
  const { id } = req.params;
  try {
    await deleteStudent(Number(id));
    req.session.succes = "Suppression effectuée.";
    res.redirect("/student");
  } catch (error) {
    console.log(error);
  }
}
