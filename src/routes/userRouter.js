import express from "express"
import { deleteProf, getDashboardDirector, getDashboarProfessor, getLandingPage, getLogin, getManagementProfessor, getRegisterDirector, getUpdate, postCreateProfessor, postLogin, postRegisterDirector, postUpdate } from "../controllers/userController.js"
import { getRoleLogin } from "../services/RoleAurthguard.js"
import { authguard } from "../services/authguardUser.js"
import { verifieRoleDirector } from "../services/directorOnly.js"
import { verifieRolePorfessor } from "../services/professorOnly.js"



export const userRouter = express.Router()

//Accès LandingPage
userRouter.get("/",getLandingPage)

//Gestion inscription Directeur
userRouter.get("/register",getRegisterDirector)
userRouter.post("/register",postRegisterDirector)

//Gestion connexion directeur/professeur
userRouter.get("/login",getLogin)
userRouter.post("/login",postLogin,getRoleLogin)


//Gestion Accès tableau de bord (Directeur)
userRouter.get("/dashboardDirector",authguard,verifieRoleDirector, getDashboardDirector)
userRouter.post("/dashboardDirector/:school_id/createProfessor",postCreateProfessor)
userRouter.get("/professor",authguard,verifieRoleDirector,getManagementProfessor)
userRouter.post("/professor/:professor_id/deleteProfessor",authguard,verifieRoleDirector,deleteProf)
userRouter.get("/professor/:professor_id/updateProfessor",authguard,verifieRoleDirector,getUpdate)
userRouter.post("/professor/:professor_id/updateProfessor",authguard,verifieRoleDirector,postUpdate)




//Gestion Accès tableau de bord (Professeur)
userRouter.get("/dashboardProfessor",authguard, verifieRolePorfessor,getDashboarProfessor)

  