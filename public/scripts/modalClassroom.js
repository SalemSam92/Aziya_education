const buttons = document.querySelectorAll(".buttons");
const btnClose = document.querySelector(".closeModal");
const modalListStudent = document.querySelector(".modal-listStudent");
console.log(buttons);

buttons.forEach((btn) => {
  // Au clic sur le bouton, récupère l'id de la classe et redirige vers la page avec cet id en paramètre
  btn.addEventListener("click", () => {
    // Récupère l'ID de la classe depuis l'attribut data-classroom-id du bouton
    const id = btn.dataset.classroomId;
    // Redirige vers /classroom en passant l'id de la classe comme paramètre de requête (?id=...)
    window.location.href = `/classroom?id=${id}`;
  });
});

// Ferme la modale au clic sur le bouton de fermeture
btnClose.addEventListener("click", (e) => {
  modalListStudent.style.display = "none";
});
