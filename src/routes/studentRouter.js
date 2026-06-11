import express from "express"
import { affectClassroomToStudent, deleteStud, disconnectClassroom, getManagementStudent, postCreateStudent, postUpdate } from "../controllers/studentController.js"
import { authguard } from "../services/authguardUser.js"
import { verifieRoleDirector } from "../services/roleMiddleware.js"


export const studentRouter = express.Router()


studentRouter.post("/dashboardDirector/:school_id/createStudent",authguard,verifieRoleDirector,postCreateStudent)
studentRouter.post("/dashboardDirector/affect",authguard,verifieRoleDirector,affectClassroomToStudent)
studentRouter.get("/student",authguard,verifieRoleDirector,getManagementStudent)
studentRouter.post("/student/:id/deleteStudent",authguard,verifieRoleDirector,deleteStud)
studentRouter.get("/student/:id/updateStudent",authguard,verifieRoleDirector,getManagementStudent)
studentRouter.post("/student/:id/updateStudent",authguard,verifieRoleDirector,postUpdate)
studentRouter.post("/student/:id/deleteAffectation",authguard,verifieRoleDirector,disconnectClassroom)
