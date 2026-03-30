import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js";

export const prisma = new PrismaClient({ adapter });

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

export async function login(mail) {
  return prisma.user.findUnique({
    where: {
      mail: mail,
    },
  });
}

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

export async function selectProfessor(school_id){
  return await prisma.user.findMany({
    select :{
      id : true,
      lastname :true,
      firstname : true,
      mail : true,
      role : true,

    },where :{
      role : "PROFESSOR",
      school_id : school_id
    },
    orderBy :{
      lastname :"asc"
    }
  })
}

export async function nbProfessor(school_id){
  return await prisma.user.count({
   where :{
    school_id : school_id,
    role : "PROFESSOR",
   }
  })
}
