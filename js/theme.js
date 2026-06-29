export const THEMES = [
  { id: "light", label: "Light", family: "light" },
  { id: "sunset", label: "Sunset", family: "light" },
  { id: "solarized-light", label: "Solarized Light", family: "light" },
  { id: "dark", label: "Dark", family: "dark" },
  { id: "midnight", label: "Midnight", family: "dark" },
  { id: "forest", label: "Forest", family: "dark" },
  { id: "catppuccin", label: "Catppuccin", family: "dark" },
  { id: "solarized-dark", label: "Solarized Dark", family: "dark" },
];

export function updateFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  const style = getComputedStyle(document.documentElement);
  const color1 = style.getPropertyValue("--color-paper").trim() || "#f9f9f9";
  const color2 = style.getPropertyValue("--color-ink").trim() || "#1a1a1a";

  const gradient = ctx.createLinearGradient(0, 0, 32, 32);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  let link = document.querySelector('link[rel~="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = canvas.toDataURL();
}

export function applyTheme(themeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  updateFavicon();
}

export function currentTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

export function submitThemeById(id) {
  applyTheme(id);
  try {
    localStorage.setItem("trell0-theme", id);
  } catch {}
}

const themeMedia =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
if (themeMedia && themeMedia.addEventListener) {
  themeMedia.addEventListener("change", (e) => {
    let saved;
    try {
      saved = localStorage.getItem("trell0-theme");
    } catch {}
    if (!saved) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

applyTheme(currentTheme());
