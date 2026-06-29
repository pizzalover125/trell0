import {
  ICON_TIMER,
  ICON_STOPWATCH,
  ICON_POMODORO,
  ICON_PAUSE,
  ICON_PLAY,
  ICON_RESTART,
  ICON_X_TINY,
} from "./icons.js";

export const timerStack = document.getElementById("timerStack");
const TIMERS_KEY = "trell0-timers";
const RING_R = 15;
const RING_CIRC = 2 * Math.PI * RING_R;

let timers = [];
let timerUid = 1;
let tickHandle = null;
let audioCtx = null;
const chipEls = {};

function elapsedOf(t) {
  return t.accumMs + (t.running && t.startedAt ? Date.now() - t.startedAt : 0);
}

function loadTimers() {
  try {
    const raw = localStorage.getItem(TIMERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t) => ({
      id: t.id || "t" + timerUid++,
      type:
        t.type === "pomodoro"
          ? "pomodoro"
          : t.type === "stopwatch"
            ? "stopwatch"
            : "timer",
      durationMs: Number(t.durationMs) || 0,
      workMs: Number(t.workMs) || 0,
      breakMs: Number(t.breakMs) || 0,
      phase: t.phase || "work",
      cycle: Number(t.cycle) || 1,
      accumMs: Number(t.accumMs) || 0,
      startedAt: t.startedAt || null,
      running: !!t.running,
      done: !!t.done,
      chimed: true,
    }));
  } catch {
    return [];
  }
}

function saveTimers() {
  try {
    localStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  } catch {}
}

function ensureAudio() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  } catch {}
}

function playChime() {
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.14;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  } catch {}
}

export function formatClock(ms, ceilSec) {
  if (ms < 0) ms = 0;
  const totalSec = ceilSec ? Math.ceil(ms / 1000) : Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return h + ":" + pad(m) + ":" + pad(s);
  return m + ":" + pad(s);
}

export function startTimer(durationMs) {
  ensureAudio();
  const t = {
    id: "t" + timerUid++,
    type: "timer",
    durationMs,
    accumMs: 0,
    startedAt: Date.now(),
    running: true,
    done: false,
    chimed: false,
  };
  timers.push(t);
  addChip(t);
  updateChip(t);
  saveTimers();
  startTick();
}

export function startStopwatch() {
  ensureAudio();
  const t = {
    id: "t" + timerUid++,
    type: "stopwatch",
    durationMs: 0,
    accumMs: 0,
    startedAt: Date.now(),
    running: true,
    done: false,
    chimed: true,
  };
  timers.push(t);
  addChip(t);
  updateChip(t);
  saveTimers();
  startTick();
}

export function startPomodoro(workMs, breakMs) {
  ensureAudio();
  const t = {
    id: "t" + timerUid++,
    type: "pomodoro",
    durationMs: workMs,
    workMs,
    breakMs,
    phase: "work",
    cycle: 1,
    accumMs: 0,
    startedAt: Date.now(),
    running: true,
    done: false,
    chimed: false,
  };
  timers.push(t);
  addChip(t);
  updateChip(t);
  saveTimers();
  startTick();
}

function pauseTimer(t) {
  if (!t.running) return;
  t.accumMs = elapsedOf(t);
  t.running = false;
  t.startedAt = null;
  updateChip(t);
  saveTimers();
  stopTickIfIdle();
}

function resumeTimer(t) {
  if (t.running || t.done) return;
  t.startedAt = Date.now();
  t.running = true;
  updateChip(t);
  saveTimers();
  startTick();
}

function restartTimer(t) {
  t.accumMs = 0;
  t.startedAt = Date.now();
  t.running = true;
  t.done = false;
  t.chimed = false;
  const refs = chipEls[t.id];
  if (refs) refs.chip.classList.remove("done");
  updateChip(t);
  saveTimers();
  startTick();
}

