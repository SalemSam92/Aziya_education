import { classroomWithProfessor } from "../../prisma/repository/classroomRepository.js";
import {
  createImputation,
  getUpdateImputation,
  updateImputation,
} from "../../prisma/repository/imputationRepository.js";
import {
  nbStudentClassroom,
  selectStudentByClassroom,
  selectStudentById,
} from "../../prisma/repository/studentRepository.js";




export async function newImputation(req, res) {
  const { imputation, student_id, classroom_id } = req.body;
  console.log(req.body);
  
 
  try {

    await createImputation(Boolean(imputation), Number(student_id));

    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );

    const students = await selectStudentByClassroom(Number(classroom_id));

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
      selectedClassroom: classroom_id,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getUpdate(req,res){
  const {id} = req.params
  try {
    // 1. Récupérer l'imputation par son ID
    const updateImputation = await getUpdateImputation(Number(id))
   

    // 2. Récupérer l'élève lié à cette imputation
    const studentById = await selectStudentById(updateImputation.student_id)

    // 3. Récupérer la classe de cet élève
    const classroom_id = studentById.classroom_id

    // 4. Récupérer tous les élèves de cette classe
    const students = await selectStudentByClassroom(Number(classroom_id));
    
    // 5. Récupérer le nombre d'élèves
     const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );
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
      updateImputation,
      selectedClassroom: classroom_id,
    });
    
  } catch (error) {
    console.log(error);
    
  }
}


export async function postUpdate(req, res) {
  const { imputation, student_id, classroom_id } = req.body;
  const { id } = req.params;
  // console.log(req.body);
  // console.log(req.params);

  try {
  await updateImputation(Number(id), imputation == "true");
   const students = await selectStudentByClassroom(Number(classroom_id));
    const professorWithClassroom = await classroomWithProfessor(
      req.session.user.school_id,
    );
   
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
      selectedClassroom: classroom_id,
    });
  } catch (error) {
    console.log(error);
  }
}
