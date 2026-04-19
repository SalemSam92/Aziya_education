import express from "express"
import { authguard } from "../services/authguardUser.js"
import { verifieRolePorfessor } from "../services/professorOnly.js"
import { getUpdate, newImputation, postUpdate, } from "../controllers/imputationController.js"

export const imputationRouter = express.Router()

imputationRouter.post("/imputation",authguard,verifieRolePorfessor,newImputation)
imputationRouter.get("/imputation/update/:id",authguard,verifieRolePorfessor,getUpdate)
imputationRouter.post("/imputation/update/:id",authguard,verifieRolePorfessor,postUpdate)