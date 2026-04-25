const modal = document.querySelector(".modal-list-student");
const modalCalendar = document.querySelector(".modal-list-calendar")
const btnClose = document.querySelector("#close");


console.log(btnClose);


document.addEventListener("DOMContentLoaded", () => {
  modal.style.display = "flex";   //DOMContentLoaded sert à attendre que le HTML soit prêt
});


btnClose.addEventListener("click", (e) => {
  // modal.style.display = "none";
  window.location.href = "/dashboardProfessor"
});


