import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

// Crée un directeur et son établissement associé.
export async function registerDirector(
  schoolName,
  siret,
  lastname,
  firstname,
  mail,
  password,
) {
  return await prisma.user.create({
    data: {
      school: {
        create: {
          name: schoolName,
          siret,
        },
      },
      lastname,
      firstname,
      mail,
      password,
      role: "DIRECTOR",
    },
  });
}

// Retourne l'utilisateur correspondant à l'email pour la connexion.
export async function login(mail) {
  return prisma.user.findUnique({
    where: {
      mail: mail,
    },
  });
}

// Change le mot de passe d'un professeur par son id.
export async function ChangePasswordById(professor_id, password) {
  return await prisma.user.update({
    where: { id: professor_id },
    data: { password },
  });
}

// Change le mot de passe d'un utilisateur par son email.
export async function ChangePassword(mail, password) {
  return await prisma.user.update({
    where: { mail: mail },
    data: { password },
  });
}

// Crée un professeur attaché à une école existante.
export async function createProfessor(
  lastname,
  firstname,
  mail,
  password,
  school_id,
) {
  return await prisma.user.create({
    data: {
      lastname,
      firstname,
      mail,
      password,
      role: "PROFESSOR",
      school: {
        connect: { id: school_id },
      },
    },
  });
}

// Récupère la liste des professeurs d'une école.
export async function selectProfessor(school_id) {
  return await prisma.user.findMany({
    select: {
      id: true,
      lastname: true,
      firstname: true,
      mail: true,
      role: true,
    },
    where: {
      role: "PROFESSOR",
      school_id: school_id,
    },
    orderBy: {
      lastname: "asc",
    },
  });
}

// Compte le nombre de professeurs pour une école.
export async function nbProfessor(school_id) {
  return await prisma.user.count({
    where: {
      school_id: school_id,
      role: "PROFESSOR",
    },
  });
}

// Récupère les informations d'un professeur par son id.
export async function getUpdateProfessor(professor_id) {
  return await prisma.user.findUnique({
    where: { id: professor_id },
  });
}

// Met à jour le nom, le prénom et l'email d'un professeur.
export async function postUpdateProfessor(
  professor_id,
  lastname,
  firstname,
  mail,
) {
  return await prisma.user.update({
    data: {
      lastname,
      firstname,
      mail,
    },
    where: { id: professor_id },
  });
}

// Supprime un professeur par son id.
export async function deleteProfessor(professor_id) {
  return await prisma.user.delete({
    where: { id: professor_id },
  });
}
