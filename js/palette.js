import {
  ICON_CHEVRON,
  ICON_X_TINY,
  ICON_PLUS_SM,
  ICON_BOARD,
  ICON_UNDO,
  ICON_REDO,
  ICON_TIMER,
  ICON_POMODORO,
  ICON_STOPWATCH,
  ICON_THEME_CMD,
  ICON_DOWNLOAD,
  ICON_UPLOAD,
  ICON_SHARE,
  ICON_CHECK,
} from "./icons.js";
import {
  getState,
  replaceState,
  saveState,
  getUndoStack,
  getRedoStack,
  activeBoard,
  createBoard,
  esc,
} from "./state.js";
import {
  addCardToColumn,
  openBoard,
  buildBoard,
  exportBoard,
  shareBoard,
  fileInput,
} from "./board.js";
import { clearActiveCard, closeEditor } from "./editor.js";
import { startTimer, startStopwatch, startPomodoro } from "./timers.js";
import { submitThemeById, currentTheme, THEMES } from "./theme.js";

const paletteOverlay = document.getElementById("paletteOverlay");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteInput = document.getElementById("paletteInput");
const paletteLead = document.getElementById("paletteLead");
const paletteBody = document.getElementById("paletteBody");
const paletteFooterEl = document.getElementById("paletteFooter");

let palMode = "root";
let palSelected = 0;
let palRows = [];
let palAddColumn = 0;
let palHintTimeout = null;

const TIMER_PRESETS = [5, 10, 15, 25, 45];

function columnNames() {
  const board = activeBoard();
  return board ? board.columns.map((c) => c.title || "untitled") : [];
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
      icon: ICON_BOARD,
      label: "boards",
      keywords: "board switch create new rename delete manage",
      run: enterBoardMode,
    },
    {
      icon: ICON_UNDO,
      label: "undo",
      keywords: "undo revert back",
      run: () => {
        handleUndo();
        closePalette();
      },
    },
    {
      icon: ICON_REDO,
      label: "redo",
      keywords: "redo forward restore",
      run: () => {
        handleRedo();
        closePalette();
      },
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
      label: "themes",
      keywords:
        "theme dark light mode toggle appearance color midnight sunset forest catppuccin solarized pick",
      run: enterThemeMode,
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
    {
      icon: ICON_SHARE,
      label: "share board",
      keywords: "share link URL copy board send collab export",
      run: () => {
        shareBoard();
        closePalette();
      },
    },
  ];
}

export function handleUndo() {
  const undoStack = getUndoStack();
  const redoStack = getRedoStack();
  if (undoStack.length === 0) return;
  redoStack.push(JSON.parse(JSON.stringify(getState())));
  replaceState(undoStack.pop());
  saveState();
  clearActiveCard();
  buildBoard();
}

export function handleRedo() {
  const undoStack = getUndoStack();
  const redoStack = getRedoStack();
  if (redoStack.length === 0) return;
  undoStack.push(JSON.parse(JSON.stringify(getState())));
  replaceState(redoStack.pop());
  saveState();
  clearActiveCard();
  buildBoard();
}

function setBackgroundInert(on) {
  const boardEl = document.getElementById("board");
  const timerStack = document.getElementById("timerStack");
  [
    boardEl,
    timerStack,
    document.getElementById("sidebar"),
    document.getElementById("sidebarToggle"),
  ].forEach((el) => {
    if (!el) return;
    if (on) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  });
}

export function openPalette() {
  if (paletteOverlay.classList.contains("open")) return;
  const overlay = document.getElementById("overlay");
  if (overlay && overlay.classList.contains("open")) closeEditor();
  palMode = "root";
  palSelected = 0;
  palAddColumn = 0;
  paletteInput.value = "";
  paletteOverlay.classList.add("open");
  setBackgroundInert(true);
  renderLead();
  setPlaceholder();
  renderBody();
  paletteInput.focus();
}

export function closePalette() {
  if (!paletteOverlay.classList.contains("open")) return;
  paletteOverlay.classList.remove("open");
  setBackgroundInert(false);
  paletteInput.blur();
  palMode = "root";
}

export function togglePalette() {
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
          : palMode === "theme"
            ? "themes"
            : palMode === "board"
              ? "boards"
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
    paletteInput.placeholder = "minutes \u2014 or mm:ss (e.g. 25 or 5:00)";
  else if (palMode === "pomodoro")
    paletteInput.placeholder = "work/break minutes \u2014 e.g. 25/5";
  else if (palMode === "board")
    paletteInput.placeholder = "pick a board or type new name\u2026";
  else paletteInput.placeholder = "type a command\u2026";
}

