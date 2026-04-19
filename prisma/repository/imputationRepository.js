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

export async function getUpdateImputation(id){
  return await prisma.imputation.findUnique({
    where : {id : id}
  })
}

export async function updateImputation(id, isPresent) {
  return await prisma.imputation.update({
    where: { id: id },
    data: {
      isPresent: isPresent,
    },
  });
}

