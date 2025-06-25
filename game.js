/* Baboon Plastik Avı – v3
   • Plastik → +10 puan | kaçırılırsa –5 puan
   • Katı şampuana tıklarsan can –1
   • 3 can veya süre 0 → kayıp
   • Skor ≥100   → kazan & 100 TL kupon
*/

let score   = 0;
let lives   = 3;
let time    = 60;            // saniye
let playing = true;

const container   = document.getElementById("game-container");
const scoreEl     = document.getElementById("score");
const livesEl     = document.getElementById("lives");
const timeEl      = document.getElementById("time");
const overlay     = document.getElementById("overlay");
const resultTitle = document.getElementById("result-title");
const resultMsg   = document.getElementById("result-msg");
const restartBtn  = document.getElementById("restart-btn");

/* --- GÖRSELLER ---------------------------------------------------------- */
const plasticImages = [
  "assets/images/plastic1.png",
  "assets/images/plastic2.png",
  "assets/images/plastic3.png",
  "assets/images/plastic4.png",
  "assets/images/plastic6.png"
];

const baboonImages = [
  "assets/images/baboon1.jpeg",
  "assets/images/baboon2.jpeg",
  "assets/images/baboon3.jpeg",
  "assets/images/baboon4.png",
  "assets/images/baboon5.png",
  "assets/images/baboon6.png",
  "assets/images/baboon7.png"
];
/* ----------------------------------------------------------------------- */

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  timeEl.textContent  = time;
}

function endGame(win) {
  playing = false;
  resultTitle.textContent = win ? "Tebrikler!" : "Oyun Bitti";
  resultMsg.textContent   = win
    ? "100 puan yaptın ve 100 TL kupon kazandın 🎉"
    : "Üzgünüz, kuponu kaçırdın. Şansını tekrar dene!";
  overlay.style.display = "block";
}

restartBtn.onclick = () => location.reload();

/* --- Hedef Oluştur ------------------------------------------------------ */
function createTarget(isPlastic = true) {
  if (!playing) return;

  const img = document.createElement("img");
  img.src = isPlastic
    ? plasticImages[Math.floor(Math.random() * plasticImages.length)]
    : baboonImages[Math.floor(Math.random() * baboonImages.length)];

  img.className = "target";
  img.style.position = "absolute";
  img.style.top  = Math.random() * 400 + "px";
  img.style.left = Math.random() * 90  + "%";
  img.style.width = "80px";
  img.style.cursor = "pointer";

  /* Tıklanınca */
  img.onclick = () => {
    if (!playing) return;
    if (isPlastic) {
      score += 10;
    } else {
      lives--;
    }
    container.removeChild(img);
    updateHUD();
    if (score >= 100) return endGame(true);
    if (lives <= 0)   return endGame(false);
  };

  container.appendChild(img);

  /* 1.5 sn sonra otomatik kaybolur */
  setTimeout(() => {
    if (container.contains(img)) {
      container.removeChild(img);
      if (isPlastic && playing) {
        score = Math.max(0, score - 5);   // kaçırınca –5
        updateHUD();
      }
    }
  }, 1500);
}

/* --- Oyun Döngüleri ----------------------------------------------------- */
/* 1) Hedef gönderen döngü */
const spawnLoop = setInterval(() => {
  if (!playing) return clearInterval(spawnLoop);
  const isPlastic = Math.random() > 0.40; // %60 plastik
  createTarget(isPlastic);
}, 800);

/* 2) Zamanlayıcı döngüsü */
const timerLoop = setInterval(() => {
  if (!playing) return clearInterval(timerLoop);
  time--;
  updateHUD();
  if (time <= 0) endGame(score >= 100);
}, 1000);

/* İlk HUD güncellemesi */
updateHUD();
// Buton olayını oyun bittikten sonra tanımla
document.getElementById("restart-btn").onclick = () => location.reload();
document.addEventListener("DOMContentLoaded", () => {
  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
});
