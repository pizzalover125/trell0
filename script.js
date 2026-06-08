const ICON_PLUS =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
const ICON_X =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>';
const ICON_X_LG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>';
const ICON_MOON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const ICON_SUN =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>';
const ICON_DOWNLOAD =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
const ICON_UPLOAD =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

const ICON_COMMAND =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m8 9 2.5 3L8 15"/><path d="M13 15h3.5"/></svg>';
const ICON_CHEVRON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
const ICON_PLUS_SM =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
const ICON_TIMER =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9"/><path d="M9 2h6"/><path d="m18.5 5.5 1.5-1.5"/></svg>';
const ICON_STOPWATCH =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="m12 14 3-2"/><path d="M9 2h6"/><path d="M12 2v3"/></svg>';
const ICON_THEME_CMD =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>';
const ICON_PAUSE =
  '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="7" y="6" width="3.2" height="12" rx="1"/><rect x="13.8" y="6" width="3.2" height="12" rx="1"/></svg>';
const ICON_PLAY =
  '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.52.86l10.5-6.5a1 1 0 0 0 0-1.72l-10.5-6.5A1 1 0 0 0 8 5.5z"/></svg>';
const ICON_RESTART =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.36"/><path d="M3 4v4h4"/></svg>';
const ICON_X_TINY =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>';
const ICON_POMODORO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5"/><path d="M9 2h6"/><path d="M12 2v2.5"/></svg>';

document.getElementById("closeBtn").innerHTML = ICON_X_LG;
document.getElementById("importBtn").innerHTML = ICON_UPLOAD;
document.getElementById("exportBtn").innerHTML = ICON_DOWNLOAD;
document.getElementById("paletteBtn").innerHTML = ICON_COMMAND;

const COLUMNS = [
  { title: "to do", cards: [] },
  { title: "in progress", cards: [] },
  { title: "done", cards: [] },
];

const STORAGE_KEY = "trell0-board-state";
const CARD_COLORS = [
  "",
  "#FFB3B3",
  "#FFD9B3",
  "#FFFFE0",
  "#B3FFB3",
  "#B3FFFF",
  "#B3B3FF",
  "#FFB3FF",
];

let uid = 1;

function getCleanText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
function esc(c) {
  return c
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function titleFromBody(body) {
  return getCleanText(body).trim().split("\n")[0] || "untitled";
}

const board = document.getElementById("board");

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return COLUMNS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return COLUMNS;
    return parsed.map((col, i) => ({
      title: col.title || COLUMNS[i]?.title || "untitled",
      cards: Array.isArray(col.cards)
        ? col.cards.map((item) => {
            if (typeof item === "string")
              return { body: item, color: "" };
            return {
              body: item?.body || "",
              color: item?.color || "",
            };
          })
        : [],
    }));
  } catch {
    return COLUMNS;
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function exportBoard() {
  syncStateFromDOM();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trell0-board.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importBoard(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error();
      const validated = parsed.map((col, i) => ({
        title: col.title || COLUMNS[i]?.title || "untitled",
        cards: Array.isArray(col.cards)
          ? col.cards.map((item) => {
              if (typeof item === "string")
                return { body: item, color: "" };
              return {
                body: item?.body || "",
                color: item?.color || "",
              };
            })
          : [],
      }));
      if (activeCard) closeEditor();
      state = validated;
      saveState();
      buildBoard();
    } catch {
      alert("Invalid board file.");
    }
  };
  reader.readAsText(file);
  fileInput.value = "";
}

function syncStateFromDOM() {
  state = [...board.querySelectorAll(".column")].map((col) => ({
    title: col.querySelector(".title")?.textContent || "untitled",
    cards: [...col.querySelectorAll(".card:not(.card-removing)")].map(
      (card) => ({
        body: card.dataset.body || "",
        color: card.dataset.color || "",
      }),
    ),
  }));
}

