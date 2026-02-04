// ---------------- PAGE NAV ----------------
const pages = document.querySelectorAll(".page");
document.querySelectorAll("nav button").forEach((btn) => {
  btn.onclick = () => showPage(btn.dataset.page);
});

function showPage(id) {
  pages.forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "profile") drawProfileGraph();
}

document.getElementById("startTestBtn").onclick = () => {
  showPage("test");
  resetTest();
  typingArea.focus();
};

// ---------------- THEME ----------------
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerText = "☀️";
}
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  const d = document.body.classList.contains("dark");
  localStorage.setItem("theme", d ? "dark" : "light");
  themeToggle.innerText = d ? "☀️" : "🌙";
};

// ---------------- ELEMENTS ----------------
const typingArea = document.getElementById("typing-area");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("accuracy");
const mistakeEl = document.getElementById("mistakes");
const progress = document.getElementById("progress");

const difficulty = document.getElementById("difficulty");
const testTime = document.getElementById("test-time");
const pauseBtn = document.getElementById("pauseBtn");

const modal = document.getElementById("result-modal");
const restartBtn = document.getElementById("restartBtn");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalMistakes = document.getElementById("finalMistakes");

const testCtx = document.getElementById("chart").getContext("2d");
const profileCanvas = document.getElementById("profileChart");
const profileCtx = profileCanvas.getContext("2d");

const historyTable = document.getElementById("historyTable");
const totalTestsEl = document.getElementById("totalTests");
const bestWpmEl = document.getElementById("bestWpm");
const avgWpmEl = document.getElementById("avgWpm");

const currentStreakEl = document.getElementById("currentStreak");
const longestStreakEl = document.getElementById("longestStreak");
const headerStreakEl = document.getElementById("headerStreak");

// ---------------- WORDS ----------------
const words = {
  easy: ["cat", "dog", "sun", "pen", "cup", "tree", "ball", "map"],
  medium: [
    "javascript",
    "typing",
    "frontend",
    "developer",
    "browser",
    "variable",
  ],
  hard: ["performance", "asynchronous", "architecture", "optimization"],
};

// ---------------- STATE ----------------
let text = "",
  index = 0;
let time, startTime, timer;
let started = false,
  paused = false,
  mistakes = 0;
let wpmHistory = [];
let hoverIndex = null;

// ---------------- STORAGE ----------------
const getHistory = () =>
  JSON.parse(localStorage.getItem("typingHistory")) || [];

const saveHistory = (entry) => {
  const h = getHistory();
  h.push(entry);
  localStorage.setItem("typingHistory", JSON.stringify(h));
};

// ---------------- RESET TEST ----------------
function resetTest() {
  const pool = words[difficulty.value];
  text = Array.from(
    { length: 120 },
    () => pool[Math.floor(Math.random() * pool.length)],
  ).join(" ");

  typingArea.innerHTML = "";
  [...text].forEach((c, i) => {
    const s = document.createElement("span");
    s.innerText = c;
    if (i === 0) s.classList.add("active");
    typingArea.appendChild(s);
  });

  clearInterval(timer);
  index = mistakes = 0;
  wpmHistory = [];
  started = paused = false;

  time = startTime = parseInt(testTime.value);
  timeEl.innerText = time;
  progress.style.width = "0%";
}

difficulty.onchange = resetTest;
testTime.onchange = resetTest;

// ---------------- TIMER ----------------
function startTimer() {
  timer = setInterval(() => {
    if (!paused) {
      time--;
      timeEl.innerText = time;
      progress.style.width = ((startTime - time) / startTime) * 100 + "%";
      updateStats();
      recordWPM();
      if (time === 0) finishTest();
    }
  }, 1000);
}

// ---------------- STATS ----------------
function updateStats() {
  const correct = document.querySelectorAll(".correct").length;
  const typed = document.querySelectorAll(".correct,.incorrect").length;
  const elapsed = (startTime - time) / 60;

  wpmEl.innerText = elapsed ? Math.round(correct / 5 / elapsed) : 0;
  accEl.innerText = typed ? Math.round((correct / typed) * 100) : 0;
  mistakeEl.innerText = mistakes;
}

