const paragraphs = [
`Consistent, focused practice produces the most reliable improvement in typing speed and accuracy. Make short, intentional sessions part of your daily routine, and measure progress with timed tests. Keep posture upright and hands relaxed, use the home row as your anchor, and avoid looking down at the keyboard. When you notice repetitive errors, break the problem down into the specific keys or word patterns that cause trouble and train those patterns deliberately. Over time, small, steady gains compound into noticeable increases in words per minute without sacrificing precision.`,
`When writing or coding under time pressure, clarity beats complexity—focus on expressing a single idea per sentence and avoid unnecessary punctuation that slows you down. Learn common word pairs and frequent programming tokens to type them without hesitation. Read the whole line before you type it, and keep a steady rhythm rather than trying to sprint through the text. Practicing with paragraphs that mimic real tasks, such as documentation, emails, or short technical descriptions, will better reflect day-to-day typing needs than random word lists.`,
`Break long practice passages into shorter goals inside a session: aim for bursts of twenty to forty seconds, then briefly evaluate errors and rest. Include punctuation and capitalization to make practice realistic, since they change how fast you can write accurately. Use your peripheral vision to keep track of upcoming words, and consciously slow down when accuracy drops. Track your best performance across sessions and treat that metric as a benchmark to beat gradually rather than an absolute target to force each time you practice.`
];

const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("acc");
const bestElement = document.getElementById("best");
const statusElement = document.getElementById("status");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const modeSelect = document.getElementById("mode");

const resultPanel = document.getElementById("result");
const resultRawEl = document.getElementById("resRaw");
const resultNetEl = document.getElementById("resNet");
const resultAccEl = document.getElementById("resAcc");
const resultCharsEl = document.getElementById("resChars");
const resultCpsEl = document.getElementById("resCps");
const resultBestEl = document.getElementById("resBest");
const tryAgainButton = document.getElementById("tryAgain");
const newTestButton = document.getElementById("newTest");
const resultChart = document.getElementById("resultChart");
const chartCtx = resultChart.getContext("2d");

const BEST_NET_WPM_KEY = "best_net_wpm";

let totalSeconds = 60;
let secondsLeft = 60;
let intervalId = null;
let isRunning = false;
let startTimestamp = 0;
let correctCount = 0;
let wrongCount = 0;
let wpmTimeline = [];

bestElement.innerText = localStorage.getItem(BEST_NET_WPM_KEY) || "0";

function loadParagraph() {
  const paragraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  textElement.innerHTML = "";
  for (const ch of paragraph) {
    const span = document.createElement("span");
    span.textContent = ch;
    textElement.appendChild(span);
  }
  highlightCursor(0);
}

function highlightCursor(index) {
  const spans = textElement.querySelectorAll("span");
  spans.forEach(s => s.classList.remove("current"));
  if (spans[index]) spans[index].classList.add("current");
}

function resetTest(autoStart = false) {
  clearInterval(intervalId);
  intervalId = null;
  totalSeconds = Number(modeSelect.value);
  secondsLeft = totalSeconds;
  isRunning = false;
  startTimestamp = 0;
  correctCount = 0;
  wrongCount = 0;
  wpmTimeline = [];
  timeElement.innerText = secondsLeft;
  wpmElement.innerText = "0";
  accuracyElement.innerText = "100%";
  statusElement.innerText = "Idle — choose a mode and press Start";
  inputElement.value = "";
  inputElement.disabled = false;
  hideResultPanel();
  loadParagraph();
  if (autoStart) startTest();
}

function startTest() {
  if (isRunning) return;
  isRunning = true;
  startTimestamp = Date.now();
  statusElement.innerText = "Running";
  inputElement.focus();
  wpmTimeline = [];
  intervalId = setInterval(() => {
    const elapsed = Math.max(1, Math.round((Date.now() - startTimestamp) / 1000));
    const netWpm = Math.round((correctCount / 5) / (elapsed / 60));
    wpmTimeline.push({ time: elapsed, wpm: netWpm });
    secondsLeft--;
    timeElement.innerText = secondsLeft;
    if (secondsLeft <= 0) finishTest();
  }, 1000);
}

function finishTest() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  inputElement.disabled = true;
  statusElement.innerText = "Finished";
  const elapsed = Math.max(1, (Date.now() - startTimestamp) / 1000);
  const totalTyped = correctCount + wrongCount;
  const rawWpm = Math.round((totalTyped / 5) / (elapsed / 60));
  const netWpm = Math.round((correctCount / 5) / (elapsed / 60));
  const denom = correctCount + wrongCount;
  const accuracy = denom === 0 ? 100 : Math.round((correctCount / denom) * 100);
  const cps = Math.round((correctCount / elapsed) * 100) / 100;
  resultRawEl.innerText = String(rawWpm);
  resultNetEl.innerText = String(netWpm);
  resultAccEl.innerText = accuracy + "%";
  resultCharsEl.innerText = `${correctCount} / ${wrongCount}`;
  resultCpsEl.innerText = String(cps);
  const previousBest = Number(localStorage.getItem(BEST_NET_WPM_KEY) || 0);
  if (netWpm > previousBest) {
    localStorage.setItem(BEST_NET_WPM_KEY, String(netWpm));
    bestElement.innerText = String(netWpm);
  }
  resultBestEl.innerText = localStorage.getItem(BEST_NET_WPM_KEY) || "0";
  showResultPanel();
  drawWpmChart();
}

