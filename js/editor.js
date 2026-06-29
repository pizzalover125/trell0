import { ICON_X_LG, ICON_PLUS, ICON_X_TINY } from "./icons.js";
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
