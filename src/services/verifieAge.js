export function dateAge(birthday){
    const birth = new Date(birthday)
    const today = new Date()
    return today.getFullYear()- birth.getFullYear()
}