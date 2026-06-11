import jwt from "jsonwebtoken";

export function generateToken(professor_id) {
  return jwt.sign(                                    // Génère un token JWT signé
    { id: professor_id },                            // Payload : on met l'ID de l'employé dans le token
    process.env.JWT_SECRET, {                       // Clé secrète utilisée pour signer le token
    expiresIn: "24h",                              // Durée de validité du token : 24 heures
  });
}

export function verifieToken(token) {
  return jwt.verify(                                // Vérifie et décode un token JWT
    token,                                         // Le token reçu (string)
    process.env.JWT_SECRET,                       // Clé secrète pour valider la signature
  );
}
