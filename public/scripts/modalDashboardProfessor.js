const modal = document.querySelector(".modal-list-student");
const btnClose = document.querySelector("#close");

document.addEventListener("DOMContentLoaded", () => {
  modal.style.display = "flex";   //DOMContentLoaded sert à attendre que le HTML soit prêt
});

btnClose.addEventListener("click", (e) => {
  modal.style.display = "none";
});