function removeTimer(t) {
  const refs = chipEls[t.id];
  timers = timers.filter((x) => x.id !== t.id);
  saveTimers();
  if (refs) {
    refs.chip.classList.add("removing");
    refs.chip.addEventListener(
      "animationend",
      () => {
        refs.chip.remove();
        delete chipEls[t.id];
      },
      { once: true },
    );
  }
  stopTickIfIdle();
}

function startTick() {
  if (tickHandle) return;
  if (!timers.some((t) => t.running)) return;
  tickHandle = setInterval(tick, 200);
}

function stopTickIfIdle() {
  if (!timers.some((t) => t.running) && tickHandle) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
}

function tick() {
  let changed = false;
  timers.forEach((t) => {
    if (t.type === "timer" && t.running && !t.done) {
      const remaining = t.durationMs - elapsedOf(t);
      if (remaining <= 0) {
        t.running = false;
        t.done = true;
        t.accumMs = t.durationMs;
        t.startedAt = null;
        if (!t.chimed) {
          ensureAudio();
          playChime();
          t.chimed = true;
        }
        changed = true;
      }
    }
    if (t.type === "pomodoro" && t.running && !t.done) {
      const remaining = t.durationMs - elapsedOf(t);
      if (remaining <= 0) {
        if (!t.chimed) {
          ensureAudio();
          playChime();
          t.chimed = true;
        }
        if (t.phase === "work") {
          t.phase = "break";
          t.durationMs = t.breakMs;
        } else {
          t.phase = "work";
          t.cycle++;
          t.durationMs = t.workMs;
        }
        t.accumMs = 0;
        t.startedAt = Date.now();
        t.chimed = false;
        changed = true;
      }
    }
    updateChip(t);
  });
  if (changed) saveTimers();
  stopTickIfIdle();
}

function addChip(t) {
  const chip = document.createElement("div");
  chip.className = "timer-chip" + (t.done ? " done" : "");

  const indicator = document.createElement("div");
  indicator.className = "timer-indicator";

  let ringProgress = null;
  if (t.type === "timer" || t.type === "pomodoro") {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "timer-ring-svg");
    svg.setAttribute("viewBox", "0 0 34 34");

    const track = document.createElementNS(NS, "circle");
    track.setAttribute("class", "timer-ring-track");
    track.setAttribute("cx", "17");
    track.setAttribute("cy", "17");
    track.setAttribute("r", String(RING_R));

    const prog = document.createElementNS(NS, "circle");
    prog.setAttribute("class", "timer-ring-progress");
    prog.setAttribute("cx", "17");
    prog.setAttribute("cy", "17");
    prog.setAttribute("r", String(RING_R));
    prog.setAttribute("stroke-dasharray", String(RING_CIRC));
    prog.setAttribute("stroke-dashoffset", "0");

    svg.appendChild(track);
    svg.appendChild(prog);
    indicator.appendChild(svg);
    ringProgress = prog;

    const mini = document.createElement("div");
    mini.className = "timer-icon-mini";
    mini.innerHTML = t.type === "pomodoro" ? ICON_POMODORO : ICON_TIMER;
    indicator.appendChild(mini);
  } else {
    const dot = document.createElement("div");
    dot.className = "timer-dot";
    indicator.appendChild(dot);
  }

  const main = document.createElement("div");
  main.className = "timer-main";
  const time = document.createElement("div");
  time.className = "timer-time";
  const sub = document.createElement("div");
  sub.className = "timer-sub";
  main.appendChild(time);
  main.appendChild(sub);

  const actions = document.createElement("div");
  actions.className = "timer-actions";
  const primaryBtn = document.createElement("button");
  primaryBtn.className = "timer-btn";
  primaryBtn.type = "button";
  const closeTimerBtn = document.createElement("button");
  closeTimerBtn.className = "timer-btn";
  closeTimerBtn.type = "button";
  closeTimerBtn.innerHTML = ICON_X_TINY;
  closeTimerBtn.title = "dismiss";
  actions.appendChild(primaryBtn);
  actions.appendChild(closeTimerBtn);

  primaryBtn.addEventListener("click", () => {
    const cur = timers.find((x) => x.id === t.id);
    if (!cur) return;
    if (cur.done) restartTimer(cur);
    else if (cur.running) pauseTimer(cur);
    else resumeTimer(cur);
  });
  closeTimerBtn.addEventListener("click", () => {
    const cur = timers.find((x) => x.id === t.id);
    if (cur) removeTimer(cur);
  });

  chip.appendChild(indicator);
  chip.appendChild(main);
  chip.appendChild(actions);
  timerStack.appendChild(chip);

  chipEls[t.id] = { chip, time, sub, ringProgress, primaryBtn };
}

