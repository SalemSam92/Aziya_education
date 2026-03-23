//partie User
export const schoolNameRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ&'().\- ]{2,40}$/
export const siretRegex = /^[0-9]{14}$/;
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
export const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const lastnameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
export const firstnameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/

//Partie classroom
export const nameClassroomRegex = /^(CP|CE1|CE2|CM1|CM2)\s[A-Z]$/
export const nbMaxStudentRegex = /^([0-9]|[1-2][0-9]|3[0-5])$/

//Partie Student

export const birthdayRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/



