export async function verifieRoleDirector(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.role !== "DIRECTOR") {
        return res.redirect("/login");
    }
    next()
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
}



export async function verifieRolePorfessor(req,res,next){
    try {
        if (!req.session.user) {
            return res.redirect("/login")
        }

        if (req.session.user.role !== "PROFESSOR") {
            return res.redirect("/login")
        }

        next()
        
    } catch (error) {
        console.log(error);
        res.redirect("/login")
        
    }
}