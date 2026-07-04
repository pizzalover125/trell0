const COLUMNS = [
  { title: "to do", cards: [] },
  { title: "in progress", cards: [] },
  { title: "done", cards: [] },
];

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

const STORAGE_KEY = "trell0-board-state";

let boardUid = 1;

function generateBoardId() {
  return "b" + boardUid++;
}

function getCleanText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function esc(c) {
  return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function titleFromBody(body) {
  return getCleanText(body).trim().split("\n")[0] || "untitled";
}

function createDefaultState() {
  return {
    boards: [
      {
        id: generateBoardId(),
        name: "My Board",
        emoji: "",
        columns: JSON.parse(JSON.stringify(COLUMNS)),
      },
    ],
    activeBoardId: null,
  };
}

function validateColumns(cols) {
  return cols.map((col, i) => ({
    title: col.title || COLUMNS[i]?.title || "untitled",
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

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const def = createDefaultState();
      def.boards[0].columns = validateColumns(parsed);
      def.activeBoardId = def.boards[0].id;
      return def;
    }
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.boards)) {
      parsed.boards = parsed.boards.map((b) => ({
        ...b,
        columns: validateColumns(b.columns || []),
      }));
      if (!parsed.boards.some((b) => b.id === parsed.activeBoardId)) {
        parsed.activeBoardId = parsed.boards[0]?.id || null;
      }
      const maxUid = parsed.boards.reduce(
        (m, b) =>
          Math.max(m, parseInt(String(b.id).replace(/\D/g, ""), 10) || 0),
        0,
      );
      boardUid = maxUid + 1;
      return parsed;
    }
    return createDefaultState();
  } catch {
    return createDefaultState();
  }
}

let _state = loadState();
if (!_state.activeBoardId && _state.boards.length > 0) {
  _state.activeBoardId = _state.boards[0].id;
}

export function getState() {
  return _state;
}

export function replaceState(newState) {
  _state = newState;
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch {}
}

const MAX_HISTORY = 50;
let undoStack = [];
let redoStack = [];

export function pushSnapshot() {
  undoStack.push(JSON.parse(JSON.stringify(_state)));
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack = [];
}

export function getUndoStack() {
  return undoStack;
}

export function getRedoStack() {
  return redoStack;
}

pushSnapshot();

export function activeBoard() {
  return _state.boards.find((b) => b.id === _state.activeBoardId);
}

export function activeBoardColumns() {
  const b = activeBoard();
  return b ? b.columns : [];
}

export function createBoard(name) {
  const board = {
    id: generateBoardId(),
    name: name || "Untitled",
    emoji: "",
    columns: JSON.parse(JSON.stringify(COLUMNS)),
  };
  pushSnapshot();
  _state.boards.push(board);
  saveState();
  return board;
}

export function renameBoard(boardId, name) {
  const board = _state.boards.find((b) => b.id === boardId);
  if (!board) return;
  pushSnapshot();
  board.name = name.trim() || "Untitled";
  saveState();
}

export function setBoardEmoji(boardId, emoji) {
  const board = _state.boards.find((b) => b.id === boardId);
  if (!board) return;
  pushSnapshot();
  board.emoji = emoji || "";
  saveState();
}

export function switchBoard(boardId) {
  const board = _state.boards.find((b) => b.id === boardId);
  if (!board || board.id === _state.activeBoardId) return;
  pushSnapshot();
  _state.activeBoardId = boardId;
  saveState();
}

export function deleteBoard(boardId) {
  if (_state.boards.length <= 1) return;
  const idx = _state.boards.findIndex((b) => b.id === boardId);
  if (idx === -1) return;
  pushSnapshot();
  _state.boards.splice(idx, 1);
  if (_state.activeBoardId === boardId) {
    _state.activeBoardId =
      _state.boards[Math.min(idx, _state.boards.length - 1)].id;
  }
  saveState();
}

export function addCardToBoard(colIndex, body) {
  const board = activeBoard();
  if (!board || !board.columns[colIndex]) return;
  pushSnapshot();
  board.columns[colIndex].cards.push({
    body: body || "",
    color: "",
    tags: [],
    done: false,
    subtasks: [],
  });
  saveState();
}

function utf8ToBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}

function base64ToUtf8(str) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

export {
  CARD_COLORS,
  COLUMNS,
  getCleanText,
  esc,
  titleFromBody,
  generateBoardId,
  utf8ToBase64,
  base64ToUtf8,
  STORAGE_KEY,
};
