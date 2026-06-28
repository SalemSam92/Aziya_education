// Vérifie si l'âge de l'élève est supérieur ou égal à 6 ans.

export function dateAge(birthday){// Calcul de l'âge en années
    const birth = new Date(birthday)// Convertit la date de naissance en objet Date
    const today = new Date()// Récupère la date actuelle
    return today.getFullYear()- birth.getFullYear()// Calcule la différence entre l'année actuelle et l'année de naissance pour obtenir l'âge en années
}