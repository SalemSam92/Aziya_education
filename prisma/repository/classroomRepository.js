import { PrismaClient } from "../../src/generated/prisma/client.js";
import { adapter } from "../adapter.js"

export const prisma = new PrismaClient({adapter})

export async function createClassroom(name,nbMaxStudent,school_id){
    return await prisma.classroom.create({
        data :{
            name, 
            nbMaxStudent,
            school :{
                connect :{id : school_id}
            }
        }
    })
}

export async function selectClassroom(school_id){
    return await prisma.classroom.findMany({
        select :{
            id :true,
            name : true,
            nbMaxStudent : true
            
        },
        where :{
            school_id : school_id
        },
        orderBy : {name : "asc"}
    })
}

export async function nbClassroom(school_id){
    return await prisma.classroom.count({
        where :{
            school_id : school_id,
        }
    })
}
export async function nbClassroomByProfessor(professor_id){
    //    console.log("nbClassroomByProfessor called with:", professor_id);
    return await prisma.classroom.count({
        where :{
            professor_id : professor_id,
        }
    })
}

export async function nbStudentMaxByClassroom(school_id){
    return await prisma.classroom.findMany({
        where : {school_id : school_id},
       include : {student : true}, // equivant du classroom.student.length dans la page twig
        orderBy : {name : "asc"}
    })
}

export async function affectProfessor(professor_id,id){
  return await prisma.classroom.update({
    data:{
        professor_id  
        
    },
    where :{
       id : id
    }
  })
}

export async function classroomWithProfessor(school_id){
    return await prisma.classroom.findMany({
        include : {
            user :true
        },
        where : {
            school_id:school_id
        },
        
      
    })
}

export async function countStudent(school_id){
    return await prisma.classroom.count({
        where : {school_id : school_id},
        
    })
    
}

