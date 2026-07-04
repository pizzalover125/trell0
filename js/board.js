import {
  ICON_X,
  ICON_PLUS,
  ICON_X_TINY,
  ICON_CHEVRON_LEFT,
  ICON_CHECKBOX,
  ICON_X_LG,
} from "./icons.js";
import {
  getState,
  saveState,
  pushSnapshot,
  activeBoard,
  getCleanText,
  esc,
  titleFromBody,
  generateBoardId,
  utf8ToBase64,
  base64ToUtf8,
  renameBoard,
  deleteBoard,
  switchBoard,
  setBoardEmoji,
  setBoardColor,
} from "./state.js";
import { activeCard, closeEditor, openEditor } from "./editor.js";
import { timerStack } from "./timers.js";

export const boardEl = document.getElementById("board");
export const fileInput = document.getElementById("importInput");

let uid = 1;
let dragged = null;
let touchDragged = null;
let touchStartPos = null;
let touchStartTarget = null;
let animating = false;

fileInput.addEventListener("change", () => importBoard(fileInput.files[0]));

export function showNotification(message, duration = 3000) {
  const chip = document.createElement("div");
  chip.className = "timer-chip";

  const indicator = document.createElement("div");
  indicator.className = "timer-indicator";
  const dot = document.createElement("div");
  dot.className = "timer-dot";
  dot.style.background = "#FFB3B3";
  indicator.appendChild(dot);

  const main = document.createElement("div");
  main.className = "timer-main";
  const text = document.createElement("div");
  text.className = "timer-time";
  text.style.fontSize = "13px";
  text.style.fontWeight = "400";
  text.textContent = message;
  main.appendChild(text);

  chip.appendChild(indicator);
  chip.appendChild(main);
  timerStack.appendChild(chip);

  setTimeout(() => {
    chip.classList.add("removing");
    chip.addEventListener("animationend", () => chip.remove(), { once: true });
  }, duration);
}

export function syncStateFromDOM() {
  const board = activeBoard();
  if (!board) return;
  board.columns = [...boardEl.querySelectorAll(".column")].map((col) => ({
    title: col.querySelector(".title")?.textContent || "untitled",
    cards: [...col.querySelectorAll(".card:not(.card-removing)")].map(
      (card) => ({
        body: card.dataset.body || "",
        color: card.dataset.color || "",
        tags: JSON.parse(card.dataset.tags || "[]"),
        done: card.dataset.done === "true",
        subtasks: JSON.parse(card.dataset.subtasks || "[]"),
      }),
    ),
  }));
}

export function exportBoard() {
  syncStateFromDOM();
  const board = activeBoard();
  if (!board) return;
  const json = JSON.stringify(board.columns, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (board.name || "board") + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importBoard(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error();
      const board = activeBoard();
      if (!board) throw new Error();
      if (activeCard) closeEditor();
      pushSnapshot();
      board.columns = validateColumns(parsed);
      saveState();
      buildBoard();
    } catch {
      alert("Invalid board file.");
    }
  };
  reader.readAsText(file);
  fileInput.value = "";
}

function validateColumns(cols) {
  return cols.map((col) => ({
    title: col.title || "untitled",
    cards: Array.isArray(col.cards)
      ? col.cards.map((item) => {
          if (typeof item === "string")
            return {
              body: item,
              color: "",
              tags: [],
              done: false,
              subtasks: [],
            };
          return {
            body: item?.body || "",
            color: item?.color || "",
            tags: Array.isArray(item?.tags) ? item.tags : [],
            done: item?.done === true,
            subtasks: Array.isArray(item?.subtasks) ? item.subtasks : [],
          };
        })
      : [],
  }));
}

export function shareBoard() {
  const board = activeBoard();
  if (!board) {
    showNotification("No active board to share.");
    return;
  }
  const view = document.getElementById("boardView");
  if (view && !view.classList.contains("hidden")) {
    showNotification("Open a board first to share it.");
    return;
  }

  syncStateFromDOM();
  const boardData = {
    name: board.name,
    emoji: board.emoji || "",
    columns: board.columns,
  };
  try {
    const jsonStr = JSON.stringify(boardData);
    const base64 = utf8ToBase64(jsonStr);
    const shareUrl =
      window.location.origin + window.location.pathname + "#share=" + base64;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showNotification("Shareable link copied to clipboard!");
      })
      .catch(() => {
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        showNotification("Shareable link copied to clipboard!");
      });
  } catch (e) {
    showNotification("Failed to generate share link.");
    console.error(e);
  }
}

