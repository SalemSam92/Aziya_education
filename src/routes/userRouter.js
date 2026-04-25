import express from "express"
import { deleteAffectProf, deleteProf, getCalendar, getChangePassword, getDashboardDirector, getDashboarProfessor, getLandingPage, getLogin, getManagementProfessor, getRegisterDirector, getUpdate, logout, postCalendar, postChangePassword, postCreateProfessor, postListStudentByProfessor, postLogin, postRegisterDirector, postUpdate } from "../controllers/userController.js"
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

//Gestion mot de passe oublié
userRouter.get("/changePassword",getChangePassword)
userRouter.post("/changePassword",postChangePassword)


//Gestion tableau de bord (Directeur)
userRouter.get("/dashboardDirector",authguard,verifieRoleDirector, getDashboardDirector)
userRouter.post("/dashboardDirector/:school_id/createProfessor",authguard,verifieRoleDirector,postCreateProfessor)
userRouter.get("/professor",authguard,verifieRoleDirector,getManagementProfessor)
userRouter.post("/professor/:professor_id/deleteProfessor",authguard,verifieRoleDirector,deleteProf)
userRouter.get("/professor/:professor_id/updateProfessor",authguard,verifieRoleDirector,getUpdate)
userRouter.post("/professor/:professor_id/updateProfessor",authguard,verifieRoleDirector,postUpdate)
userRouter.post("/dashboardDirector/:professor_id/deleteAffectation",authguard,verifieRoleDirector,deleteAffectProf)

//Gestion Accès tableau de bord (Professeur)
userRouter.get("/dashboardProfessor",authguard, verifieRolePorfessor,getDashboarProfessor)
userRouter.post("/dashboardProfessor",authguard,verifieRolePorfessor,postListStudentByProfessor)
userRouter.post("/dashboardProfessor/:student",authguard,verifieRolePorfessor,postCalendar)
// Route pour FullCalendar
userRouter.get("/calendar/:student_id",authguard,verifieRolePorfessor,getCalendar)



//Route logout
userRouter.get("/logout",authguard,logout)


  