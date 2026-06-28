import { classroomWithProfessor } from "../../prisma/repository/classroomRepository.js";
import {
  createImputation,
  getUpdateImputation,
  imputationByStudent,
  updateImputation,
} from "../../prisma/repository/imputationRepository.js";
import {
  nbStudentClassroom,
  selectStudentByClassroom,
  selectStudentById,
} from "../../prisma/repository/studentRepository.js";



export async function newImputation(req, res) { 
  const { imputation, student_id, classroom_id } = req.body;

  try {
    // Vérifie si l'élève possède déjà une imputation aujourd'hui.
    const imputationOfDay = await imputationByStudent(Number(student_id));

    if (!imputationOfDay) {
      // Aucune imputation trouvée pour cet élève aujourd'hui → création autorisée.
      await createImputation(Boolean(imputation), Number(student_id));

      const professorWithClassroom = await classroomWithProfessor(
        req.session.user.school_id,
      );// Récupère les classes du professeur connecté

      const students = await selectStudentByClassroom(Number(classroom_id));// Récupère les élèves de la classe sélectionnée

      const nbStudentByClassroom = await nbStudentClassroom(
        req.session.user.school_id,
      );// Récupère le nombre d'élèves par classe pour le professeur connecté

      res.render("pages/dashboardProfessor.twig", {
        title: "Tableau de bord",
        user: req.session.user,
        professorWithClassroom,
        students,
        nbStudentByClassroom,
        modal: true,
        selectedClassroom: classroom_id,
      });
    } else {
      // Une imputation existe déjà pour cet élève aujourd'hui → création interdite (gérer dans modalListStudent.twig)
      return res.render("pages/dashboardProfessor.twig", {
        title: "Tableau de bord",
        user: req.session.user,
        professorWithClassroom,
        students,
        nbStudentByClassroom,
        modal: true,
        selectedClassroom: classroom_id,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getUpdate(req, res) {
  const { id } = req.params;
  try {
    // 1. Récupérer l'imputation par son ID
    const updateImputation = await getUpdateImputation(Number(id));

    // 2. Récupérer l'élève lié à cette imputation (updateImputation.student_id existe parce que l’imputation contient la clé étrangère vers l’élève.)
    const studentById = await selectStudentById(updateImputation.student_id);

    // 3. Récupérer la classe de cet élève
    const classroom_id = studentById.classroom_id;

    // 4. Récupérer tous les élèves de cette classe avec leurs imputations du jour (pour l'affichage dans la modalListStudent.twig)
    const students = await selectStudentByClassroom(Number(classroom_id));

    // 5. Récupérer les classes du professeur connecté
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );

    // 6. Récupérer le nombre d'élèves par classe pour l'école du professeur connecté
    const nbStudentByClassroom = await nbStudentClassroom(
      req.session.user.school_id,
    );

    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professorWithClassroom,
      students,
      nbStudentByClassroom,
      modal: true,
      updateImputation,//updateImputation = l’imputation que je veux modifier
      selectedClassroom: classroom_id,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function postUpdate(req, res) {
  const { imputation, student_id, classroom_id } = req.body;
  const { id } = req.params;

  try {
    await updateImputation(Number(id), imputation == "true"); // Le formulaire envoie "true"/"false" en texte, on le convertit ici en vrai booléen, si "false"=> != de imputation == "true"=>absent
    const students = await selectStudentByClassroom(Number(classroom_id));// Récupère les élèves de la classe sélectionnée
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );// Récupère les classes du professeur connecté

    const nbStudentByClassroom = await nbStudentClassroom(
      req.session.user.school_id,
    );// Récupère le nombre d'élèves par classe pour le professeur connecté

    res.render("pages/dashboardProfessor.twig", {
      title: "Tableau de bord",
      user: req.session.user,
      professorWithClassroom,
      students,
      nbStudentByClassroom,
      modal: true,
      selectedClassroom: classroom_id,
    });
  } catch (error) {
    console.log(error);
  }
}
