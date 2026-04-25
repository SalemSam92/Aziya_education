import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

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

export async function nbStudent(school_id) {
  return await prisma.student.count({
    where: {
      school_id: school_id,
    },
  });
}

export async function affectClassroom(id, classroom_id) {
  // console.log("Avant update:", { student_id: id, classroom_id });

  return await prisma.student.update({
    data: {
      classroom_id,
    },
    where: { id: id },
  });
}

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

export async function nbClassroomForStudent(id) {
  return await prisma.student.findUnique({
    select: {
      classroom_id: true,
    },
    where: {
      id: id,
    },
  });
}

 // Pour afficher le nb d'élève dans chaque classe dans la page classroom.twig
export async function nbStudentClassroom(school_id) {
  return await prisma.student.groupBy({
    by: ["classroom_id"],
    where: { school_id },
    _count: { id: true },
  });
}


export async function postUpdateStudent(id,lastname,firstname,birthday,classroom_id){
  return await prisma.student.update({
    data :{
      lastname,
      firstname,
      birthday,
      classroom_id
    },
    where :{id : id}
  })
}

export async function deleteAffectation(id,classroom_id) {
  return await prisma.student.update({
    where: { id: id },
    data: {
      classroom: {disconnect : {id :classroom_id}}
    },
  });
}
export async function deleteStudent(id) {
  return await prisma.student.delete({
    where: { id: id },
  });
}


// Afficher la liste des élèves dans la modal du dashboardProfessor et pour gerer l'update de l'imputation dans le get grâce à "imputations : true"
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
      imputations : {
        where :{
          dateTime : {
            gte : startOfDay,
            lte : endOfDay
          }
        }
      }
    },
    where: {
      classroom_id: Number(classroom_id),
    },
    orderBy: { lastname: "asc" },
  });
}

// Pour gerer l'update de l'imputation dans le get (controller) et récupérer un élève 
export async function selectStudentById(id) {
  return await prisma.student.findUnique({
    where : {id : id}
  })
}