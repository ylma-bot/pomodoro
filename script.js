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
const workDuration = 50 * 60;
const shortDuration = 10 * 60;

let currentTime = workDuration;
let currentMode = "work";
let timerInterval = null;
let isRunning = false;
let sessionsCompleted = 0;


// 🎀 ÉLÉMENTS HTML
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const shortBtn = document.getElementById("shortBtn");
const resetBtn = document.getElementById("resetBtn");
const sessionsDisplay = document.getElementById("sessions");


// 🎵 MUSIQUE TRAVAIL
function lancerMusiqueTravail() {
  audioPlayer.loop = false;
  audioPlayer.src = musiquesTravail[musiqueTravailIndex];
  audioPlayer.currentTime = 0;
  audioPlayer.play().catch(() => {});
}


// 🌸 MUSIQUE PAUSE
function lancerMusiquePause() {
  audioPlayer.loop = true;
  audioPlayer.src = musiquePause;
  audioPlayer.currentTime = 0;
  audioPlayer.play().catch(() => {});
}


// ⏸️ PAUSE MUSIQUE
function mettreMusiqueEnPause() {
  audioPlayer.pause();
}


// 🛑 ARRÊTER MUSIQUE
function arreterMusique() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}


// 🎵 MUSIQUES DE TRAVAIL
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


// ⏱️ AFFICHER LE TEMPS
function updateDisplay() {

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}


// 🎀 METTRE À JOUR LES BOUTONS
function updateButtons() {

  // 🌸 TRAVAIL 50 MIN
  if (currentMode === "work") {

    if (isRunning) {
      startBtn.textContent = "Ⅱ Pause";
    } 
    else if (currentTime < workDuration) {
      startBtn.textContent = "▶";
    } 
    else {
      startBtn.textContent = "▶ Start";
    }

    shortBtn.textContent = "☕︎ Pause";
  }


  // ☕ PAUSE 10 MIN
  if (currentMode === "short") {

    if (isRunning) {
      shortBtn.textContent = "Ⅱ";
    } 
    else if (currentTime < shortDuration) {
      shortBtn.textContent = "▶";
    } 
    else {
      shortBtn.textContent = "☕︎ Pause";
    }

    startBtn.textContent = "Start";
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

  // ⏸️ LE TIMER TOURNE → PAUSE
  if (isRunning) {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    mettreMusiqueEnPause();

    updateButtons();

    return;
  }


  // ▶️ DÉMARRER OU REPRENDRE
  isRunning = true;

  updateButtons();


  // 🎵 MUSIQUE
  if (currentMode === "work") {

    if (!audioPlayer.src ||
        audioPlayer.src === window.location.href) {

      lancerMusiqueTravail();

    } else {

      audioPlayer.play().catch(() => {});

    }

  } 
  else {

    if (!audioPlayer.src ||
        audioPlayer.src === window.location.href) {

      lancerMusiquePause();

    } else {

      audioPlayer.play().catch(() => {});

    }

  }


  // ⏱️ COMPTE À REBOURS
  timerInterval = setInterval(() => {

    currentTime--;

    updateDisplay();


    // 🏁 FIN DU TIMER
    if (currentTime <= 0) {

      clearInterval(timerInterval);

      timerInterval = null;

      isRunning = false;

      mettreMusiqueEnPause();


      // 🌸 FIN DU TRAVAIL
      if (currentMode === "work") {

        sessionsCompleted++;

        sessionsDisplay.textContent =
          "Sessions terminées : " +
          sessionsCompleted;

        alert(
          "Bravo ! Temps de travail terminé 🌸"
        );

        setMode("short");

      }


      // ☕ FIN DE LA PAUSE
      else {

        alert(
          "Pause terminée ! On reprend doucement ✨"
        );

        setMode("work");

      }

    }

  }, 1000);

}


// 🔄 PASSER AU TRAVAIL
function setWorkMode() {

  stopTimer();

  currentMode = "work";

  currentTime = workDuration;

  musiqueTravailIndex = 0;

  audioPlayer.src =
    musiquesTravail[musiqueTravailIndex];

  updateDisplay();

  updateButtons();
}


// ☕ PASSER À LA PAUSE 10 MIN
function setShortMode() {

  stopTimer();

  currentMode = "short";

  currentTime = shortDuration;

  audioPlayer.src = musiquePause;

  updateDisplay();

  updateButtons();
}


// 🌸 BOUTON 50 MIN
startBtn.addEventListener("click", () => {

  // Si on est déjà en mode travail :
  // démarrer / pause / reprendre
  if (currentMode === "work") {

    startTimer();

  } 
  else {

    // On passe aux 50 min
    setWorkMode();

    // Puis on démarre immédiatement
    startTimer();

  }

});


// ☕ BOUTON PAUSE 10 MIN
shortBtn.addEventListener("click", function () {

  // Si on est déjà en pause 10 min
  if (currentMode === "short") {

    // Si le timer tourne → PAUSE
    if (isRunning) {

      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;

      mettreMusiqueEnPause();

      shortBtn.textContent = "▶";

    }

    // Si le timer est arrêté → REPRENDRE
    else {

      isRunning = true;

      shortBtn.textContent = "Ⅱ";

      audioPlayer.play().catch(() => {});

      timerInterval = setInterval(() => {

        currentTime--;
        updateDisplay();

        if (currentTime <= 0) {

          clearInterval(timerInterval);
          timerInterval = null;
          isRunning = false;

          mettreMusiqueEnPause();

          alert("Pause terminée ! On reprend doucement ✨");

          setWorkMode();
        }

      }, 1000);
    }

    return;
  }


  // Première fois qu'on clique :
  // passer à 10 minutes
  setShortMode();

  // Puis démarrer immédiatement
  isRunning = true;

  shortBtn.textContent = "Ⅱ";

  lancerMusiquePause();

  timerInterval = setInterval(() => {

    currentTime--;
    updateDisplay();

    if (currentTime <= 0) {

      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;

      mettreMusiqueEnPause();

      alert("Pause terminée ! On reprend doucement ✨");

      setWorkMode();
    }

  }, 1000);

});

// 🔄 RESET
resetBtn.addEventListener("click", () => {

  stopTimer();

  if (currentMode === "work") {

    currentTime = workDuration;

    musiqueTravailIndex = 0;

    audioPlayer.src =
      musiquesTravail[musiqueTravailIndex];

  } 
  else {

    currentTime = shortDuration;

    audioPlayer.src = musiquePause;

  }

  updateDisplay();

  updateButtons();

});


// 🚀 AFFICHAGE INITIAL
updateDisplay();

updateButtons();