export function checkShareLink() {
  const hash = window.location.hash;
  if (hash.startsWith("#share=")) {
    const base64 = hash.substring(7);
    try {
      const jsonStr = base64ToUtf8(base64);
      const boardData = JSON.parse(jsonStr);

      if (
        boardData &&
        typeof boardData === "object" &&
        boardData.name &&
        Array.isArray(boardData.columns)
      ) {
        const newBoard = {
          id: generateBoardId(),
          name: boardData.name + " (Shared)",
          emoji: boardData.emoji || "",
          columns: validateColumns(boardData.columns),
        };

        const _state = getState();
        _state.boards.push(newBoard);
        _state.activeBoardId = newBoard.id;
        saveState();

        if (history.replaceState) {
          history.replaceState(null, "", window.location.pathname);
        } else {
          window.location.hash = "";
        }

        renderBoardView();
        openBoard(newBoard.id);

        setTimeout(() => {
          showNotification("Imported shared board: " + boardData.name);
        }, 600);
      }
    } catch (e) {
      console.error("Failed to parse shared board data:", e);
      showNotification("Failed to import shared board.");
    }
  }
}

export function makeCard(input) {
  const body = typeof input === "string" ? input : input?.body || "";
  const color = typeof input === "string" ? "" : input?.color || "";
  const tags =
    typeof input === "string"
      ? []
      : Array.isArray(input?.tags)
        ? input.tags
        : [];
  const done = typeof input === "string" ? false : input?.done === true;
  const subtasks =
    typeof input === "string"
      ? []
      : Array.isArray(input?.subtasks)
        ? input.subtasks
        : [];
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.dataset.id = "c" + uid++;
  card.dataset.body = body || "";
  card.dataset.color = color;
  card.dataset.tags = JSON.stringify(tags);
  card.dataset.done = done ? "true" : "false";
  card.dataset.subtasks = JSON.stringify(subtasks);

  const checkbox = document.createElement("button");
  checkbox.className = "card-checkbox";
  checkbox.type = "button";
  checkbox.innerHTML = ICON_CHECKBOX;
  card.appendChild(checkbox);

  const bodyWrap = document.createElement("div");
  bodyWrap.className = "card-body";
  card.appendChild(bodyWrap);

  const title = document.createElement("span");
  title.className = "card-title";
  const titleText = document.createElement("span");
  titleText.className = "card-text";
  const strike = document.createElement("span");
  strike.className = "card-strike";
  title.appendChild(titleText);
  title.appendChild(strike);
  bodyWrap.appendChild(title);

  const x = document.createElement("button");
  x.className = "card-x";
  x.innerHTML = ICON_X;
  card.appendChild(x);

  refreshCard(card);

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    const isDone = card.dataset.done !== "true";
    card.dataset.done = isDone ? "true" : "false";
    refreshCard(card);
    pushSnapshot();
    syncStateFromDOM();
    saveState();
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest(".card-checkbox")) return;
    if (e.target.closest(".card-x")) return;
    openEditor(card);
  });
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

    pushSnapshot();
    syncStateFromDOM();
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

export function refreshCard(card) {
  const body = card.dataset.body;
  const clean = titleFromBody(body);
  const titleEl = card.querySelector(".card-title");
  if (titleEl) {
    const textEl = titleEl.querySelector(".card-text");
    if (textEl) textEl.textContent = clean;
  }
  card.classList.toggle("empty", !getCleanText(body).trim());
  card.classList.toggle("done", card.dataset.done === "true");

  const bodyWrap = card.querySelector(".card-body") || card;
  let tagsContainer = card.querySelector(".card-tags");
  if (!tagsContainer) {
    tagsContainer = document.createElement("div");
    tagsContainer.className = "card-tags";
    bodyWrap.insertBefore(tagsContainer, card.querySelector(".card-title"));
  }
  const tags = JSON.parse(card.dataset.tags || "[]");
  tagsContainer.innerHTML = tags
    .map((t) => `<span class="tag-chip">${esc(t)}</span>`)
    .join("");
  tagsContainer.style.display = tags.length ? "flex" : "none";

  if (card.dataset.color) {
    card.style.setProperty("--card-bg", card.dataset.color);
    card.style.setProperty("--card-fg", "#1a1a1a");
  } else {
    card.style.removeProperty("--card-bg");
    card.style.removeProperty("--card-fg");
  }

  const subtasks = JSON.parse(card.dataset.subtasks || "[]");
  let subEl = card.querySelector(".card-subtasks");
  if (subtasks.length) {
    const done = subtasks.filter((s) => s.done).length;
    if (!subEl) {
      subEl = document.createElement("div");
      subEl.className = "card-subtasks";
      (card.querySelector(".card-body") || card).appendChild(subEl);
    }
    subEl.textContent = done + "/" + subtasks.length + " done";
  } else {
    if (subEl) subEl.remove();
  }
}

