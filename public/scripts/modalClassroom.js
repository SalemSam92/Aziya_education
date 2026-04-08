const buttons = document.querySelectorAll(".buttons");
const btnClose = document.querySelector(".closeModal");
const modalListStudent = document.querySelector(".modal-listStudent");
console.log(buttons);


buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.classroomId;
    window.location.href = `/classroom?id=${id}`;
  });
});

btnClose.addEventListener("click", (e) => {
  modalListStudent.style.display = "none";
});
