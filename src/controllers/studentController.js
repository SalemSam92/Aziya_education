import {
  birthdayRegex,
  firstnameRegex,
  lastnameRegex,
} from "../services/regexDirector.js";
import { affectClassroom, createStudent, nbClassroomForStudent } from "../../prisma/repository/studentRepository.js";
import { dateAge } from "../services/verifieAge.js";

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
  if (dateAge(birthday)<= 5 || dateAge(birthday) >= 12) {
    return res.render("pages/formAddStudent.twig", {
      error: "L'âge de l'éleve doit être compris entre 5 et 12 ans",
    });
  }
  try {
 
    await createStudent(lastname, firstname,new Date(birthday), Number(school_id));
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error.message);
    res.render("pages/dashboardDirector.twig", {
      title: "Tableau de bord",
      error,
    });
  }
}

export async function affectClassroomToStudent(req,res){
  const {student_id,classroom_id} = req.body
  const confirm_Student = req.body.confirm === "true"
  
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

    await affectClassroom(Number(student_id),Number(classroom_id))
    res.redirect("/dashboardDirector");
  } catch (error) {
    console.log(error);
    res.render("pages/dashboardDirector.twig", {
      tile: "Tableau de bord",
      error,
    });
  }
}
