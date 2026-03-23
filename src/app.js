import express from "express"
import "dotenv/config"
import session from "express-session"
import { userRouter } from "./routes/userRouter.js"
import { studentRouter } from "./routes/studentRouter.js"
import { classroomRouter } from "./routes/classroom.Router.js"





const app = express()
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret : process.env.SECRET,
    resave : true,
    saveUninitialized : true
}))

app.use(userRouter)
app.use(classroomRouter)
app.use(studentRouter)

app.listen(process.env.PORT,(error)=>{
    error ? console.log(error) : console.log("serveur start");
    
    
})