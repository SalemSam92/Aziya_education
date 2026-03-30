import express from "express"
import { affectProfessorToClassroom, getManagementClassroom, postCreateClassroom } from "../controllers/classroomController.js"
import { authguard } from "../services/authguardUser.js"
import { verifieRoleDirector } from "../services/directorOnly.js"




export const classroomRouter =express.Router()


// classroomRouter.get("/dashboardDirector",authguard,getDashboardDirector)
classroomRouter.post("/dashboardDirector/:school_id/createClassroom",postCreateClassroom)
classroomRouter.post("/dashboardDirector",affectProfessorToClassroom)
classroomRouter.get("/classroom",authguard,verifieRoleDirector,getManagementClassroom)