inputElement.addEventListener("input", () => {
  const spans = textElement.querySelectorAll("span");
  const value = inputElement.value;
  const typedChars = value.split("");
  if (!isRunning && value.length > 0) startTest();
  correctCount = 0;
  wrongCount = 0;
  for (let i = 0; i < typedChars.length; i++) {
    const typedChar = typedChars[i];
    const targetChar = spans[i] ? spans[i].textContent : null;
    if (targetChar == null) {
      wrongCount++;
    } else if (typedChar === targetChar) {
      correctCount++;
    } else {
      wrongCount++;
    }
  }
  for (let i = typedChars.length; i < spans.length; i++) {
    spans[i].classList.remove("correct", "wrong");
  }
  for (let i = 0; i < spans.length; i++) {
    const ch = spans[i];
    const t = typedChars[i];
    ch.classList.remove("correct", "wrong");
    if (t == null) {
    } else if (t === ch.textContent) {
      ch.classList.add("correct");
    } else {
      ch.classList.add("wrong");
    }
  }
  highlightCursor(Math.min(typedChars.length, spans.length));
  const denom = correctCount + wrongCount;
  const accuracy = denom === 0 ? 100 : Math.round((correctCount / denom) * 100);
  accuracyElement.innerText = accuracy + "%";
  if (isRunning) {
    const elapsed = Math.max(1, Math.round((Date.now() - startTimestamp) / 1000));
    const currentWpm = Math.round((correctCount / 5) / (elapsed / 60));
    wpmElement.innerText = String(currentWpm);
  } else {
    wpmElement.innerText = "0";
  }
});

function drawWpmChart() {
  const pixelRatio = devicePixelRatio || 1;
  const width = resultChart.width = resultChart.clientWidth * pixelRatio;
  const height = resultChart.height = resultChart.clientHeight * pixelRatio;
  chartCtx.clearRect(0, 0, width, height);
  chartCtx.fillStyle = "rgba(255,255,255,0.01)";
  chartCtx.fillRect(0, 0, width, height);
  if (!wpmTimeline.length) return;
  const maxWpm = Math.max(10, ...wpmTimeline.map(pt => pt.wpm));
  const padding = 20 * pixelRatio;
  chartCtx.strokeStyle = "rgba(138,138,255,0.95)";
  chartCtx.lineWidth = 2 * pixelRatio;
  chartCtx.beginPath();
  wpmTimeline.forEach((point, i) => {
    const x = padding + (i / (wpmTimeline.length - 1 || 1)) * (width - padding * 2);
    const y = (height - padding) - (point.wpm / maxWpm) * (height - padding * 2);
    if (i === 0) chartCtx.moveTo(x, y); else chartCtx.lineTo(x, y);
  });
  chartCtx.stroke();
  chartCtx.lineTo(width - padding, height - padding);
  chartCtx.lineTo(padding, height - padding);
  chartCtx.closePath();
  chartCtx.fillStyle = "rgba(138,138,255,0.06)";
  chartCtx.fill();
  chartCtx.fillStyle = "rgba(255,255,255,0.6)";
  chartCtx.font = `${12 * pixelRatio}px Inter, system-ui`;
  chartCtx.textAlign = "right";
  chartCtx.fillText("WPM", width - padding, padding - 6 * pixelRatio);
  chartCtx.textAlign = "left";
  chartCtx.fillText(`${wpmTimeline[0].time}s`, padding, height - padding + 14 * pixelRatio);
  chartCtx.textAlign = "right";
  chartCtx.fillText(`${wpmTimeline[wpmTimeline.length - 1].time}s`, width - padding, height - padding + 14 * pixelRatio);
}

function showResultPanel() {
  resultPanel.classList.add("show");
  resultPanel.setAttribute("aria-hidden", "false");
}

function hideResultPanel() {
  resultPanel.classList.remove("show");
  resultPanel.setAttribute("aria-hidden", "true");
}

tryAgainButton.addEventListener("click", () => {
  hideResultPanel();
  resetTest(true);
});

newTestButton.addEventListener("click", () => {
  hideResultPanel();
  resetTest(false);
});

startButton.addEventListener("click", () => resetTest(true));
restartButton.addEventListener("click", () => resetTest(false));
modeSelect.addEventListener("change", () => resetTest(false));

resetTest(false);