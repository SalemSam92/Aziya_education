import express from "express"
import { affectProfessorToClassroom, deleteClass, disconnectClass, getManagementClassroom, postCreateClassroom, postUpdate } from "../controllers/classroomController.js"
import { authguard } from "../services/authguardUser.js"
import { verifieRoleDirector } from "../services/roleMiddleware.js"






export const classroomRouter =express.Router()


// classroomRouter.get("/dashboardDirector",authguard,getDashboardDirector)
classroomRouter.post("/dashboardDirector/:school_id/createClassroom",authguard,verifieRoleDirector,postCreateClassroom)
classroomRouter.post("/dashboardDirector",authguard,verifieRoleDirector,affectProfessorToClassroom)
classroomRouter.get("/classroom",authguard,verifieRoleDirector,getManagementClassroom)
classroomRouter.post("/classroom/:id/deleteClassroom",authguard,verifieRoleDirector,deleteClass)
classroomRouter.get("/classroom/:id/updateClassroom",authguard,verifieRoleDirector,getManagementClassroom)
classroomRouter.post("/classroom/:id/updateClassroom",authguard,verifieRoleDirector,postUpdate)
classroomRouter.post("/classroom/:id/deleteAffectation",authguard,verifieRoleDirector,disconnectClass)
