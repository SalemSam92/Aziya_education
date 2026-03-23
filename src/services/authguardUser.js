import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";

export const prisma = new PrismaClient({ adapter });

export async function authguard(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  try {
    const user = await prisma.user.findUnique({
      select: {
        lastname: true,
        firstname: true,
        mail: true,
        school: true,
        role: true,
        school_id : true,
        classroom : true,
        id : true
      },
      where: {
        id: req.session.userId,
      },
    });

    req.session.user = user;

    next()
  } catch (error) {
    console.log(error.message);
    res.render("pages/login.twig", {
      title: "Connexion",
      errorAccess:
        "Vous ne pouvez pas accéder à cette page sans vous identifier",
    });
  }
}
