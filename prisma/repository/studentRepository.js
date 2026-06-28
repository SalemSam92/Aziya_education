import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

// Crée un élève pour une école donnée.
export async function createStudent(lastname, firstname, birthday, school_id) {
  return await prisma.student.create({
    data: {
      lastname,
      firstname,
      birthday,
      school: {
        connect: { id: school_id },
      },
    },
  });
}

// Récupère les étudiants d'une école avec leur classe.
export async function selectStudent(school_id) {
  return await prisma.student.findMany({
    select: {
      id: true,
      lastname: true,
      firstname: true,
      birthday: true,
      classroom: true,
    },
    where: {
      school_id: school_id,
    },
    orderBy: { lastname: "asc" },
  });
}

// Compte le nombre d'élèves d'une école.
export async function nbStudent(school_id) {
  return await prisma.student.count({
    where: {
      school_id: school_id,
    },
  });
}

// Affecte un élève à une classe.
export async function affectClassroom(id, classroom_id) {
  return await prisma.student.update({
    data: {
      classroom_id,
    },
    where: { id: id },
  });
}

// Récupère les élèves d'une école avec leur classe complète.utilisée pour l'affichage dans la vue de gestion des élèves dans userContoller. 
export async function studentAddClassroom(school_id) {
  return await prisma.student.findMany({
    where: { school_id: school_id },
    include: {
      classroom: true,
    },
    orderBy: {
      lastname: "asc",
    },
  });
}

// // Récupère la classe d'un élève par son id.utilsée pour l'affichage dans la vue de gestion des élèves. 
// export async function nbClassroomForStudent(id) {
//   return await prisma.student.findUnique({
//     select: {
//       classroom_id: true,
//     },
//     where: {
//       id: id,
//     },
//   });
// }

// Récupère le nombre d'élèves par classe pour une école donnée.utilisé dans le userController pour l'affichage dans la vue de gestion des élèves
export async function nbStudentClassroom(school_id) {
  return await prisma.student.groupBy({ 
    by: ["classroom_id"],// Groupement par l'identifiant de la classe
    where: { school_id },// Filtrage par l'identifiant de l'école
    _count: { id: true },// Comptage du nombre d'élèves par classe gârce à l'ID de l'élève
  });
}

// Met à jour les informations d'un élève.
export async function postUpdateStudent(
  id,
  lastname,
  firstname,
  birthday,
  classroom_id,
) {
  return await prisma.student.update({
    data: {
      lastname,
      firstname,
      birthday,
      classroom_id,
    },
    where: { id: id },
  });
}

// Retire un élève de sa classe.
export async function deleteAffectation(id, classroom_id) {
  return await prisma.student.update({
    where: { id: id },
    data: {
      classroom: { disconnect: { id: classroom_id } },
    },
  });
}

// Supprime un élève.
export async function deleteStudent(id) {
  return await prisma.student.delete({
    where: { id: id },
  });
}

// Récupère les élèves d'une classe avec leurs imputations du jour.(dans la modalListStudent.twig)
export async function selectStudentByClassroom(classroom_id) {
  const today = new Date();

  // Début de journée
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  // Fin de journée
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.student.findMany({
    select: {
      id: true,
      lastname: true,
      firstname: true,
      birthday: true,
      classroom: true,
      // Récupération UNIQUEMENT l’imputation du jour
      imputations: {
        where: {
          dateTime: { // Filtrer les imputations par date
            gte: startOfDay, // Filtrer les imputations dont la date est supérieure ou égale au début de la journée
            lte: endOfDay, // Filtrer les imputations dont la date est inférieure ou égale à la fin de la journée
          },
        },
      },
    },
    where: {
      classroom_id: Number(classroom_id),
    },
    orderBy: { lastname: "asc" },
  });
}

// Récupère un élève par son id pour l'update de l'imputation
export async function selectStudentById(id) {
  return await prisma.student.findUnique({
    where: { id: id },
  });
}