function updateChip(t) {
  const refs = chipEls[t.id];
  if (!refs) return;
  const elapsed = elapsedOf(t);

  if (t.type === "timer" || t.type === "pomodoro") {
    const remaining = Math.max(0, t.durationMs - elapsed);
    refs.time.textContent = formatClock(remaining, true);
    if (refs.ringProgress) {
      const frac = t.durationMs > 0 ? Math.min(1, elapsed / t.durationMs) : 1;
      refs.ringProgress.setAttribute(
        "stroke-dashoffset",
        String(RING_CIRC * frac),
      );
    }
  } else {
    refs.time.textContent = formatClock(elapsed, false);
  }

  let subText;
  if (t.type === "pomodoro" && t.done) subText = "done";
  else if (t.type === "pomodoro" && !t.running)
    subText = "paused \u00b7 " + t.phase;
  else if (t.type === "pomodoro")
    subText = t.phase + " \u00b7 cycle " + t.cycle;
  else if (t.done) subText = "done";
  else if (!t.running) subText = "paused";
  else subText = t.type === "stopwatch" ? "stopwatch" : "timer";
  refs.sub.textContent = subText;

  refs.chip.classList.toggle(
    "phase-work",
    t.type === "pomodoro" && t.phase === "work",
  );
  refs.chip.classList.toggle(
    "phase-break",
    t.type === "pomodoro" && t.phase === "break",
  );

  refs.chip.classList.toggle("done", !!t.done);

  if (t.done) {
    refs.primaryBtn.innerHTML = ICON_RESTART;
    refs.primaryBtn.title = "restart";
  } else if (t.running) {
    refs.primaryBtn.innerHTML = ICON_PAUSE;
    refs.primaryBtn.title = "pause";
  } else {
    refs.primaryBtn.innerHTML = ICON_PLAY;
    refs.primaryBtn.title = "resume";
  }
}

export function initTimers() {
  timers = loadTimers();

  timers.forEach((t) => {
    const num = parseInt(String(t.id).replace(/\D/g, ""), 10);
    if (!isNaN(num) && num >= timerUid) timerUid = num + 1;
  });

  timers.forEach((t) => {
    if (t.type === "timer" && t.running) {
      const remaining = t.durationMs - elapsedOf(t);
      if (remaining <= 0) {
        t.running = false;
        t.done = true;
        t.accumMs = t.durationMs;
        t.startedAt = null;
        t.chimed = true;
      }
    }
    if (t.type === "pomodoro" && t.running) {
      const remaining = t.durationMs - elapsedOf(t);
      if (remaining <= 0) {
        if (t.phase === "work") {
          t.phase = "break";
          t.durationMs = t.breakMs;
        } else {
          t.phase = "work";
          t.cycle++;
          t.durationMs = t.workMs;
        }
        t.accumMs = 0;
        t.startedAt = Date.now();
        t.chimed = true;
      }
    }
  });
  timerStack.innerHTML = "";
  timers.forEach((t) => {
    addChip(t);
    updateChip(t);
  });
  saveTimers();
  startTick();
}
