import express from "express"
import { affectClassroomToStudent, postCreateStudent } from "../controllers/studentController.js"

export const studentRouter = express.Router()


studentRouter.post("/dashboardDirector/:school_id/createStudent",postCreateStudent)
studentRouter.post("/dashboardDirector/affect",affectClassroomToStudent)

// studentRouter.get()
// studentRouter.post()