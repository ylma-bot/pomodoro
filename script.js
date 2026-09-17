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


// 🎀 METTRE À JOUR LE TEXTE DES BOUTONS
function updateButtons() {

  if (currentMode === "work") {

    if (isRunning) {
      startBtn.textContent = "Ⅱ Pause";
    } else if (currentTime < workDuration) {
      startBtn.textContent = "▶ Reprendre";
    } else {
      startBtn.textContent = "▶ Démarrer";
    }

  } else if (currentMode === "short") {

    if (isRunning) {
      shortBtn.textContent = "Ⅱ Pause 10 min";
    } else if (currentTime < shortDuration) {
      shortBtn.textContent = "▶ Reprendre 10 min";
    } else {
      shortBtn.textContent = "☕ Pause 10 min";
    }

  } else if (currentMode === "long") {

    if (isRunning) {
      longBtn.textContent = "Ⅱ Pause 20 min";
    } else if (currentTime < longDuration) {
      longBtn.textContent = "▶ Reprendre 20 min";
    } else {
      longBtn.textContent = "Pause 20 min";
    }

  }
}


// 🛑 ARRÊTER LE TIMER
function stopTimer() {

  clearInterval(timerInterval);

  timerInterval = null;
  isRunning = false;

  mettreMusiqueEnPause();

  updateButtons();
}


// ▶️ DÉMARRER / PAUSE / REPRENDRE
function startTimer() {

  // ⏸️ Si le timer fonctionne déjà → pause
  if (isRunning) {

    clearInterval(timerInterval);

    timerInterval = null;
    isRunning = false;

    mettreMusiqueEnPause();

    updateButtons();

    return;
  }


  // ▶️ Sinon → démarrer ou reprendre
  isRunning = true;

  updateButtons();


  // 🎵 Lancer la musique correspondant au mode
  if (
    audioPlayer.src === "" ||
    audioPlayer.src === window.location.href
  ) {

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


    // 🏁 FIN DU TEMPS
    if (currentTime <= 0) {

      clearInterval(timerInterval);

      timerInterval = null;
      isRunning = false;

      mettreMusiqueEnPause();


      // 🌸 FIN DU TRAVAIL
      if (currentMode === "work") {

        sessionsCompleted++;

        sessionsDisplay.textContent =
          "Sessions terminées : " + sessionsCompleted;

        alert("Bravo ! Temps de travail terminé 🌸");

        setMode("short");

      }

      // ☕ FIN DE LA PAUSE
      else {

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


  // 💗 MODE TRAVAIL
  if (mode === "work") {

    currentTime = workDuration;

    musiqueTravailIndex = 0;

    audioPlayer.src =
      musiquesTravail[musiqueTravailIndex];

  }


  // ☕ PAUSE 10 MIN
  else if (mode === "short") {

    currentTime = shortDuration;

    audioPlayer.src = musiquePause;

  }


  // 🌸 PAUSE 20 MIN
  else if (mode === "long") {

    currentTime = longDuration;

    audioPlayer.src = musiquePause;

  }


  updateDisplay();
  updateButtons();
}


// 🔄 RÉINITIALISER
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

    audioPlayer.src = musiquePause;

  }


  else if (currentMode === "long") {

    currentTime = longDuration;

    audioPlayer.src = musiquePause;

  }


  updateDisplay();
  updateButtons();

}


// 🎀 BOUTON 50 MIN
startBtn.addEventListener("click", () => {

  // Si on est déjà en mode travail
  if (currentMode === "work") {

    startTimer();

    return;
  }


  // Sinon, passer au travail
  setMode("work");

  startTimer();

});


// ☕ BOUTON PAUSE 10 MIN
shortBtn.addEventListener("click", () => {

  // Si on est déjà en pause 10 min
  if (currentMode === "short") {

    startTimer();

    return;
  }


  // Sinon, passer à la pause 10 min
  setMode("short");

  startTimer();

});


// 🌸 BOUTON PAUSE 20 MIN
if (longBtn) {

  longBtn.addEventListener("click", () => {

    // Si on est déjà en pause 20 min
    if (currentMode === "long") {

      startTimer();

      return;
    }


    // Sinon, passer à la pause 20 min
    setMode("long");

    startTimer();

  });

}


// 🔄 BOUTON RÉINITIALISER
resetBtn.addEventListener("click", resetTimer);


// ⚙️ MODIFICATION DES DURÉES
if (applyBtn) {

  applyBtn.addEventListener("click", () => {

    const workInput =
      Number(document.getElementById("workTime").value);

    const shortInput =
      Number(document.getElementById("shortTime").value);

    const longInput =
      Number(document.getElementById("longTime").value);


    if (
      workInput > 0 &&
      shortInput > 0 &&
      longInput > 0
    ) {

      workDuration = workInput * 60;
      shortDuration = shortInput * 60;
      longDuration = longInput * 60;

      setMode(currentMode);

      alert("Les durées ont été mises à jour 🌷");

    } else {

      alert("Entre des durées valides.");

    }

  });

}


// 🚀 AFFICHAGE INITIAL
updateDisplay();
updateButtons();
