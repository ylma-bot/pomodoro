// 🎵 MUSIQUES
const audioPlayer = document.getElementById("audioPlayer");

const musiquesTravail = [
  "https://ylma-bot.github.io/pomodoro/travail.mp3",
  "https://ylma-bot.github.io/pomodoro/travail2.mp3",
  "https://ylma-bot.github.io/pomodoro/travail3.mp3"
];

const musiquePause =
  "https://ylma-bot.github.io/pomodoro/pause.mp3";

let musiqueTravailIndex = 0;


// ⏱️ DURÉES
let workDuration = 50 * 60;
let shortDuration = 10 * 60;
let longDuration = 20 * 60;

let currentTime = workDuration;
let currentMode = "work";
let timerInterval = null;
let isRunning = false;
let sessionsCompleted = 0;


// 🎀 ÉLÉMENTS HTML
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const workBtn = document.getElementById("workBtn");
const shortBtn = document.getElementById("shortBtn");
const longBtn = document.getElementById("longBtn");
const sessionsDisplay = document.getElementById("sessions");
const applyBtn = document.getElementById("applyBtn");


// 🎵 LANCER LA MUSIQUE DE TRAVAIL
function lancerMusiqueTravail() {
  audioPlayer.loop = false;
  audioPlayer.src = musiquesTravail[musiqueTravailIndex];
  audioPlayer.currentTime = 0;

  audioPlayer.play().catch(() => {});
}


// 🌸 LANCER LA MUSIQUE DE PAUSE
function lancerMusiquePause() {
  audioPlayer.loop = true;
  audioPlayer.src = musiquePause;
  audioPlayer.currentTime = 0;

  audioPlayer.play().catch(() => {});
}


// ⏸️ METTRE LA MUSIQUE EN PAUSE
function mettreMusiqueEnPause() {
  audioPlayer.pause();
}


// 🛑 ARRÊTER LA MUSIQUE
function arreterMusique() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}


// 🎵 PASSER AUTOMATIQUEMENT À LA MUSIQUE SUIVANTE
audioPlayer.addEventListener("ended", () => {

  // Pendant le travail : passer à la musique suivante
  if (currentMode === "work") {

    musiqueTravailIndex++;

    // Après travail3 → retour à travail
    if (musiqueTravailIndex >= musiquesTravail.length) {
      musiqueTravailIndex = 0;
    }

    audioPlayer.src = musiquesTravail[musiqueTravailIndex];
    audioPlayer.currentTime = 0;

    if (isRunning) {
      audioPlayer.play().catch(() => {});
    }
  }

});


// ⏱️ AFFICHER LE TEMPS
function updateDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}


// 🛑 ARRÊTER LE TIMER
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;

  startBtn.textContent = "▶ Démarrer";

  mettreMusiqueEnPause();
}


// ▶️ DÉMARRER / PAUSE
function startTimer() {

  // Si le timer fonctionne déjà → pause
  if (isRunning) {
    stopTimer();
    startBtn.textContent = "▶ Reprendre";
    return;
  }

  isRunning = true;
  startBtn.textContent = "Ⅱ Pause";

  // 🎵 Lancer la musique correspondant au mode
  if (audioPlayer.src === "" || audioPlayer.src === window.location.href) {

    if (currentMode === "work") {
      lancerMusiqueTravail();
    } else {
      lancerMusiquePause();
    }

  } else {
    audioPlayer.play().catch(() => {});
  }


  // ⏱️ Lancer le compte à rebours
  timerInterval = setInterval(() => {

    currentTime--;
    updateDisplay();

    // Fin du temps
    if (currentTime <= 0) {

      stopTimer();

      if (currentMode === "work") {

        sessionsCompleted++;
        sessionsDisplay.textContent = sessionsCompleted;

        alert("Bravo ! Temps de travail terminé 🌸");

        setMode("short");

      } else {

        alert("Pause terminée ! On reprend doucement ✨");

        setMode("work");

      }

    }

  }, 1000);
}


// 🔄 CHANGER DE MODE
function setMode(mode) {

  stopTimer();

  currentMode = mode;

  if (mode === "work") {

    currentTime = workDuration;

    // On recommence la playlist au premier morceau
    musiqueTravailIndex = 0;

    audioPlayer.src = musiquesTravail[musiqueTravailIndex];

  } else if (mode === "short") {

    currentTime = shortDuration;

    audioPlayer.src = musiquePause;

  } else if (mode === "long") {

    currentTime = longDuration;

    audioPlayer.src = musiquePause;

  }

  updateDisplay();
}


// 🔄 RESET
function resetTimer() {

  stopTimer();

  if (currentMode === "work") {
    currentTime = workDuration;
    musiqueTravailIndex = 0;
  }

  else if (currentMode === "short") {
    currentTime = shortDuration;
  }

  else if (currentMode === "long") {
    currentTime = longDuration;
  }

  updateDisplay();

}


// 🎀 BOUTONS
startBtn.addEventListener("click", startTimer);

resetBtn.addEventListener("click", resetTimer);


workBtn.addEventListener("click", () => {
  setMode("work");
});


shortBtn.addEventListener("click", () => {
  setMode("short");
});


longBtn.addEventListener("click", () => {
  setMode("long");
});


// ⚙️ MODIFICATION DES DURÉES
applyBtn.addEventListener("click", () => {

  const workInput =
    Number(document.getElementById("workTime").value);

  const shortInput =
    Number(document.getElementById("shortTime").value);

  const longInput =
    Number(document.getElementById("longTime").value);


  if (workInput > 0 && shortInput > 0 && longInput > 0) {

    workDuration = workInput * 60;
    shortDuration = shortInput * 60;
    longDuration = longInput * 60;

    setMode(currentMode);

    alert("Les durées ont été mises à jour 🌷");

  } else {

    alert("Entre des durées valides.");

  }

});


// 🚀 AFFICHAGE INITIAL
updateDisplay();