function makeCard(input) {
  const body = typeof input === "string" ? input : input?.body || "";
  const color = typeof input === "string" ? "" : input?.color || "";
  const card = document.createElement("div");
  card.className = "card card-enter";
  card.draggable = true;
  card.dataset.id = "c" + uid++;
  card.dataset.body = body || "";
  card.dataset.color = color;

  const title = document.createElement("span");
  title.className = "card-title";
  card.appendChild(title);

  const x = document.createElement("button");
  x.className = "card-x";
  x.innerHTML = ICON_X;
  card.appendChild(x);

  refreshCard(card);

  card.addEventListener("click", () => openEditor(card));
  x.addEventListener("click", (e) => {
    e.stopPropagation();
    const add = card.closest(".column").querySelector(".add-card");

    const movers = [];
    let sib = card.nextElementSibling;
    while (sib) {
      if (sib.classList.contains("card")) movers.push(sib);
      sib = sib.nextElementSibling;
    }
    movers.push(add);
    const fromTops = movers.map((el) => el.getBoundingClientRect().top);

    const offTop = card.offsetTop;
    const w = card.offsetWidth;
    card.style.position = "absolute";
    card.style.top = offTop + "px";
    card.style.left = "0";
    card.style.width = w + "px";
    card.style.margin = "0";
    card.classList.add("card-removing");

    movers.forEach((el, i) => animateAddButton(el, fromTops[i]));

    syncStateFromDOM();
    updateCounts();
    saveState();

    card.addEventListener(
      "animationend",
      () => {
        card.remove();
      },
      { once: true },
    );
  });

  card.addEventListener("dragstart", () => {
    dragged = card;
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    dragged = null;
    document
      .querySelectorAll(".cards.drag-over")
      .forEach((c) => c.classList.remove("drag-over"));
  });

  return card;
}

function refreshCard(card) {
  const body = card.dataset.body;
  const clean = titleFromBody(body);
  card.querySelector(".card-title").textContent = clean;
  card.classList.toggle("empty", !getCleanText(body).trim());
  if (card.dataset.color) {
    card.style.setProperty("--card-bg", card.dataset.color);
    card.style.setProperty("--card-fg", "#1a1a1a");
  } else {
    card.style.removeProperty("--card-bg");
    card.style.removeProperty("--card-fg");
  }
}

function buildBoard() {
  board.innerHTML = "";
  state.forEach((col, colIndex) => {
    const column = document.createElement("div");
    column.className = "column";

    const header = document.createElement("div");
    header.className = "column-header";
    header.innerHTML =
      '<span class="title">' +
      col.title +
      '</span><span class="count"></span>';
    column.appendChild(header);

    const cards = document.createElement("div");
    cards.className = "cards no-scrollbar";
    column.appendChild(cards);

    col.cards.forEach((text) => cards.appendChild(makeCard(text)));

    const add = document.createElement("button");
    add.className = "add-card";
    add.innerHTML = ICON_PLUS + "<span>add card</span>";
    add.addEventListener("click", () => {
      const addTop = add.getBoundingClientRect().top;
      const c = makeCard({ body: "", color: "" });
      cards.appendChild(c);

      state[colIndex].cards.push({ body: "", color: "" });
      updateCounts();
      saveState();
      animateAddButton(add, addTop);

      setTimeout(() => {
        c.classList.remove("card-enter");
      }, 520);
    });
    column.appendChild(add);

    cards.addEventListener("dragover", (e) => {
      e.preventDefault();
      cards.classList.add("drag-over");
      if (!dragged) return;
      const after = afterElement(cards, e.clientY);
      if (after == null) cards.appendChild(dragged);
      else cards.insertBefore(dragged, after);
    });
    cards.addEventListener("dragleave", (e) => {
      if (!cards.contains(e.relatedTarget))
        cards.classList.remove("drag-over");
    });
    cards.addEventListener("drop", (e) => {
      e.preventDefault();
      cards.classList.remove("drag-over");
      syncStateFromDOM();
      updateCounts();
      saveState();
    });

    board.appendChild(column);
  });
  updateCounts();
}

function afterElement(container, y) {
  const els = [...container.querySelectorAll(".card:not(.dragging)")];
  let closest = { offset: -Infinity, el: null };
  for (const el of els) {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) closest = { offset, el };
  }
  return closest.el;
}

function animateAddButton(add, fromTop) {
  const toTop = add.getBoundingClientRect().top;
  const delta = fromTop - toTop;
  if (!delta) return;
  const easing =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--curve")
      .trim() || "cubic-bezier(0.16, 1, 0.3, 1)";
  add.getAnimations().forEach((anim) => anim.cancel());
  add.animate(
    [
      { transform: `translateY(${delta}px)` },
      { transform: "translateY(0)" },
    ],
    { duration: 520, easing },
  );
}

