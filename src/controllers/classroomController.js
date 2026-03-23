import bcrypt from "bcrypt";
import {
  nameClassroomRegex,
  nbMaxStudentRegex,
} from "../services/regexDirector.js";
import {
  affectProfessor,
  createClassroom,
  nbClassroomByProfessor,
  selectClassroom,
} from "../../prisma/repository/classroomRepository.js";
import { selectProfessor } from "../../prisma/repository/userRepository.js";
import { selectStudent } from "../../prisma/repository/studentRepository.js";

export async function postCreateClassroom(req, res) {
  const { name, nbMaxStudent } = req.body;
  const { school_id } = req.params;

  console.log(req.body);
  console.log(req.params.school_id);

  if (!nameClassroomRegex.test(name) || !name) {
    return res.render("pages/formAddclassroom.twig", {
      tile: "Tableau de bord",
      error:
        "Veuillez saisir un nom de classe valide en majuscule (ex : CM2 A).",
    });
  }

  if (!nbMaxStudentRegex.test(nbMaxStudent) || !nbMaxStudent) {
    return res.render("pages/formAddclassroom.twig", {
      tile: "Tableau de bord",
      error: "Le nombre d'élèves doit être compris entre 0 et 35.",
    });
  }
  try {
    await createClassroom(name, Number(nbMaxStudent), Number(school_id));

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
  

  try {
    const professorHasClass = await nbClassroomByProfessor(Number(professor));

    if (professorHasClass >= 1 && !confirm) {  //Si le prof possède déjà une classe ou plus et que le confirm n'existe pas (form du dashboard)=> redirection modal
  
      return res.render("pages/dashboardDirector.twig", {
        confirmAffectation: true,
        professor,
        classroom,
      });
    }
 
      await affectProfessor(Number(professor), Number(classroom));
      res.redirect("/dashboardDirector");
    
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      tile: "Tableau de bord",
      error,
    });
  }
}