function recordWPM() {
  const correct = document.querySelectorAll(".correct").length;
  const elapsed = (startTime - time) / 60;
  if (elapsed > 0) wpmHistory.push(Math.round(correct / 5 / elapsed));
}

// ---------------- PROFILE GRAPH (FINAL) ----------------
function drawProfileGraph() {
  const history = getHistory();
  profileCtx.clearRect(0, 0, profileCanvas.width, profileCanvas.height);

  if (!history.length) {
    profileCtx.fillText("No data yet", 50, 120);
    return;
  }

  const wpms = history.map((h) => h.wpm);
  const maxWPM = Math.max(...wpms, 10);

  const paddingLeft = 50;
  const paddingRight = 80;
  const paddingTop = 30;
  const paddingBottom = 40;

  const w = profileCanvas.width - paddingLeft - paddingRight;
  const h = profileCanvas.height - paddingTop - paddingBottom;

  // ----- Y AXIS -----
  profileCtx.strokeStyle = "#aaa";
  profileCtx.beginPath();
  profileCtx.moveTo(paddingLeft, paddingTop);
  profileCtx.lineTo(paddingLeft, paddingTop + h);
  profileCtx.stroke();

  profileCtx.fillStyle = "#555";
  profileCtx.font = "12px Inter";

  for (let i = 0; i <= 5; i++) {
    const val = Math.round((maxWPM / 5) * i);
    const y = paddingTop + h - (i / 5) * h;

    profileCtx.fillText(val, 10, y + 4);

    profileCtx.beginPath();
    profileCtx.moveTo(paddingLeft, y);
    profileCtx.lineTo(paddingLeft + w, y);
    profileCtx.strokeStyle = "#eee";
    profileCtx.stroke();
  }

  // ----- LINE -----
  profileCtx.beginPath();
  wpms.forEach((wpm, i) => {
    const x = paddingLeft + (i / (wpms.length - 1 || 1)) * w;

    const y = paddingTop + h - (wpm / maxWPM) * h;

    if (i === 0) profileCtx.moveTo(x, y);
    else profileCtx.lineTo(x, y);
  });

  profileCtx.strokeStyle = "#4a90e2";
  profileCtx.lineWidth = 2;
  profileCtx.stroke();

  // ----- DOTS + TOOLTIP -----
  wpms.forEach((wpm, i) => {
    const x = paddingLeft + (i / (wpms.length - 1 || 1)) * w;

    const y = paddingTop + h - (wpm / maxWPM) * h;

    // Dot
    profileCtx.beginPath();
    profileCtx.arc(x, y, 4, 0, Math.PI * 2);
    profileCtx.fillStyle = "#4a90e2";
    profileCtx.fill();

    // Tooltip
    if (hoverIndex === i) {
      const boxWidth = 90;
      const boxHeight = 34;
      let boxX = x + 10;
      if (boxX + boxWidth > profileCanvas.width) {
        boxX = x - boxWidth - 10;
      }

      let boxY = y - boxHeight - 8;
      if (boxY < 0) boxY = y + 10;

      profileCtx.fillStyle = "#000";
      profileCtx.fillRect(boxX, boxY, boxWidth, boxHeight);

      profileCtx.fillStyle = "#fff";
      profileCtx.font = "12px Inter";
      profileCtx.fillText(`Test ${i + 1}`, boxX + 8, boxY + 14);
      profileCtx.fillText(`WPM: ${wpm}`, boxX + 8, boxY + 26);
    }
  });
}

// HOVER DETECTION
profileCanvas.addEventListener("mousemove", (e) => {
  const rect = profileCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const history = getHistory();
  if (!history.length) return;

  const wpms = history.map((h) => h.wpm);
  const padding = 40;
  const w = profileCanvas.width - padding * 2;

  hoverIndex = null;
  wpms.forEach((_, i) => {
    const px = padding + (i / (wpms.length - 1 || 1)) * w;
    if (Math.abs(px - x) < 8) hoverIndex = i;
  });

  drawProfileGraph();
});

profileCanvas.addEventListener("mouseleave", () => {
  hoverIndex = null;
  drawProfileGraph();
});