function renderBody() {
  if (palMode === "root") renderRoot();
  else if (palMode === "add") renderAdd();
  else if (palMode === "timer") renderTimerMode();
  else if (palMode === "pomodoro") renderPomodoroMode();
  else if (palMode === "theme") renderThemeMode();
  else if (palMode === "board") renderBoardMode();
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
    row.className = "palette-row" + (i === palSelected ? " selected" : "");
    row.type = "button";
    row.style.animationDelay = i * 18 + "ms";
    row.innerHTML =
      '<span class="row-icon">' +
      cmd.icon +
      '</span><span class="row-label">' +
      cmd.label +
      '</span><span class="row-key">\u21B5</span>';
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
    chip.className = "palette-chip" + (i === palAddColumn ? " active" : "");
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
        flashHint('added to "' + name + '" \u2713');
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
  hint.textContent = 'enter adds to "' + name + '" \u00b7 pick a column above';
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
  flashHint('added to "' + name + '" \u2713');
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
  hint.textContent = "pick a preset \u00b7 or type a duration and press enter";
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
  hint.textContent = "hmm \u2014 try 25, or 5:00, or 90s";
  hint.classList.add("flash");
  if (palHintTimeout) clearTimeout(palHintTimeout);
  palHintTimeout = setTimeout(() => {
    hint.classList.remove("flash");
    hint.textContent =
      "pick a preset \u00b7 or type a duration and press enter";
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

function enterThemeMode() {
  palMode = "theme";
  palSelected = 0;
  paletteInput.value = "";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => paletteInput.focus());
}

function renderThemeMode() {
  const q = paletteInput.value.trim().toLowerCase();
  const current = currentTheme();
  const filtered = q
    ? THEMES.filter((t) => t.label.toLowerCase().includes(q))
    : THEMES;
  palRows = filtered;
  if (palSelected >= filtered.length) palSelected = 0;

  paletteBody.innerHTML = "";
  if (filtered.length === 0) {
    paletteBody.innerHTML =
      '<div class="palette-empty">no matching themes</div>';
    return;
  }

  filtered.forEach((t, i) => {
    const row = document.createElement("button");
    row.className = "palette-row" + (i === palSelected ? " selected" : "");
    row.type = "button";
    row.style.animationDelay = i * 18 + "ms";
    row.innerHTML =
      '<span class="row-icon">' +
      (t.id === current ? ICON_CHECK : "") +
      '</span><span class="row-label">' +
      t.label +
      "</span>";
    row.addEventListener("click", () => {
      submitThemeById(t.id);
      closePalette();
    });
    row.addEventListener("mousemove", () => setSelected(i));
    paletteBody.appendChild(row);
  });
}

function submitTheme() {
  const cmd = palRows[palSelected];
  if (!cmd) return;
  submitThemeById(cmd.id);
  closePalette();
}

function enterBoardMode() {
  palMode = "board";
  palSelected = 0;
  paletteInput.value = "";
  renderLead();
  setPlaceholder();
  renderBody();
  requestAnimationFrame(() => paletteInput.focus());
}

function renderBoardMode() {
  const q = paletteInput.value.trim().toLowerCase();
  const _state = getState();
  const filtered = q
    ? _state.boards.filter((b) => b.name.toLowerCase().includes(q))
    : _state.boards;

  const showCreate =
    q && !_state.boards.some((b) => b.name.toLowerCase() === q);

  paletteBody.innerHTML = "";

  if (filtered.length === 0 && !showCreate) {
    paletteBody.innerHTML =
      '<div class="palette-empty">no matching boards</div>';
    return;
  }

  const chips = document.createElement("div");
  chips.className = "palette-chips";

  if (showCreate) {
    const chip = document.createElement("button");
    chip.className = "palette-chip active";
    chip.type = "button";
    chip.innerHTML = '<span class="chip-dot"></span>create "' + esc(q) + '"';
    chip.addEventListener("click", () => {
      createBoard(q);
      closePalette();
    });
    chips.appendChild(chip);
  }

  filtered.forEach((b) => {
    const chip = document.createElement("button");
    chip.className =
      "palette-chip" + (b.id === _state.activeBoardId ? " active" : "");
    chip.type = "button";
    const count = b.columns.reduce((sum, c) => sum + c.cards.length, 0);
    chip.innerHTML =
      '<span class="chip-dot"></span>' +
      esc(b.name) +
      (count > 0 ? ' <span style="opacity:0.35">' + count + "</span>" : "");
    chip.addEventListener("click", () => {
      if (b.id !== _state.activeBoardId) {
        openBoard(b.id);
      }
      closePalette();
    });
    chips.appendChild(chip);
  });

  paletteBody.appendChild(chips);

  const hint = document.createElement("div");
  hint.className = "palette-hint";
  hint.textContent = showCreate
    ? "press enter to create \u2014 or pick a board"
    : "type a name to create \u2014 or pick a board";
  paletteBody.appendChild(hint);

  palRows = showCreate ? [{ id: "create" }, ...filtered] : filtered;
  palSelected = 0;
}

function submitBoard() {
  const q = paletteInput.value.trim();
  if (!q) return;
  const _state = getState();
  const existing = _state.boards.find(
    (b) => b.name.toLowerCase() === q.toLowerCase(),
  );
  if (existing) {
    if (existing.id !== _state.activeBoardId) openBoard(existing.id);
    closePalette();
    return;
  }
  createBoard(q);
  closePalette();
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
  } else if (palMode === "theme") {
    palSelected = 0;
    renderThemeMode();
  } else if (palMode === "board") {
    palSelected = 0;
    renderBoardMode();
  }
});

paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (palMode === "root") runCommand(palSelected);
    else if (palMode === "add") submitAdd();
    else if (palMode === "timer") submitTimer();
    else if (palMode === "pomodoro") submitPomodoro();
    else if (palMode === "theme") submitTheme();
    else if (palMode === "board") submitBoard();
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
  if (palMode === "root" || palMode === "theme" || palMode === "board") {
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
