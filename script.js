```javascript
/* 🎵 MUSIQUES */

const audioPlayer = document.getElementById("audioPlayer");

const musiquesTravail = [
  "travail.mp3",
  "travail2.mp3",
  "travail3.mp3"
];

const musiquePause = "pause.mp3";

let musiqueTravailIndex = 0;


/* ⏱️ DURÉES */

let workDuration = 50 * 60;
let shortDuration = 10 * 60;

let currentTime = workDuration;
let currentMode = "work";

let timerInterval = null;
let isRunning = false;

let sessionsCompleted = 0;


/* 🎀 ÉLÉMENTS HTML */

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");
const shortBtn = document.getElementById("shortBtn");
const resetBtn = document.getElementById("resetBtn");

const sessionsDisplay = document.getElementById("sessions");


/* 🎵 MUSIQUE DE TRAVAIL */

function lancerMusiqueTravail() {

  audioPlayer.loop = false;

  audioPlayer.src =
    musiquesTravail[musiqueTravailIndex];

  audioPlayer.currentTime = 0;

  audioPlayer.play().catch(() => {});

}


/* 🌸 MUSIQUE DE PAUSE */

function lancerMusiquePause() {

  audioPlayer.loop = true;

  audioPlayer.src = musiquePause;

  audioPlayer.currentTime = 0;

  audioPlayer.play().catch(() => {});

}


/* ⏸️ PAUSE MUSIQUE */

function mettreMusiqueEnPause() {

  audioPlayer.pause();

}


/* 🛑 ARRÊTER MUSIQUE */

function arreterMusique() {

  audioPlayer.pause();

  audioPlayer.currentTime = 0;

}


/* 🎵 MUSIQUE SUIVANTE */

audioPlayer.addEventListener("ended", () => {

  if (currentMode === "work") {

    musiqueTravailIndex++;

    if (musiqueTravailIndex >= musiquesTravail.length) {

      musiqueTravailIndex = 0;

    }

    audioPlayer.src =
      musiquesTravail[musiqueTravailIndex];

    audioPlayer.currentTime = 0;

    if (isRunning) {

      audioPlayer.play().catch(() => {});

    }

  }

});


/* ⏱️ AFFICHER LE TEMPS */

function updateDisplay() {

  const minutes = Math.floor(currentTime / 60);

  const seconds = currentTime % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");

}


/* 🎀 METTRE À JOUR LES BOUTONS */

function updateButtons() {

  if (currentMode === "work") {

    if (isRunning) {

      startBtn.textContent = "❚❚ Pause";

    } else {

      startBtn.textContent = "▶ Démarrer 50 min";

    }

    shortBtn.textContent = "☕ Pause 10 min";

  }


  else if (currentMode === "short") {

    startBtn.textContent = "▶ Démarrer 50 min";

    if (isRunning) {

      shortBtn.textContent = "❚❚ Pause 10 min";

    } else {

      shortBtn.textContent = "▶ Reprendre pause";

    }

  }

}


/* ▶️ DÉMARRER / PAUSE / REPRENDRE */

function toggleTimer() {

  /* Si le timer fonctionne → PAUSE */

  if (isRunning) {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    mettreMusiqueEnPause();

    updateButtons();

    return;

  }


  /* Sinon → DÉMARRER ou REPRENDRE */

  isRunning = true;

  updateButtons();


  /* 🎵 Lancer ou reprendre la musique */

  if (currentMode === "work") {

    if (
      !audioPlayer.src ||
      audioPlayer.src === window.location.href
    ) {

      lancerMusiqueTravail();

    } else {

      audioPlayer.play().catch(() => {});

    }

  }

  else {

    if (
      !audioPlayer.src ||
      audioPlayer.src === window.location.href
    ) {

      lancerMusiquePause();

    } else {

      audioPlayer.play().catch(() => {});

    }

  }


  /* ⏱️ LANCER LE COMPTEUR */

  timerInterval = setInterval(() => {

    currentTime--;

    updateDisplay();


    /* ⏰ FIN DU MINUTEUR */

    if (currentTime <= 0) {

      clearInterval(timerInterval);

      timerInterval = null;

      isRunning = false;

      mettreMusiqueEnPause();


      /* 🌸 FIN DU TRAVAIL */

      if (currentMode === "work") {

        sessionsCompleted++;

        sessionsDisplay.textContent =
          "Sessions terminées : " +
          sessionsCompleted;

        alert(
          "Bravo ! Temps de travail terminé 🌸"
        );

        setMode("short");

        /* La pause démarre automatiquement */

        toggleTimer();

      }


      /* ☕ FIN DE LA PAUSE */

      else {

        alert(
          "Pause terminée ! On reprend doucement ✨"
        );

        setMode("work");

        /* Le travail redémarre automatiquement */

        toggleTimer();

      }

    }

  }, 1000);

}


/* 🔄 CHANGER DE MODE */

function setMode(mode) {

  clearInterval(timerInterval);

  timerInterval = null;

  isRunning = false;

  mettreMusiqueEnPause();

  currentMode = mode;


  if (mode === "work") {

    currentTime = workDuration;

    musiqueTravailIndex = 0;

    audioPlayer.src =
      musiquesTravail[musiqueTravailIndex];

  }


  else if (mode === "short") {

    currentTime = shortDuration;

    audioPlayer.src = musiquePause;

    audioPlayer.loop = true;

  }


  updateDisplay();

  updateButtons();

}


/* 🔄 RÉINITIALISER */

function resetTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  isRunning = false;

  mettreMusiqueEnPause();

  currentMode = "work";

  currentTime = workDuration;

  musiqueTravailIndex = 0;

  audioPlayer.src =
    musiquesTravail[musiqueTravailIndex];

  updateDisplay();

  updateButtons();

}


/* 🎀 BOUTON 50 MIN */

startBtn.addEventListener("click", () => {

  /*
    Si on est en pause de 10 min,
    cliquer sur Démarrer 50 min
    recommence un nouveau Pomodoro.
  */

  if (currentMode !== "work") {

    setMode("work");

  }

  toggleTimer();

});


/* ☕ BOUTON PAUSE 10 MIN */

shortBtn.addEventListener("click", () => {

  /*
    Si on est actuellement en travail,
    on démarre une nouvelle pause de 10 min.
  */

  if (currentMode !== "short") {

    setMode("short");

    toggleTimer();

  }

  /*
    Si on est déjà dans la pause,
    le bouton sert à PAUSE / REPRENDRE.
  */

  else {

    toggleTimer();

  }

});


/* 🚀 AFFICHAGE INITIAL */

updateDisplay();

updateButtons();
```