export function buildBoard() {
  boardEl.innerHTML = "";
  const board = activeBoard();
  if (!board) return;

  boardEl.addEventListener("dblclick", (e) => {
    if (
      e.target === boardEl ||
      e.target.classList.contains("board-title-area") ||
      e.target.classList.contains("board-columns")
    ) {
      e.preventDefault();
      openBoardEditor(board.id);
    }
  });

  let lastBoardTap = 0;
  boardEl.addEventListener(
    "touchstart",
    (e) => {
      if (
        e.target === boardEl ||
        e.target.classList.contains("board-title-area") ||
        e.target.classList.contains("board-columns")
      ) {
        const now = Date.now();
        const timespan = now - lastBoardTap;
        if (timespan < 300 && timespan > 0) {
          e.preventDefault();
          openBoardEditor(board.id);
        }
        lastBoardTap = now;
      }
    },
    { passive: false },
  );

  const titleArea = document.createElement("div");
  titleArea.className = "board-title-area";

  const emojiBadge = document.createElement("span");
  emojiBadge.className = "board-emoji-badge";
  emojiBadge.textContent = board.emoji || "";
  if (!board.emoji) emojiBadge.style.display = "none";
  titleArea.appendChild(emojiBadge);

  const titleEl = document.createElement("div");
  titleEl.className = "board-title";
  titleEl.textContent = board.name;
  titleEl.addEventListener("click", (e) => {
    e.stopPropagation();
    titleEl.contentEditable = "true";
    titleEl.classList.add("editing");
    titleEl.focus();
    const range = document.createRange();
    range.selectNodeContents(titleEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
  titleEl.addEventListener("blur", () => {
    titleEl.contentEditable = "false";
    titleEl.classList.remove("editing");
    renameBoard(board.id, titleEl.textContent);
  });
  titleEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleEl.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      titleEl.textContent = board.name;
      titleEl.blur();
    }
  });
  titleArea.appendChild(titleEl);
  boardEl.appendChild(titleArea);

  const boardColumnsEl = document.createElement("div");
  boardColumnsEl.className = "board-columns no-scrollbar";

  board.columns.forEach((col, colIndex) => {
    const column = document.createElement("div");
    column.className = "column";
    const header = document.createElement("div");
    header.className = "column-header";

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = col.title;
    header.appendChild(title);

    column.appendChild(header);

    title.addEventListener("click", (e) => {
      e.stopPropagation();
      title.contentEditable = "true";
      title.classList.add("editing");
      title.focus();
      const range = document.createRange();
      range.selectNodeContents(title);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
    title.addEventListener("blur", () => {
      title.contentEditable = "false";
      title.classList.remove("editing");
      const newTitle = title.textContent.trim() || "untitled";
      title.textContent = newTitle;
      pushSnapshot();
      board.columns[colIndex].title = newTitle;
      saveState();
    });
    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        title.blur();
      }
    });

    const cards = document.createElement("div");
    cards.className = "cards no-scrollbar";
    column.appendChild(cards);

    col.cards.forEach((text) => cards.appendChild(makeCard(text)));

    const add = document.createElement("button");
    add.className = "add-card";
    add.innerHTML = ICON_PLUS + "<span>add card</span>";
    add.addEventListener("click", () => {
      const addTop = add.getBoundingClientRect().top;
      const c = makeCard({ body: "", color: "", tags: [], done: false });
      c.classList.add("card-enter");
      cards.appendChild(c);

      pushSnapshot();
      board.columns[colIndex].cards.push({
        body: "",
        color: "",
        tags: [],
        done: false,
        subtasks: [],
      });
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
      cards
        .querySelectorAll(".subtask-hover")
        .forEach((c) => c.classList.remove("subtask-hover"));
      const targetCard = e.target.closest(".card");
      if (targetCard && targetCard !== dragged) {
        targetCard.classList.add("subtask-hover");
      }
      const after = afterElement(cards, e.clientY);
      if (after == null) cards.appendChild(dragged);
      else cards.insertBefore(dragged, after);
    });
    cards.addEventListener("dragleave", (e) => {
      if (!cards.contains(e.relatedTarget)) {
        cards.classList.remove("drag-over");
        cards
          .querySelectorAll(".subtask-hover")
          .forEach((c) => c.classList.remove("subtask-hover"));
      }
    });
    cards.addEventListener("drop", (e) => {
      e.preventDefault();
      cards.classList.remove("drag-over");
      cards
        .querySelectorAll(".subtask-hover")
        .forEach((c) => c.classList.remove("subtask-hover"));
      const targetCard = e.target.closest(".card");
      if (targetCard && dragged && targetCard !== dragged) {
        makeSubtask(dragged, targetCard);
        return;
      }
      pushSnapshot();
      syncStateFromDOM();
      saveState();
    });

    boardColumnsEl.appendChild(column);
  });

  boardEl.appendChild(boardColumnsEl);
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
    [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
    { duration: 520, easing },
  );
}

