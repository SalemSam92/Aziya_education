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

export async function postCreateStudent(req, res) {
  const { lastname, firstname, birthday } = req.body;
  const { school_id } = req.params;
  console.log(req.body);
  console.log(req.params);

  if (!lastnameRegex.test(lastname) || !lastname) {
    return res.render("pages/formAddStudent.twig", {
      error:
        "Veuillez saisir un nom de famille valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!firstnameRegex.test(firstname) || !firstname) {
    return res.render("pages/formAddStudent.twig", {
      error:
        "Veuillez saisir un prénom valide (lettres uniquement, espaces/tirets/apostrophes autorisés).",
    });
  }
  if (!birthdayRegex.test(birthday) || !birthday) {
    return res.render("pages/formAddStudent.twig", {
      error:
        "Veuillez saisir une date de naissance valide au format JJ/MM/AAAA.",
    });
  }
  if (dateAge(birthday) <= 5 || dateAge(birthday) >= 12) {
    return res.render("pages/formAddStudent.twig", {
      error: "L'âge de l'éleve doit être compris entre 5 et 12 ans",
    });
  }
  try {
    await createStudent(
      lastname,
      firstname,
      new Date(birthday),
      Number(school_id),
    );
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error.message);
    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      error,
    });
  }
}

export async function affectClassroomToStudent(req, res) {
  const { student_id, classroom_id } = req.body;
  // const confirm_Student = req.body.confirm === "true"

  console.log(req.body);

  try {
    // const studentHasClassroom = await nbClassroomForStudent(Number(student_id)) //Récuperation de l'id de l'élève avec sa classe (classroom_id)

    // if (studentHasClassroom  && !confirm_Student) {     //Vérification si l’élève a déjà une classe et que l'utilisateur n'a pas confirmé
    //   return res.render("pages/dashboardDirector.twig",{
    //     confirmAffectStudent : true,
    //     student_id,
    //     classroom_id
    //   })
    // }

    await affectClassroom(Number(student_id), Number(classroom_id));
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      tile: "Tableau de bord",
      error,
    });
  }
}

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
    res.render("pages/student.twig", {
      title: "Gestion des élèves",
      user: req.session.user,
      students: arrayStudent,
      capaciteMaxClassroom,
      updateStudent: Number(req.params.id),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function postUpdate(req, res) {
  const { lastname, firstname, birthday, classroom_id } = req.body;
  const { id } = req.params;
  let classroomId = classroom_id;

  if (classroomId === "") { //Convertit classroom_id : si le champ est vide on met null, sinon on le transforme en nombre pour éviter les erreurs de clé étrangère.
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

    res.redirect("/student");
  } catch (error) {
    console.log(error);
  }
}

export async function disconnectClassroom(req, res) {
  const { classrom_id } = req.body;
  const { id } = req.params;
  try {
    console.log(req.body);
    await deleteAffectation(Number(id), classrom_id);
    res.redirect("/student");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteStud(req, res) {
  const { id } = req.params;
  try {
    await deleteStudent(Number(id));
    res.redirect("/student");
  } catch (error) {
    console.log(error);
  }
}
