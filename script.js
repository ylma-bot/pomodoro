
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
let longDuration = 20 * 60;

let currentTime = workDuration;
let currentMode = "work";
let timerInterval = null;
let isRunning = false;
let sessionsCompleted = 0;


/* 🎀 ÉLÉMENTS HTML */

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const shortBtn = document.getElementById("shortBtn");
const sessionsDisplay = document.getElementById("sessions");


/* 🎵 MUSIQUE DE TRAVAIL */

function lancerMusiqueTravail() {

  audioPlayer.loop = false;

  audioPlayer.src = musiquesTravail[musiqueTravailIndex];

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
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");

}


/* 🛑 ARRÊTER LE TIMER */

function stopTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  isRunning = false;

  mettreMusiqueEnPause();

  startBtn.textContent = "Démarrer";

}


/* ▶️ DÉMARRER LE TIMER */

function startTimer() {

  if (isRunning) return;

  isRunning = true;

  startBtn.textContent = "En cours...";

  pauseBtn.textContent = "Pause";

  if (currentMode === "work") {

    if (!audioPlayer.src ||
        audioPlayer.src === window.location.href) {

      lancerMusiqueTravail();

    } else {

      audioPlayer.play().catch(() => {});

    }

  } else {

    if (!audioPlayer.src ||
        audioPlayer.src === window.location.href) {

      lancerMusiquePause();

    } else {

      audioPlayer.play().catch(() => {});

    }

  }


  timerInterval = setInterval(() => {

    currentTime--;

    updateDisplay();

    if (currentTime <= 0) {

      stopTimer();

      if (currentMode === "work") {

        sessionsCompleted++;

        sessionsDisplay.textContent =
          "Sessions terminées : " + sessionsCompleted;

        alert("Bravo ! Temps de travail terminé 🌸");

        setMode("short");

      } else {

        alert("Pause terminée ! On reprend doucement ✨");

        setMode("work");

      }

    }

  }, 1000);

}


/* ⏸️ PAUSE */

function pauseTimer() {

  if (!isRunning) return;

  clearInterval(timerInterval);

  timerInterval = null;

  isRunning = false;

  mettreMusiqueEnPause();

  startBtn.textContent = "Reprendre";

  pauseBtn.textContent = "Pause";

}


/* 🔄 CHANGER DE MODE */

function setMode(mode) {

  stopTimer();

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

  }

  else if (mode === "long") {

    currentTime = longDuration;

    audioPlayer.src = musiquePause;

  }

  updateDisplay();

}


/* 🔄 RESET */

function resetTimer() {

  stopTimer();

  if (currentMode === "work") {

    currentTime = workDuration;

    musiqueTravailIndex = 0;

    audioPlayer.src =
      musiquesTravail[musiqueTravailIndex];

  }

  else if (currentMode === "short") {

    currentTime = shortDuration;

  }

  else if (currentMode === "long") {

    currentTime = longDuration;

  }

  updateDisplay();

}


/* 🎀 BOUTONS */

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);

shortBtn.addEventListener("click", () => {
  setMode("short");
  startTimer();
});


/* 🚀 AFFICHAGE INITIAL */

updateDisplay();