function makeSubtask(draggedEl, targetEl) {
  if (activeCard) closeEditor();
  pushSnapshot();
  const board = activeBoard();
  if (!board) return;

  const sourceColEl = draggedEl.closest(".column");
  const sourceColIdx = [...sourceColEl.parentElement.children].indexOf(
    sourceColEl,
  );
  const sourceCardsEl = sourceColEl.querySelector(".cards");
  const sourceCardIdx = [...sourceCardsEl.children].indexOf(draggedEl);

  const targetColEl = targetEl.closest(".column");
  const targetColIdx = [...targetColEl.parentElement.children].indexOf(
    targetColEl,
  );
  const targetCardsEl = targetColEl.querySelector(".cards");
  let targetCardIdx = [...targetCardsEl.children].indexOf(targetEl);

  const cardData = board.columns[sourceColIdx].cards[sourceCardIdx];
  board.columns[sourceColIdx].cards.splice(sourceCardIdx, 1);

  if (sourceColIdx === targetColIdx && sourceCardIdx < targetCardIdx) {
    targetCardIdx--;
  }

  const targetCard = board.columns[targetColIdx].cards[targetCardIdx];
  if (!targetCard.subtasks) targetCard.subtasks = [];
  targetCard.subtasks.push({ body: cardData.body, done: false });

  saveState();
  buildBoard();
}

export function addCardToColumn(colIndex, body) {
  const columns = boardEl.querySelectorAll(".column");
  const column = columns[colIndex];
  const board = activeBoard();
  if (!column || !board || !board.columns[colIndex]) return;
  const cards = column.querySelector(".cards");
  const add = column.querySelector(".add-card");
  const addTop = add.getBoundingClientRect().top;

  const c = makeCard({ body: body || "", color: "", tags: [], done: false });
  c.classList.add("card-enter");
  cards.appendChild(c);

  pushSnapshot();
  board.columns[colIndex].cards.push({
    body: body || "",
    color: "",
    tags: [],
    done: false,
    subtasks: [],
  });
  saveState();
  animateAddButton(add, addTop);

  setTimeout(() => c.classList.remove("card-enter"), 520);
}

export function animateGridItems(grid, beforeFn) {
  const items = [...grid.children];
  const oldRects = items.map((el) => el.getBoundingClientRect());
  beforeFn();
  items.forEach((el, i) => {
    if (!grid.contains(el)) return;
    const newRect = el.getBoundingClientRect();
    const dx = oldRects[i].left - newRect.left;
    const dy = oldRects[i].top - newRect.top;
    if (dx || dy) {
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }
  });
}

