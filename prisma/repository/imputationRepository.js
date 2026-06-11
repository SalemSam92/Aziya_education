import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

// Crée une imputation de présence pour un élève.
export async function createImputation(isPresent, student_id) {
  return await prisma.imputation.create({
    data: {
      isPresent: isPresent,
      student_id: student_id,
    },
  });
}

// Récupère une imputation par son id.
export async function getUpdateImputation(id) {
  return await prisma.imputation.findUnique({
    where: { id: id },
  });
}

// Met à jour le statut de présence d'une imputation.
export async function updateImputation(id, isPresent) {
  return await prisma.imputation.update({
    where: { id: id },
    data: {
      isPresent: isPresent,
    },
  });
}

// Vérifie si un élève a déjà une imputation pour le jour courant.
export async function imputationByStudent(student_id) {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  return await prisma.imputation.findFirst({ // findFirst est utilisé car la requête filtre sur plusieurs champs (élève + date du jour) et, faute de clé unique, il renvoie simplement null s’il nexiste aucune imputation.
    where: {
      student_id: student_id,
      dateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
}

// Récupère toutes les imputations d'un élève pour le calendrier d'absences.
export async function listImputationsByStudent(id) {
  return await prisma.imputation.findMany({
    where: { student_id: id },
  });
}