function updateCounts() {
  document.querySelectorAll(".column").forEach((col) => {
    const n = col.querySelectorAll(".card:not(.card-removing)").length;
    col.querySelector(".count").textContent = n;
  });
}

function addCardToColumn(colIndex, body) {
  const columns = board.querySelectorAll(".column");
  const column = columns[colIndex];
  if (!column || !state[colIndex]) return;
  const cards = column.querySelector(".cards");
  const add = column.querySelector(".add-card");
  const addTop = add.getBoundingClientRect().top;

  const c = makeCard({ body: body || "", color: "" });
  cards.appendChild(c);

  state[colIndex].cards.push({ body: body || "", color: "" });
  updateCounts();
  saveState();
  animateAddButton(add, addTop);

  setTimeout(() => c.classList.remove("card-enter"), 520);
}

let dragged = null;

const overlay = document.getElementById("overlay");
const backdrop = document.getElementById("backdrop");
const editor = document.getElementById("editor");
const cursorEl = document.getElementById("cursor");
const statusBar = document.getElementById("status");
const closeBtn = document.getElementById("closeBtn");
const cardColorPicker = document.getElementById("cardColorPicker");

let activeCard = null;
let isTyping = false;
let syncTimeout = null;
let typingTimeout = null;

function renderColorPicker() {
  cardColorPicker.innerHTML = "";
  CARD_COLORS.forEach((color, i) => {
    const dot = document.createElement("button");
    dot.className = "color-dot";
    dot.type = "button";
    dot.style.setProperty("--dot", color || "var(--card)");
    dot.title = i === 0 ? "default" : "set card color";
    dot.addEventListener("click", () => {
      if (!activeCard) return;
      activeCard.dataset.color = color;
      refreshCard(activeCard);
      syncStateFromDOM();
      saveState();
      syncColorPickerState();
    });
    cardColorPicker.appendChild(dot);
  });
}

function syncColorPickerState() {
  const selected = activeCard?.dataset.color || "";
  [...cardColorPicker.querySelectorAll(".color-dot")].forEach(
    (dot, i) => {
      dot.classList.toggle("active", CARD_COLORS[i] === selected);
    },
  );
}

function setTyping(t) {
  isTyping = t;
  statusBar.classList.toggle("status-hidden", t);
  statusBar.classList.toggle("status-visible", !t);
}

function updateWordCount() {
  const text = getCleanText(editor.innerHTML).trim();
  const wc = text ? text.split(/\s+/).length : 0;
  statusBar.textContent = wc + (wc === 1 ? " word" : " words");
}

function updateCursorPos() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editor) return;

  const range = selection.getRangeAt(0).cloneRange();
  let rect;

  if (range.collapsed) {
    const dummy = document.createElement("span");
    dummy.textContent = "\u200b";
    range.insertNode(dummy);
    rect = dummy.getBoundingClientRect();
    const parent = dummy.parentNode;
    if (parent) {
      parent.removeChild(dummy);
      parent.normalize();
    }
  } else {
    rect = range.getBoundingClientRect();
  }

  if (rect) {
    const editorRect = editor.getBoundingClientRect();
    cursorEl.style.left = rect.left - editorRect.left + "px";
    cursorEl.style.top = rect.top - editorRect.top + "px";
  }
}

function edit() {
  if (!editor) return;
  const val = editor.innerHTML;

  setTyping(true);
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => setTyping(false), 800);

  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    if (activeCard) {
      activeCard.dataset.body = val;
      refreshCard(activeCard);
      syncStateFromDOM();
      saveState();
    }
  }, 1000);

  updateWordCount();
  updateCursorPos();
}

function handleKeyDown(e) {
  const isMod = e.metaKey || e.ctrlKey;

  if (e.key === "Escape") {
    closeEditor();
    return;
  }

  if (e.key === "Enter") {
    editor
      .querySelectorAll(".char-fade:not(.stable)")
      .forEach((el) => el.classList.add("stable"));
    setTimeout(() => {
      edit();
      updateCursorPos();
    }, 10);
    return;
  }

  if (e.key.length === 1 && !isMod) {
    e.preventDefault();
    const char = e.key === " " ? "&nbsp;" : esc(e.key);
    const html = '<span class="char-fade">' + char + "</span>";
    document.execCommand("insertHTML", false, html);

    const lastChar = editor.querySelector(".char-fade:not(.stable)");
    if (lastChar) setTimeout(() => lastChar.classList.add("stable"), 400);

    edit();
  }

  if (e.key === "Tab") {
    e.preventDefault();
    document.execCommand("insertHTML", false, "&nbsp;&nbsp;");
    edit();
  }

  setTimeout(updateCursorPos, 0);
}