function createBoardCard(b, i, grid) {
  const card = document.createElement("button");
  card.className = "board-card";
  card.type = "button";
  card.style.animationDelay = i * 35 + "ms";
  card.dataset.id = b.id;

  if (b.color) {
    card.style.background = b.color;
    card.classList.add("has-custom-color");
  }

  const totalCards = b.columns.reduce((s, c) => s + c.cards.length, 0);

  card.innerHTML =
    '<div class="board-card-body">' +
    (b.emoji
      ? '<span class="board-card-emoji">' + esc(b.emoji) + "</span>"
      : "") +
    '<span class="board-card-name">' +
    esc(b.name) +
    "</span>" +
    (totalCards > 0
      ? '<span class="board-card-count">' +
        totalCards +
        (totalCards === 1 ? " card" : " cards") +
        "</span>"
      : '<span class="board-card-count board-card-empty">empty</span>') +
    "</div>" +
    '<button class="board-card-del" title="delete board">' +
    ICON_X_TINY +
    "</button>";

  let clickTimeout = null;
  card.addEventListener("click", (e) => {
    if (
      e.target.closest(".board-card-del") ||
      e.target.closest(".board-card-name")
    )
      return;
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    }
    clickTimeout = setTimeout(() => {
      openBoard(b.id);
      clickTimeout = null;
    }, 220);
  });

  card.addEventListener("dblclick", (e) => {
    if (
      e.target.closest(".board-card-del") ||
      e.target.closest(".board-card-name")
    )
      return;
    e.stopPropagation();
    e.preventDefault();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
    openBoardEditor(b.id);
  });

  let lastTap = 0;
  card.addEventListener(
    "touchstart",
    (e) => {
      if (
        e.target.closest(".board-card-del") ||
        e.target.closest(".board-card-name")
      )
        return;
      const now = Date.now();
      const timespan = now - lastTap;
      if (timespan < 300 && timespan > 0) {
        e.preventDefault();
        e.stopPropagation();
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
        openBoardEditor(b.id);
      }
      lastTap = now;
    },
    { passive: false },
  );

  const nameEl = card.querySelector(".board-card-name");
  nameEl.addEventListener("click", (e) => {
    e.stopPropagation();
    nameEl.contentEditable = "true";
    nameEl.classList.add("editing");
    nameEl.focus();
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
  nameEl.addEventListener("blur", () => {
    nameEl.contentEditable = "false";
    nameEl.classList.remove("editing");
    const newName = nameEl.textContent.trim();
    if (newName) {
      renameBoard(b.id, newName);
    } else {
      nameEl.textContent = b.name;
    }
  });
  nameEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nameEl.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      nameEl.textContent = b.name;
      nameEl.blur();
    }
  });

  const del = card.querySelector(".board-card-del");
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    animateGridItems(grid, () => {
      deleteBoard(b.id);
      card.remove();
    });
  });

  return card;
}

function showBoardTip() {
  if (localStorage.getItem("trell0-board-tip")) return;

  const hint = document.createElement("div");
  hint.className = "onboarding-hint";
  hint.textContent = "double click to edit board details";

  document.getElementById("appLayout").appendChild(hint);

  const dismiss = () => {
    if (hint.classList.contains("dismissing")) return;
    hint.classList.add("dismissing");
    localStorage.setItem("trell0-board-tip", "1");
    setTimeout(() => hint.remove(), 400);
  };

  hint.addEventListener("click", dismiss);
  document.addEventListener("keydown", dismiss, { once: true });
  setTimeout(dismiss, 6000);
}

export function renderBoardView() {
  const view = document.getElementById("boardView");
  if (!view) return;

  view.innerHTML =
    '<div class="board-view-header">' +
    '<span class="board-view-title">boards</span>' +
    "</div>" +
    '<div class="board-view-grid" id="boardViewGrid"></div>';

  const grid = document.getElementById("boardViewGrid");

  const _state = getState();
  _state.boards.forEach((b, i) => {
    const card = createBoardCard(b, i, grid);
    grid.appendChild(card);
  });

  const newCard = document.createElement("button");
  newCard.className = "board-card board-card-new";
  newCard.type = "button";
  newCard.style.animationDelay = _state.boards.length * 35 + "ms";
  newCard.innerHTML =
    '<span class="board-card-new-label">+ create new board</span>';
  newCard.addEventListener("click", () => {
    const b = createBoard();
    const _state2 = getState();
    const idx = _state2.boards.indexOf(b);
    const card = createBoardCard(b, idx, grid);
    animateGridItems(grid, () => grid.insertBefore(card, newCard));
  });
  grid.appendChild(newCard);

  showBoardTip();
}

