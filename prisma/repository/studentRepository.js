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
      classroom : true
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
