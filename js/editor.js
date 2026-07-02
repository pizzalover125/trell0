import { ICON_X_LG, ICON_PLUS, ICON_X_TINY, ICON_CHECKBOX } from "./icons.js";
import {
  pushSnapshot,
  saveState,
  CARD_COLORS,
  getCleanText,
  esc,
} from "./state.js";
import { refreshCard, syncStateFromDOM } from "./board.js";

export const overlay = document.getElementById("overlay");
const backdrop = document.getElementById("backdrop");
const editor = document.getElementById("editor");
const cursorEl = document.getElementById("cursor");
const statusBar = document.getElementById("status");
const closeBtn = document.getElementById("closeBtn");
const cardColorPicker = document.getElementById("cardColorPicker");
const editorTagsArea = document.getElementById("editorTagsArea");
const editorSubtasks = document.getElementById("editorSubtasks");

closeBtn.innerHTML = ICON_X_LG;

export let activeCard = null;
let isTyping = false;
let syncTimeout = null;
let typingTimeout = null;

export function renderEditorTags(card) {
  if (!editorTagsArea) return;
  const tags = JSON.parse(card.dataset.tags || "[]");
  editorTagsArea.innerHTML = "";

  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "editor-tag-chip";
    chip.innerHTML = `${esc(tag)}<span class="editor-tag-x" title="remove">${ICON_X_TINY}</span>`;
    chip.querySelector(".editor-tag-x").addEventListener("click", (e) => {
      e.stopPropagation();
      removeTag(card, tag);
    });
    editorTagsArea.appendChild(chip);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "add-tag-trigger";
  addBtn.innerHTML = ICON_PLUS;
  addBtn.title = "add tag";

  const inputWrap = document.createElement("div");
  inputWrap.className = "tag-input-box";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "tag-input-field";
  input.placeholder = "tag...";
  inputWrap.appendChild(input);

  addBtn.addEventListener("click", () => {
    inputWrap.classList.add("open");
    addBtn.style.display = "none";
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (val) addTag(card, val);
      input.value = "";
      inputWrap.classList.remove("open");
      addBtn.style.display = "flex";
    }
    if (e.key === "Escape") {
      inputWrap.classList.remove("open");
      addBtn.style.display = "flex";
    }
  });

  input.addEventListener("blur", () => {
    if (!input.value.trim()) {
      inputWrap.classList.remove("open");
      addBtn.style.display = "flex";
    }
  });

  editorTagsArea.appendChild(addBtn);
  editorTagsArea.appendChild(inputWrap);
}

function addTag(card, tag) {
  const tags = JSON.parse(card.dataset.tags || "[]");
  if (tags.includes(tag)) return;
  pushSnapshot();
  tags.push(tag);
  card.dataset.tags = JSON.stringify(tags);
  refreshCard(card);
  renderEditorTags(card);
  syncStateFromDOM();
  saveState();
}

function removeTag(card, tag) {
  let tags = JSON.parse(card.dataset.tags || "[]");
  tags = tags.filter((t) => t !== tag);
  pushSnapshot();
  card.dataset.tags = JSON.stringify(tags);
  refreshCard(card);
  renderEditorTags(card);
  syncStateFromDOM();
  saveState();
}

function subtaskSync() {
  if (!activeCard) return;
  const items = [...editorSubtasks.querySelectorAll(".subtask-item")];
  const subtasks = items.map((item) => ({
    body: item.querySelector(".subtask-text")?.textContent || "",
    done: item.classList.contains("subtask-done"),
  }));
  activeCard.dataset.subtasks = JSON.stringify(subtasks);
}

function addSubtask() {
  if (!activeCard) return;
  const input = editorSubtasks.querySelector(".subtask-input");
  const val = input?.value.trim();
  if (!val) return;
  pushSnapshot();
  const subtasks = JSON.parse(activeCard.dataset.subtasks || "[]");
  subtasks.push({ body: val, done: false });
  activeCard.dataset.subtasks = JSON.stringify(subtasks);
  refreshCard(activeCard);
  syncStateFromDOM();
  saveState();
  input.value = "";
  renderEditorSubtasks(activeCard);
  const newInput = editorSubtasks.querySelector(".subtask-input");
  if (newInput) newInput.focus();
}

function toggleSubtask(index) {
  if (!activeCard) return;
  pushSnapshot();
  const subtasks = JSON.parse(activeCard.dataset.subtasks || "[]");
  if (subtasks[index]) {
    subtasks[index].done = !subtasks[index].done;
    activeCard.dataset.subtasks = JSON.stringify(subtasks);
    refreshCard(activeCard);
    syncStateFromDOM();
    saveState();
    renderEditorSubtasks(activeCard);
  }
}

function removeSubtask(index) {
  if (!activeCard) return;
  pushSnapshot();
  let subtasks = JSON.parse(activeCard.dataset.subtasks || "[]");
  subtasks = subtasks.filter((_, i) => i !== index);
  activeCard.dataset.subtasks = JSON.stringify(subtasks);
  refreshCard(activeCard);
  syncStateFromDOM();
  saveState();
  renderEditorSubtasks(activeCard);
}

export function renderEditorSubtasks(card) {
  if (!editorSubtasks) return;
  const subtasks = JSON.parse(card.dataset.subtasks || "[]");
  editorSubtasks.innerHTML = "";

  if (!subtasks.length) {
    editorSubtasks.style.display = "none";
    const row = document.createElement("div");
    row.className = "subtask-add-row";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "subtask-input";
    input.placeholder = "add subtask…";
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSubtask();
      }
      if (e.key === "Escape") {
        e.target.blur();
      }
    });
    row.appendChild(input);
    editorSubtasks.appendChild(row);
    return;
  }

  editorSubtasks.style.display = "block";

  subtasks.forEach((st, i) => {
    const item = document.createElement("div");
    item.className = "subtask-item" + (st.done ? " subtask-done" : "");

    const cb = document.createElement("button");
    cb.className = "subtask-cb";
    cb.type = "button";
    cb.innerHTML = ICON_CHECKBOX;
    cb.addEventListener("click", () => toggleSubtask(i));

    const text = document.createElement("span");
    text.className = "subtask-text";
    text.textContent = st.body;

    const del = document.createElement("button");
    del.className = "subtask-del";
    del.type = "button";
    del.innerHTML = ICON_X_TINY;
    del.title = "remove subtask";
    del.addEventListener("click", () => removeSubtask(i));

    item.appendChild(cb);
    item.appendChild(text);
    item.appendChild(del);
    editorSubtasks.appendChild(item);
  });

  const row = document.createElement("div");
  row.className = "subtask-add-row";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "subtask-input";
  input.placeholder = "add subtask…";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
    if (e.key === "Escape") {
      e.target.blur();
    }
  });
  row.appendChild(input);
  editorSubtasks.appendChild(row);
}

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
      pushSnapshot();
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
  [...cardColorPicker.querySelectorAll(".color-dot")].forEach((dot, i) => {
    dot.classList.toggle("active", CARD_COLORS[i] === selected);
  });
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

export function openEditor(card) {
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
  renderEditorTags(card);
  renderEditorSubtasks(card);

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

export function clearActiveCard() {
  if (syncTimeout) clearTimeout(syncTimeout);
  activeCard = null;
  overlay.classList.remove("open");
}

export function closeEditor() {
  if (!activeCard) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  const card = activeCard;
  card.dataset.body = editor.innerHTML;
  subtaskSync();
  refreshCard(card);
  pushSnapshot();
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

renderColorPicker();