// ---------------- STREAK ----------------
function updateStreak() {
  const dates = [...new Set(getHistory().map((h) => h.date))];
  let cur = 0,
    max = 0;

  dates.sort((a, b) => new Date(a) - new Date(b));
  dates.forEach((d, i) => {
    if (i === 0 || new Date(d) - new Date(dates[i - 1]) === 86400000) {
      cur++;
      max = Math.max(max, cur);
    } else cur = 1;
  });

  currentStreakEl.innerText = cur;
  longestStreakEl.innerText = max;
  headerStreakEl.innerText = cur;
}

// ---------------- POPUP TEST GRAPH ----------------
function drawTestGraph() {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  // Force proper size (important for modals)
  canvas.width = 500;
  canvas.height = 250;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!wpmHistory.length) {
    ctx.fillStyle = "#666";
    ctx.font = "14px Inter";
    ctx.fillText("No typing data available", 160, 130);
    return;
  }

  const padding = 40;
  const maxWPM = Math.max(...wpmHistory, 10);
  const graphWidth = canvas.width - padding * 2;
  const graphHeight = canvas.height - padding * 2;

  // Axes
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + graphHeight);
  ctx.lineTo(padding + graphWidth, padding + graphHeight);
  ctx.stroke();

  // Line
  ctx.beginPath();
  wpmHistory.forEach((wpm, i) => {
    const x = padding + (i / (wpmHistory.length - 1 || 1)) * graphWidth;
    const y = padding + graphHeight - (wpm / maxWPM) * graphHeight;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "#4a90e2";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Points
  wpmHistory.forEach((wpm, i) => {
    const x = padding + (i / (wpmHistory.length - 1 || 1)) * graphWidth;
    const y = padding + graphHeight - (wpm / maxWPM) * graphHeight;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#4a90e2";
    ctx.fill();
  });
}

// ---------------- FINISH ----------------
function finishTest() {
  clearInterval(timer);

  finalWpm.innerText = wpmEl.innerText;
  finalAccuracy.innerText = accEl.innerText;
  finalMistakes.innerText = mistakes;

  // SHOW MODAL FIRST
  modal.style.display = "flex";

  requestAnimationFrame(() => {
    drawTestGraph();
  });

  saveHistory({
    date: new Date().toLocaleDateString(),
    difficulty: difficulty.value,
    time: testTime.value,
    wpm: Number(wpmEl.innerText),
    accuracy: Number(accEl.innerText),
    mistakes,
  });

  updateProfile();
  updateStreak();
  loadHistory();
}

// ---------------- PROFILE ----------------
function updateProfile() {
  const h = getHistory();
  if (!h.length) return;

  totalTestsEl.innerText = h.length;
  bestWpmEl.innerText = Math.max(...h.map((x) => x.wpm));
  avgWpmEl.innerText = Math.round(h.reduce((a, b) => a + b.wpm, 0) / h.length);
}

function loadHistory() {
  historyTable.innerHTML = "";
  getHistory().forEach((h) => {
    historyTable.innerHTML += `
      <tr>
        <td>${h.date}</td>
        <td>${h.difficulty}</td>
        <td>${h.time}s</td>
        <td>${h.wpm}</td>
        <td>${h.accuracy}%</td>
        <td>${h.mistakes}</td>
      </tr>`;
  });
}

// ---------------- EVENTS ----------------
typingArea.addEventListener("keydown", (e) => {
  if (time <= 0 || paused) return;
  if (e.key.length !== 1 && e.key !== "Backspace" && e.key !== " ") return;

  const spans = typingArea.querySelectorAll("span");
  spans.forEach((s) => s.classList.remove("active"));

  if (!started) {
    started = true;
    startTimer();
  }

  if (e.key === "Backspace" && index > 0) {
    index--;
    spans[index].classList.remove("correct", "incorrect");
  } else {
    if (e.key === spans[index]?.innerText) {
      spans[index].classList.add("correct");
    } else {
      spans[index].classList.add("incorrect");
      mistakes++;
    }
    index++;
  }

  spans[index]?.classList.add("active");
  updateStats();
  e.preventDefault();
});

pauseBtn.onclick = () => (paused = !paused);
restartBtn.onclick = () => {
  modal.style.display = "none";
  resetTest();
  typingArea.focus();
};

typingArea.addEventListener("paste", (e) => e.preventDefault());

// ---------------- INIT ----------------
resetTest();
updateProfile();
updateStreak();
loadHistory();
