import { ICON_MOON, ICON_SUN, ICON_CHECK, ICON_THEME_CMD } from "./js/icons.js";
import {
  THEMES,
  applyTheme,
  currentTheme,
  updateFavicon,
  submitThemeById,
} from "./js/theme.js";

const themeToggle = document.getElementById("themeToggle");
let themeDropdownOpen = false;

function renderThemeDropdown() {
  let dropdown = document.getElementById("themeDropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "themeDropdown";
    dropdown.className = "theme-dropdown";
    dropdown.role = "listbox";
    document.body.appendChild(dropdown);
  }
  const current = currentTheme();
  dropdown.innerHTML = "";
  THEMES.forEach(function (t) {
    const item = document.createElement("button");
    item.className =
      "theme-dropdown-item" + (t.id === current ? " selected" : "");
    item.type = "button";
    item.innerHTML =
      '<span class="row-icon">' +
      (t.id === current ? ICON_CHECK : "") +
      '</span><span class="row-label">' +
      t.label +
      "</span>";
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      submitThemeById(t.id);
      closeThemeDropdown();
    });
    dropdown.appendChild(item);
  });
}

function openThemeDropdown() {
  if (themeDropdownOpen) return;
  renderThemeDropdown();
  const dropdown = document.getElementById("themeDropdown");
  const rect = themeToggle.getBoundingClientRect();
  dropdown.style.position = "fixed";
  dropdown.style.top = rect.bottom + 6 + "px";
  dropdown.style.right = window.innerWidth - rect.right + "px";
  requestAnimationFrame(function () {
    dropdown.classList.add("open");
  });
  themeDropdownOpen = true;
  document.addEventListener("keydown", themeDropdownKeyHandler);
  setTimeout(function () {
    document.addEventListener("click", themeDropdownOutsideHandler);
  }, 0);
}

function closeThemeDropdown() {
  const dropdown = document.getElementById("themeDropdown");
  if (!dropdown) return;
  dropdown.classList.remove("open");
  themeDropdownOpen = false;
  document.removeEventListener("keydown", themeDropdownKeyHandler);
  document.removeEventListener("click", themeDropdownOutsideHandler);
}

function themeDropdownKeyHandler(e) {
  if (e.key === "Escape") closeThemeDropdown();
}

function themeDropdownOutsideHandler(e) {
  const dropdown = document.getElementById("themeDropdown");
  if (!dropdown || !themeDropdownOpen) return;
  if (dropdown.contains(e.target) || themeToggle.contains(e.target)) return;
  closeThemeDropdown();
}

themeToggle.innerHTML = ICON_THEME_CMD;
themeToggle.title = "switch theme";

themeToggle.addEventListener("click", function () {
  if (themeDropdownOpen) closeThemeDropdown();
  else openThemeDropdown();
});
