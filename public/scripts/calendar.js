 const calendarEl = document.querySelector("#calendar");


document.addEventListener("DOMContentLoaded",()=>{
    if (!calendarEl) return; // sécurité

    // récupérer l’ID de l’élève à partir du HTML.
    const studentId = calendarEl.dataset.student; 

    //Instancier un calendrier grâce à new FullCalendar.Calendar présent dans le Calendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // un calendrier par défaut mensuel en grille
        locale: 'fr',  // mettre tout en français
        events: `/calendar/${studentId}`// chercher les événements via une URL
    });
   
    calendar.render();  // afficher le calendrier dans la page.
})