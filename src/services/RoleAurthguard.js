import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";


export const prisma = new PrismaClient({adapter})

export async function getRoleLogin(req, res,next) {
    try {
         const userRole = await prisma.user.findUnique({
    select: {
      role: true,
    },
    where: {
      id: req.session.userId,
    },
  });

  if ((userRole.role == "DIRECTOR")) {
    return res.redirect("/dashboardDirector");
  }

  if ((userRole.role == "PROFESSOR")) {
    return res.redirect("/dashboardProfessor");
  }
  next()

    } catch (error) {
        console.log(error.message);
        res.redirect("/login")
        
    }
 
}
