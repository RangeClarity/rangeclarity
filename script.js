const signals = [
  {
    score: 86,
    state: "Upper reclaim",
    flow: "Cooling",
    move: "Wait for retest",
    tone: "Measured",
    feed: "Patience grade upgraded. Let the retest prove itself."
  },
  {
    score: 72,
    state: "Midrange chop",
    flow: "Heating",
    move: "Fade the noise",
    tone: "Cautious",
    feed: "Crowd energy is rising faster than structure. Do not chase the first wick."
  },
  {
    score: 91,
    state: "Clean expansion",
    flow: "Confirming",
    move: "Trail the edge",
    tone: "Constructive",
    feed: "Range break has follow-through and volume is no longer pretending."
  },
  {
    score: 64,
    state: "Trap zone",
    flow: "Overheated",
    move: "Protect capital",
    tone: "Defensive",
    feed: "Late breakout buyers are loud. Re-entry inside range flips the script."
  }
];

let signalIndex = 0;

const cycleButton = document.querySelector("#cycleSignal");
const clarityScore = document.querySelector("#clarityScore");
const scoreNeedle = document.querySelector("#scoreNeedle");
const rangeState = document.querySelector("#rangeState");
const memeFlow = document.querySelector("#memeFlow");
const bestMove = document.querySelector("#bestMove");
const riskTone = document.querySelector("#riskTone");
const dynamicFeed = document.querySelector("#dynamicFeed p");
const signupForm = document.querySelector("#signupForm");
const formNote = document.querySelector("#formNote");

function renderSignal(signal) {
  clarityScore.textContent = signal.score;
  rangeState.textContent = signal.state;
  memeFlow.textContent = signal.flow;
  bestMove.textContent = signal.move;
  riskTone.textContent = signal.tone;
  dynamicFeed.textContent = signal.feed;

  const rotation = Math.round(-82 + signal.score * 1.7);
  scoreNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
}

cycleButton?.addEventListener("click", () => {
  signalIndex = (signalIndex + 1) % signals.length;
  renderSignal(signals[signalIndex]);
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signupForm);
  const email = data.get("email");

  if (!email) {
    formNote.textContent = "Add an email and the invite desk will wake up.";
    return;
  }

  formNote.textContent = "Invite request staged. Hook this form to your email tool next.";
  signupForm.reset();
});
