import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

export async function createImputation(isPresent, student_id) {
  return await prisma.imputation.create({
    data: {
      isPresent: isPresent,
      student_id: student_id,
    },
  });
}

export async function getUpdateImputation(id) {
  return await prisma.imputation.findUnique({
    where: { id: id },
  });
}

export async function updateImputation(id, isPresent) {
  return await prisma.imputation.update({
    where: { id: id },
    data: {
      isPresent: isPresent,
    },
  });
}


//Fonction pour empecher les doublons d'imputation
export async function imputationByStudent(student_id) {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  return await prisma.imputation.findFirst({ // Recherche la première imputation du jour pour cet élève. findFirst() est utilisé car la requête filtre sur plusieurs champs.
    where: {
      student_id: student_id,
      dateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
}


//Récupérer les imputations d'un élève pour le FullCalendar
export async function listImputationsByStudent(id){
  return await prisma.imputation.findMany({
    where: { student_id: id }
  });
}