function showOnboarding() {
  if (localStorage.getItem("trell0-onboarded")) return;

  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const mod = isMac ? "\u2318" : "Ctrl";

  const hint = document.createElement("div");
  hint.className = "onboarding-hint";
  hint.innerHTML =
    "press <kbd>" + mod + "</kbd><kbd>Shift</kbd><kbd>P</kbd> to open commands";

  document.getElementById("appLayout").appendChild(hint);

  const dismiss = () => {
    if (hint.classList.contains("dismissing")) return;
    hint.classList.add("dismissing");
    localStorage.setItem("trell0-onboarded", "1");
    setTimeout(() => hint.remove(), 400);
  };

  hint.addEventListener("click", dismiss);
  document.addEventListener("keydown", dismiss, { once: true });
  setTimeout(dismiss, 6000);
}

export function openBoard(id) {
  if (animating) return;
  showOnboarding();
  const board = activeBoard();
  if (board && board.id === id) {
    buildBoard();
    const view = document.getElementById("boardView");
    view.classList.add("hidden");
    document.getElementById("board").classList.add("visible");
    addBoardBackBtn();
    return;
  }

  animating = true;
  const view = document.getElementById("boardView");
  const _boardEl = document.getElementById("board");

  switchBoard(id);
  buildBoard();

  view.classList.add("hidden");
  _boardEl.classList.add("visible");
  addBoardBackBtn();

  setTimeout(() => {
    animating = false;
  }, 550);
}

function addBoardBackBtn() {
  let btn = document.getElementById("boardBackBtn");
  if (btn) return;
  btn = document.createElement("button");
  btn.id = "boardBackBtn";
  btn.className = "board-back-btn";
  btn.title = "back to boards";
  btn.innerHTML = ICON_CHEVRON_LEFT;
  btn.addEventListener("click", closeBoardView);
  document.getElementById("board").appendChild(btn);
}

export function closeBoardView() {
  if (animating) return;
  animating = true;
  const view = document.getElementById("boardView");
  const _boardEl = document.getElementById("board");
  const btn = document.getElementById("boardBackBtn");
  if (btn) btn.remove();

  _boardEl.classList.remove("visible");
  view.classList.remove("hidden");

  renderBoardView();

  setTimeout(() => {
    animating = false;
    _boardEl.style.background = "";
  }, 550);
}

boardEl.addEventListener(
  "touchstart",
  (e) => {
    touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchStartTarget = e.target;
  },
  { passive: true },
);

document.addEventListener(
  "touchmove",
  (e) => {
    if (!touchStartPos) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.x);
    const dy = Math.abs(touch.clientY - touchStartPos.y);
    if (dx < 10 && dy < 10) return;

    if (!touchDragged) {
      const card = touchStartTarget.closest(".card");
      if (
        card &&
        !touchStartTarget.closest(".card-x") &&
        !touchStartTarget.closest(".card-checkbox")
      ) {
        touchDragged = card;
        card.classList.add("dragging");
      } else {
        return;
      }
    }

    e.preventDefault();

    if (touchDragged) {
      touchDragged.style.pointerEvents = "none";
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      touchDragged.style.pointerEvents = "";
      if (!el) return;
      const cards = el.closest(".cards");
      if (!cards) return;
      document
        .querySelectorAll(".subtask-hover")
        .forEach((c) => c.classList.remove("subtask-hover"));
      const targetCard = el.closest(".card");
      if (targetCard && targetCard !== touchDragged) {
        targetCard.classList.add("subtask-hover");
      }
      cards.classList.add("drag-over");
      const after = afterElement(cards, touch.clientY);
      if (after == null) cards.appendChild(touchDragged);
      else cards.insertBefore(touchDragged, after);
    }
  },
  { passive: false },
);

