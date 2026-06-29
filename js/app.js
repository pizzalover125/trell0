import { getState, replaceState, saveState, pushSnapshot } from "./state.js";
import {
  renderBoardView,
  checkShareLink,
  closeBoardView,
  buildBoard,
} from "./board.js";
import { closeEditor, activeCard, overlay } from "./editor.js";
import { initTimers } from "./timers.js";
import {
  togglePalette,
  closePalette,
  handleUndo,
  handleRedo,
} from "./palette.js";

document.addEventListener(
  "keydown",
  (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    if (e.shiftKey && (e.key === "z" || e.key === "Z" || e.code === "KeyZ")) {
      e.preventDefault();
      handleRedo();
      return;
    }

    if (e.key === "z" || e.key === "Z" || e.code === "KeyZ") {
      e.preventDefault();
      handleUndo();
      return;
    }

    if (e.shiftKey && (e.key === "p" || e.key === "P" || e.code === "KeyP")) {
      e.preventDefault();
      togglePalette();
    }

    if (e.shiftKey && (e.key === "b" || e.key === "B" || e.code === "KeyB")) {
      e.preventDefault();
      const bv = document.getElementById("boardView");
      if (bv && !bv.classList.contains("hidden")) return;
      closeBoardView();
    }
  },
  true,
);

renderBoardView();
initTimers();
checkShareLink();
