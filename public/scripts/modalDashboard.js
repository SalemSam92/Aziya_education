const modalProfessor = document.querySelector(".modal-professor");
const modalClassroom = document.querySelector(".modal-classroom");
const modalStudent = document.querySelector(".modal-student");
const btnAddProfessor = document.querySelector("#btn-add-professor");
const btnAddClassroom = document.querySelector("#btn-add-classroom");
const btnAddStudent = document.querySelector("#btn-add-student");
const closeModalProfessor = document.querySelector("#close-modal-professor");
const closeModalClassroom = document.querySelector("#close-modal-classroom");
const closeModalStudent = document.querySelector("#close-modal-student");

console.log(modalProfessor, modalClassroom, modalStudent);

btnAddProfessor.addEventListener("click", (e) => {
  modalProfessor.style.display = "flex";
  modalClassroom.style.display = "none";
  modalStudent.style.display = "none";
});
btnAddClassroom.addEventListener("click", (e) => {
  modalClassroom.style.display = "flex";
  modalProfessor.style.display = "none";
  modalStudent.style.display = "none";
});
btnAddStudent.addEventListener("click", (e) => {
  modalStudent.style.display = "flex";
  modalProfessor.style.display = "none";
  modalClassroom.style.display = "none";
});
closeModalProfessor.addEventListener("click", (e) => {
  modalProfessor.style.display = "none";
});
closeModalClassroom.addEventListener("click", (e) => {
  modalClassroom.style.display = "none";
});
closeModalStudent.addEventListener("click", (e) => {
  modalStudent.style.display = "none";
});
