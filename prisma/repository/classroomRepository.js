import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

// Crée une nouvelle classe pour une école.
export async function createClassroom(name, nbMaxStudent, school_id) {
  return await prisma.classroom.create({
    data: {
      name,
      nbMaxStudent,
      school: {
        connect: { id: school_id },
      },
    },
  });
}

// Récupère les classes d'une école avec leurs informations de base.
export async function selectClassroom(school_id) {
  return await prisma.classroom.findMany({
    select: {
      id: true,
      name: true,
      nbMaxStudent: true,
    },
    where: {
      school_id: school_id,
    },
    orderBy: { name: "asc" },
  });
}

// Compte le nombre de classes pour une école.
export async function nbClassroom(school_id) {
  return await prisma.classroom.count({
    where: {
      school_id: school_id,
    },
  });
}

// Compte les classes d'un professeur.
export async function nbClassroomByProfessor(professor_id) {
  //    console.log("nbClassroomByProfessor called with:", professor_id);
  return await prisma.classroom.count({
    where: {
      professor_id: professor_id,
    },
  });
}

// Charge les classes d'une école et leurs élèves associés.
export async function nbStudentMaxByClassroom(school_id) {
  return await prisma.classroom.findMany({
    where: { school_id: school_id },
    include: { student: true }, // equivant du classroom.student.length dans la page twig
    orderBy: { name: "asc" },
  });
}

// Assigne un professeur à une classe.
export async function affectProfessor(professor_id, id) {
  return await prisma.classroom.update({
    data: {
      professor_id,
    },
    where: {
      id: id,
    },
  });
}

// Récupère les classes d'une école avec les données du professeur.
export async function classroomWithProfessor(school_id) {
  return await prisma.classroom.findMany({
    include: {
      user: true,
    },
    where: {
      school_id: school_id,
    },
    orderBy: { name: "asc" },
  });
}

// Récupère les classes attribuées à un professeur.
export async function classroom(professor_id) {
  return await prisma.classroom.findMany({
    include: {
      user: true,
    },
    where: {
      professor_id: professor_id,
    },
    orderBy: { name: "desc" },
  });
}

// Déconnecte le professeur d'une classe donnée.
export async function deleteAffectationProf(id, professor_id) {
  return await prisma.classroom.update({
    where: { id: id },
    data: {
      user: { disconnect: { id: professor_id } },
    },
  });
}

// Compte le nombre de classes d'une école (redondant avec nbClassroom).
export async function countStudent(school_id) {
  return await prisma.classroom.count({
    where: { school_id: school_id },
  });
}

// Met à jour le nom et la capacité de la classe.
export async function postUpdateClassroom(id, name, nbMaxStudent) {
  return await prisma.classroom.update({
    data: {
      name,
      nbMaxStudent,
    },
    where: { id: id },
  });
}

// Supprime une classe.
export async function deleteClassroom(id) {
  return await prisma.classroom.delete({
    where: { id: id },
  });
}

// Récupère les élèves d'une classe spécifique.
export async function dipslayStudentByClassroom(school_id, id) {
  return await prisma.classroom.findUnique({
    where: { school_id: school_id, id: id },
    select: { student: true },
  });
}

// Retire un élève d'une classe.
export async function deleteAffectation(id, student_id) {
  return await prisma.classroom.update({
    where: { id: id },
    data: {
      student: { disconnect: { id: student_id } },
    },
  });
}

// Récupère tous les élèves des classes d'un professeur, triés par nom.
export async function studentsByProfessor(professor_id) {
  return await prisma.classroom.findMany({
    where: { professor_id: professor_id },
    select: {
      student: {
        orderBy: [{ lastname: "asc" }, { firstname: "asc" }],
      },
    },
  });
}
