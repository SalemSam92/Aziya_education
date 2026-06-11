import express from "express"
import { authguard } from "../services/authguardUser.js"
import { getUpdate, newImputation, postUpdate, } from "../controllers/imputationController.js"
import { verifieRolePorfessor } from "../services/roleMiddleware.js"

export const imputationRouter = express.Router()

imputationRouter.post("/imputation",authguard,verifieRolePorfessor,newImputation)
imputationRouter.get("/imputation/update/:id",authguard,verifieRolePorfessor,getUpdate)
imputationRouter.post("/imputation/update/:id",authguard,verifieRolePorfessor,postUpdate)