document.addEventListener("touchend", (e) => {
  if (touchDragged) {
    touchDragged.classList.remove("dragging");
    document
      .querySelectorAll(".cards.drag-over")
      .forEach((c) => c.classList.remove("drag-over"));
    document
      .querySelectorAll(".subtask-hover")
      .forEach((c) => c.classList.remove("subtask-hover"));

    const touch = e.changedTouches[0];
    if (touch) {
      touchDragged.style.pointerEvents = "none";
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      touchDragged.style.pointerEvents = "";
      const targetCard = el && el.closest(".card");
      if (targetCard && targetCard !== touchDragged) {
        makeSubtask(touchDragged, targetCard);
        touchDragged = null;
        touchStartPos = null;
        touchStartTarget = null;
        return;
      }
    }

    pushSnapshot();
    syncStateFromDOM();
    saveState();
    touchDragged = null;
  }
  touchStartPos = null;
  touchStartTarget = null;
});

document.addEventListener("touchcancel", () => {
  if (touchDragged) {
    touchDragged.classList.remove("dragging");
    touchDragged = null;
  }
  document
    .querySelectorAll(".cards.drag-over")
    .forEach((c) => c.classList.remove("drag-over"));
  touchStartPos = null;
  touchStartTarget = null;
});

const PRESET_EMOJIS = [
  "📋",
  "📝",
  "✅",
  "📌",
  "📎",
  "📂",
  "📊",
  "🚀",
  "🎯",
  "⚡",
  "💡",
  "🔥",
  "🌟",
  "🎨",
  "🛠️",
  "📅",
  "💻",
  "👥",
  "🙌",
  "🤝",
  "🎉",
  "❤️",
  "⭐",
  "🌈",
];

const BOARD_COLORS = [
  { name: "default", value: "" },
  {
    name: "sunset glow",
    value: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
  },
  {
    name: "ocean wave",
    value: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)",
  },
  {
    name: "emerald forest",
    value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    name: "midnight sky",
    value: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    name: "lavender dream",
    value: "linear-gradient(135deg, #eecda3 0%, #ef629f 100%)",
  },
  {
    name: "sweet peach",
    value: "linear-gradient(135deg, #FFD1FF 0%, #FEE140 100%)",
  },
  {
    name: "glass water",
    value: "linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)",
  },
  {
    name: "sakura",
    value: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  },
  {
    name: "carbon",
    value: "linear-gradient(135deg, #434343 0%, #000000 100%)",
  },
];

const boardEditorOverlay = document.getElementById("boardEditorOverlay");
const boardEditorBackdrop = document.getElementById("boardEditorBackdrop");
const boardEditorCloseBtn = document.getElementById("boardEditorCloseBtn");
const boardEditorNameInput = document.getElementById("boardEditorNameInput");
const boardEditorCurrentEmoji = document.getElementById(
  "boardEditorCurrentEmoji",
);
const boardEditorClearEmojiBtn = document.getElementById(
  "boardEditorClearEmojiBtn",
);
if (boardEditorClearEmojiBtn) boardEditorClearEmojiBtn.textContent = "✕";
const boardEditorEmojiGrid = document.getElementById("boardEditorEmojiGrid");
const boardEditorColorGrid = document.getElementById("boardEditorColorGrid");

if (boardEditorCloseBtn) {
  boardEditorCloseBtn.innerHTML = ICON_X_LG;
}

let editingBoardId = null;

export function openBoardEditor(boardId) {
  const _state = getState();
  const board = _state.boards.find((b) => b.id === boardId);
  if (!board) return;

  editingBoardId = boardId;
  boardEditorNameInput.value = board.name;

  updateEditorCurrentEmoji(board.emoji);
  updateColorPickerSelection(board.color);

  if (activeCard) closeEditor();

  boardEditorOverlay.classList.add("open");

  requestAnimationFrame(() => {
    boardEditorNameInput.focus();
    boardEditorNameInput.select();
  });
}

export function closeBoardEditor() {
  if (!boardEditorOverlay.classList.contains("open")) return;
  boardEditorOverlay.classList.remove("open");
  editingBoardId = null;
}

function updateEditorCurrentEmoji(emoji) {
  if (emoji) {
    boardEditorCurrentEmoji.textContent = emoji;
    boardEditorCurrentEmoji.style.display = "inline-flex";
    boardEditorClearEmojiBtn.style.display = "inline-flex";
  } else {
    boardEditorCurrentEmoji.textContent = "📋";
    boardEditorClearEmojiBtn.style.display = "none";
  }
}