editor.addEventListener("input", edit);
editor.addEventListener("keydown", handleKeyDown);
editor.addEventListener("mouseup", updateCursorPos);
editor.addEventListener("keyup", updateCursorPos);

function openEditor(card) {
  if (activeCard === card) return;
  if (activeCard) closeEditor();

  activeCard = card;

  editor.innerHTML = card.dataset.body || "";
  editor
    .querySelectorAll(".char-fade")
    .forEach((el) => el.classList.add("stable"));

  setTyping(false);
  updateWordCount();
  syncColorPickerState();

  overlay.classList.add("open");
  requestAnimationFrame(() => {
    editor.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    requestAnimationFrame(updateCursorPos);
  });
}

function closeEditor() {
  if (!activeCard) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  activeCard.dataset.body = editor.innerHTML;
  refreshCard(activeCard);
  syncStateFromDOM();
  saveState();
  activeCard = null;
  overlay.classList.remove("open");
}

backdrop.addEventListener("click", () => closeEditor());

closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeEditor();
});

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
  themeToggle.title =
    theme === "dark" ? "switch to light" : "switch to dark";
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

applyTheme(currentTheme());

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("trell0-theme", next);
  } catch {}
});

const themeMedia =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
if (themeMedia && themeMedia.addEventListener) {
  themeMedia.addEventListener("change", (e) => {
    let saved;
    try {
      saved = localStorage.getItem("trell0-theme");
    } catch {}
    if (saved !== "dark" && saved !== "light") {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");
const fileInput = document.getElementById("importInput");

importBtn.addEventListener("click", () => fileInput.click());
exportBtn.addEventListener("click", exportBoard);
fileInput.addEventListener("change", () =>
  importBoard(fileInput.files[0]),
);

const timerStack = document.getElementById("timerStack");
const TIMERS_KEY = "trell0-timers";
const RING_R = 15;
const RING_CIRC = 2 * Math.PI * RING_R;

let timers = [];
let timerUid = 1;
let tickHandle = null;
let audioCtx = null;
const chipEls = {};

function elapsedOf(t) {
  return (
    t.accumMs + (t.running && t.startedAt ? Date.now() - t.startedAt : 0)
  );
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

function formatClock(ms, ceilSec) {
  if (ms < 0) ms = 0;
  const totalSec = ceilSec ? Math.ceil(ms / 1000) : Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return h + ":" + pad(m) + ":" + pad(s);
  return m + ":" + pad(s);
}

function startTimer(durationMs) {
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

function startStopwatch() {
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

function startPomodoro(workMs, breakMs) {
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
      const frac =
        t.durationMs > 0 ? Math.min(1, elapsed / t.durationMs) : 1;
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

function initTimers() {
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

const paletteOverlay = document.getElementById("paletteOverlay");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteEl = document.getElementById("palette");
const paletteInput = document.getElementById("paletteInput");
const paletteLead = document.getElementById("paletteLead");
const paletteBody = document.getElementById("paletteBody");
const paletteFooterEl = document.getElementById("paletteFooter");
const paletteBtn = document.getElementById("paletteBtn");

let palMode = "root";
let palSelected = 0;
let palRows = [];
let palAddColumn = 0;
let palHintTimeout = null;

const TIMER_PRESETS = [5, 10, 15, 25, 45];

function columnNames() {
  return state.map((c) => c.title || "untitled");
}

function commandList() {
  return [
    {
      icon: ICON_PLUS_SM,
      label: "add a task",
      keywords: "add task card new todo create item",
      run: enterAddMode,
    },
    {
      icon: ICON_TIMER,
      label: "start a timer",
      keywords: "timer countdown start time focus",
      run: enterTimerMode,
    },
    {
      icon: ICON_POMODORO,
      label: "start a pomodoro",
      keywords: "pomodoro timer focus work break cycle tomato time",
      run: enterPomodoroMode,
    },
    {
      icon: ICON_STOPWATCH,
      label: "start a stopwatch",
      keywords: "stopwatch count up start time elapsed track",
      run: () => {
        startStopwatch();
        closePalette();
      },
    },
    {
      icon: ICON_THEME_CMD,
      label: "toggle theme",
      keywords: "theme dark light mode toggle appearance color",
      run: () => {
        themeToggle.click();
        closePalette();
      },
    },
    {
      icon: ICON_DOWNLOAD,
      label: "export board",
      keywords: "export download save json backup",
      run: () => {
        exportBoard();
        closePalette();
      },
    },
    {
      icon: ICON_UPLOAD,
      label: "import board",
      keywords: "import upload load json restore open file",
      run: () => {
        closePalette();
        setTimeout(() => fileInput.click(), 60);
      },
    },
  ];
}

function setBackgroundInert(on) {
  [board, document.getElementById("topActions"), timerStack].forEach(
    (el) => {
      if (!el) return;
      if (on) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    },
  );
}

function openPalette() {
  if (paletteOverlay.classList.contains("open")) return;
  if (activeCard) closeEditor();
  palMode = "root";
  palSelected = 0;
  palAddColumn = 0;
  paletteInput.value = "";
  paletteOverlay.classList.add("open");
  setBackgroundInert(true);
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => paletteInput.focus());
}

function closePalette() {
  if (!paletteOverlay.classList.contains("open")) return;
  paletteOverlay.classList.remove("open");
  setBackgroundInert(false);
  paletteInput.blur();
  palMode = "root";
}

function togglePalette() {
  if (paletteOverlay.classList.contains("open")) closePalette();
  else openPalette();
}

function renderLead() {
  paletteLead.className = "palette-lead";
  if (palMode === "root") {
    paletteLead.innerHTML = ICON_CHEVRON;
  } else {
    const label =
      palMode === "add"
        ? "add task"
        : palMode === "pomodoro"
          ? "pomodoro"
          : "timer";
    paletteLead.innerHTML =
      '<span class="mode-chip" role="button" tabindex="0">' +
      label +
      '<span class="mode-chip-x">' +
      ICON_X_TINY +
      "</span></span>";
    const chip = paletteLead.querySelector(".mode-chip");
    chip.addEventListener("click", backToRoot);
  }
}

function setPlaceholder() {
  if (palMode === "add") paletteInput.placeholder = "what needs doing?";
  else if (palMode === "timer")
    paletteInput.placeholder = "minutes — or mm:ss (e.g. 25 or 5:00)";
  else if (palMode === "pomodoro")
    paletteInput.placeholder = "work/break minutes — e.g. 25/5";
  else paletteInput.placeholder = "type a command…";
}

function renderBody() {
  if (palMode === "root") renderRoot();
  else if (palMode === "add") renderAdd();
  else if (palMode === "timer") renderTimerMode();
  else if (palMode === "pomodoro") renderPomodoroMode();
  paletteFooterEl.style.display = palMode === "root" ? "" : "none";
}

function renderRoot() {
  const q = paletteInput.value.trim().toLowerCase();
  const all = commandList();
  const filtered = q
    ? all.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.keywords.toLowerCase().includes(q),
      )
    : all;
  palRows = filtered;
  if (palSelected >= filtered.length) palSelected = 0;

  if (filtered.length === 0) {
    paletteBody.innerHTML =
      '<div class="palette-empty">no matching commands</div>';
    return;
  }

  paletteBody.innerHTML = "";
  filtered.forEach((cmd, i) => {
    const row = document.createElement("button");
    row.className =
      "palette-row" + (i === palSelected ? " selected" : "");
    row.type = "button";
    row.style.animationDelay = i * 18 + "ms";
    row.innerHTML =
      '<span class="row-icon">' +
      cmd.icon +
      '</span><span class="row-label">' +
      cmd.label +
      '</span><span class="row-key">↵</span>';
    row.addEventListener("click", () => runCommand(i));
    row.addEventListener("mousemove", () => setSelected(i));
    paletteBody.appendChild(row);
  });
}

function setSelected(i) {
  if (i < 0 || i >= palRows.length) return;
  palSelected = i;
  const rows = paletteBody.querySelectorAll(".palette-row");
  rows.forEach((r, idx) => r.classList.toggle("selected", idx === i));
  if (rows[i]) rows[i].scrollIntoView({ block: "nearest" });
}

function runCommand(i) {
  const cmd = palRows[i];
  if (cmd && typeof cmd.run === "function") cmd.run();
}

function enterAddMode() {
  palMode = "add";
  paletteInput.value = "";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => paletteInput.focus());
}

function renderAdd() {
  const names = columnNames();
  if (palAddColumn >= names.length) palAddColumn = 0;
  paletteBody.innerHTML = "";

  const chips = document.createElement("div");
  chips.className = "palette-chips";
  names.forEach((name, i) => {
    const chip = document.createElement("button");
    chip.className =
      "palette-chip" + (i === palAddColumn ? " active" : "");
    chip.type = "button";
    chip.innerHTML = '<span class="chip-dot"></span>' + name;
    chip.addEventListener("click", () => {
      palAddColumn = i;
      [...chips.children].forEach((c, idx) =>
        c.classList.toggle("active", idx === i),
      );
      const text = paletteInput.value.trim();
      if (text) {
        addCardToColumn(i, text);
        paletteInput.value = "";
        flashHint('added to "' + name + '" ✓');
      } else {
        updateAddHint();
      }
      paletteInput.focus();
    });
    chips.appendChild(chip);
  });
  paletteBody.appendChild(chips);

  const hint = document.createElement("div");
  hint.className = "palette-hint";
  hint.id = "paletteHint";
  paletteBody.appendChild(hint);
  updateAddHint();
}

function updateAddHint() {
  const hint = document.getElementById("paletteHint");
  if (!hint) return;
  const name = columnNames()[palAddColumn] || "to do";
  hint.textContent = 'enter adds to "' + name + '" · pick a column above';
}

function submitAdd() {
  const text = paletteInput.value.trim();
  const name = columnNames()[palAddColumn] || "to do";
  if (!text) {
    flashHint("type a task first");
    return;
  }
  addCardToColumn(palAddColumn, text);
  paletteInput.value = "";
  flashHint('added to "' + name + '" ✓');
}

function flashHint(msg) {
  const hint = document.getElementById("paletteHint");
  if (!hint) return;
  hint.textContent = msg;
  hint.classList.add("flash");
  if (palHintTimeout) clearTimeout(palHintTimeout);
  palHintTimeout = setTimeout(() => {
    hint.classList.remove("flash");
    updateAddHint();
  }, 1400);
}

function enterTimerMode() {
  palMode = "timer";
  paletteInput.value = "25";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => {
    paletteInput.focus();
    paletteInput.select();
  });
}

function renderTimerMode() {
  paletteBody.innerHTML = "";
  const chips = document.createElement("div");
  chips.className = "palette-chips";
  TIMER_PRESETS.forEach((min) => {
    const chip = document.createElement("button");
    chip.className = "palette-chip";
    chip.type = "button";
    chip.innerHTML = '<span class="chip-dot"></span>' + min + " min";
    chip.addEventListener("click", () => {
      startTimer(min * 60 * 1000);
      closePalette();
    });
    chips.appendChild(chip);
  });
  paletteBody.appendChild(chips);

  const hint = document.createElement("div");
  hint.className = "palette-hint";
  hint.id = "paletteHint";
  hint.textContent = "pick a preset · or type a duration and press enter";
  paletteBody.appendChild(hint);
}

function submitTimer() {
  const ms = parseDuration(paletteInput.value.trim());
  if (ms == null || ms <= 0) {
    flashTimerError();
    return;
  }
  startTimer(ms);
  closePalette();
}

function flashTimerError() {
  const hint = document.getElementById("paletteHint");
  if (!hint) return;
  hint.textContent = "hmm — try 25, or 5:00, or 90s";
  hint.classList.add("flash");
  if (palHintTimeout) clearTimeout(palHintTimeout);
  palHintTimeout = setTimeout(() => {
    hint.classList.remove("flash");
    hint.textContent =
      "pick a preset · or type a duration and press enter";
  }, 1600);
}

function enterPomodoroMode() {
  palMode = "pomodoro";
  paletteInput.value = "25/5";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => {
    paletteInput.focus();
    paletteInput.select();
  });
}

function renderPomodoroMode() {
  paletteBody.innerHTML = "";
  const chips = document.createElement("div");
  chips.className = "palette-chips";
  const presets = [
    { work: 25, rest: 5, label: "25/5" },
    { work: 50, rest: 10, label: "50/10" },
    { work: 90, rest: 20, label: "90/20" },
  ];
  presets.forEach((p) => {
    const chip = document.createElement("button");
    chip.className = "palette-chip";
    chip.type = "button";
    chip.innerHTML = '<span class="chip-dot"></span>' + p.label + " min";
    chip.addEventListener("click", () => {
      startPomodoro(p.work * 60 * 1000, p.rest * 60 * 1000);
      closePalette();
    });
    chips.appendChild(chip);
  });
  paletteBody.appendChild(chips);

  const hint = document.createElement("div");
  hint.className = "palette-hint";
  hint.id = "paletteHint";
  hint.textContent =
    "pick a preset, or type work/break minutes (e.g. 25/5) and press enter";
  paletteBody.appendChild(hint);
}

function submitPomodoro() {
  const input = paletteInput.value.trim();
  const parts = input.split("/").map((s) => s.trim());
  if (parts.length < 1 || parts.length > 2) {
    flashPomodoroError();
    return;
  }
  const workStr = parts[0];
  const breakStr = parts.length === 2 ? parts[1] : "5";
  const workMs = parseDuration(workStr);
  const breakMs = parseDuration(breakStr);
  if (workMs == null || breakMs == null || workMs <= 0 || breakMs <= 0) {
    flashPomodoroError();
    return;
  }
  startPomodoro(workMs, breakMs);
  closePalette();
}

function flashPomodoroError() {
  const hint = document.getElementById("paletteHint");
  if (!hint) return;
  hint.textContent = "try 25/5, or 50/10, or 90/20";
  hint.classList.add("flash");
  if (palHintTimeout) clearTimeout(palHintTimeout);
  palHintTimeout = setTimeout(() => {
    hint.classList.remove("flash");
    hint.textContent =
      "pick a preset, or type work/break minutes (e.g. 25/5) and press enter";
  }, 1600);
}

function parseDuration(str) {
  if (!str) return null;
  str = str.trim().toLowerCase();
  if (str.includes(":")) {
    const parts = str.split(":").map((p) => parseInt(p, 10));
    if (parts.some((n) => isNaN(n))) return null;
    let h = 0,
      m = 0,
      s = 0;
    if (parts.length === 2) {
      m = parts[0];
      s = parts[1];
    } else if (parts.length === 3) {
      h = parts[0];
      m = parts[1];
      s = parts[2];
    } else {
      return null;
    }
    return (h * 3600 + m * 60 + s) * 1000;
  }
  const match = str.match(/^(\d+(?:\.\d+)?)\s*([a-z]*)$/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  if (isNaN(val)) return null;
  const unit = match[2];
  if (
    unit === "" ||
    unit === "m" ||
    unit === "min" ||
    unit === "mins" ||
    unit === "minute" ||
    unit === "minutes"
  )
    return val * 60 * 1000;
  if (
    unit === "s" ||
    unit === "sec" ||
    unit === "secs" ||
    unit === "second" ||
    unit === "seconds"
  )
    return val * 1000;
  if (
    unit === "h" ||
    unit === "hr" ||
    unit === "hrs" ||
    unit === "hour" ||
    unit === "hours"
  )
    return val * 3600 * 1000;
  return null;
}

function backToRoot() {
  palMode = "root";
  palSelected = 0;
  paletteInput.value = "";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => paletteInput.focus());
}

paletteInput.addEventListener("input", () => {
  if (palMode === "root") {
    palSelected = 0;
    renderRoot();
  }
});

paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (palMode === "root") runCommand(palSelected);
    else if (palMode === "add") submitAdd();
    else if (palMode === "timer") submitTimer();
    else if (palMode === "pomodoro") submitPomodoro();
  } else if (
    e.key === "Backspace" &&
    paletteInput.value === "" &&
    palMode !== "root"
  ) {
    e.preventDefault();
    backToRoot();
  }
});

paletteOverlay.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    closePalette();
    return;
  }
  if (palMode === "root") {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected(Math.min(palSelected + 1, palRows.length - 1));
      paletteInput.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(Math.max(palSelected - 1, 0));
      paletteInput.focus();
    }
  }
});

paletteBackdrop.addEventListener("click", () => closePalette());
paletteBtn.addEventListener("click", () => openPalette());

document.addEventListener(
  "keydown",
  (e) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      e.shiftKey &&
      (e.key === "p" || e.key === "P" || e.code === "KeyP")
    ) {
      e.preventDefault();
      togglePalette();
    }
  },
  true,
);

buildBoard();
renderColorPicker();
initTimers();