function updateColorPickerSelection(selectedColor) {
  const items = boardEditorColorGrid.querySelectorAll(
    ".board-editor-color-item",
  );
  items.forEach((item) => {
    if (item.dataset.value === selectedColor) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
}

PRESET_EMOJIS.forEach((emoji) => {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "board-editor-emoji-item";
  item.textContent = emoji;
  item.title = "select emoji";
  item.addEventListener("click", () => {
    if (!editingBoardId) return;
    setBoardEmoji(editingBoardId, emoji);
    updateEditorCurrentEmoji(emoji);

    const activeB = activeBoard();
    if (activeB && activeB.id === editingBoardId) {
      const emojiBadge = boardEl.querySelector(".board-emoji-badge");
      if (emojiBadge) {
        emojiBadge.textContent = emoji;
        emojiBadge.style.display = "inline";
      }
    }

        const cardEl = document.querySelector(
      `.board-card[data-id="${editingBoardId}"]`,
    );
    if (cardEl) {
      const bodyEl = cardEl.querySelector(".board-card-body");
      if (bodyEl) {
        let emojiEl = bodyEl.querySelector(".board-card-emoji");
        if (emoji) {
          if (!emojiEl) {
            emojiEl = document.createElement("span");
            emojiEl.className = "board-card-emoji";
            bodyEl.insertBefore(emojiEl, bodyEl.firstChild);
          }
          emojiEl.textContent = emoji;
        } else if (emojiEl) {
          emojiEl.remove();
        }
      }
    }
  });
  boardEditorEmojiGrid.appendChild(item);
});

boardEditorClearEmojiBtn.addEventListener("click", () => {
  if (!editingBoardId) return;
  setBoardEmoji(editingBoardId, "");
  updateEditorCurrentEmoji("");

    const activeB = activeBoard();
  if (activeB && activeB.id === editingBoardId) {
    const emojiBadge = boardEl.querySelector(".board-emoji-badge");
    if (emojiBadge) emojiBadge.style.display = "none";
  }

    const cardEl = document.querySelector(
    `.board-card[data-id="${editingBoardId}"]`,
  );
  if (cardEl) {
    const emojiEl = cardEl.querySelector(".board-card-emoji");
    if (emojiEl) emojiEl.remove();
  }
});

BOARD_COLORS.forEach((color) => {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "board-editor-color-item";
  item.dataset.value = color.value;
  item.title = color.name;

  if (color.value === "") {
    item.style.background = "var(--sidebar)";
    item.style.border = "1px dashed var(--line)";
    item.innerHTML =
      '<span style="font-size: 10px; opacity: 0.5; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-transform: lowercase;">default</span>';
  } else {
    item.style.background = color.value;
  }

  item.addEventListener("click", () => {
    if (!editingBoardId) return;
    setBoardColor(editingBoardId, color.value);
    updateColorPickerSelection(color.value);

    const cardEl = document.querySelector(
      `.board-card[data-id="${editingBoardId}"]`,
    );
    if (cardEl) {
      if (color.value) {
        cardEl.style.background = color.value;
        cardEl.classList.add("has-custom-color");
      } else {
        cardEl.style.background = "";
        cardEl.classList.remove("has-custom-color");
      }
    }
  });
  boardEditorColorGrid.appendChild(item);
});

boardEditorNameInput.addEventListener("input", () => {
  if (!editingBoardId) return;
  const newName = boardEditorNameInput.value.trim();
  if (newName) {
    renameBoard(editingBoardId, newName);

    const activeB = activeBoard();
    if (activeB && activeB.id === editingBoardId) {
      const activeTitleEl = boardEl.querySelector(".board-title");
      if (activeTitleEl) activeTitleEl.textContent = newName;
    }

    const cardEl = document.querySelector(
      `.board-card[data-id="${editingBoardId}"]`,
    );
    if (cardEl) {
      const cardNameEl = cardEl.querySelector(".board-card-name");
      if (cardNameEl) cardNameEl.textContent = newName;
    }
  }
});

boardEditorCloseBtn.addEventListener("click", closeBoardEditor);
boardEditorBackdrop.addEventListener("click", closeBoardEditor);

boardEditorNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    closeBoardEditor();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeBoardEditor();
  }
});
