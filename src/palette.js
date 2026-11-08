"use strict";

function alpha(hex, a) {
  const byte = Math.round(Math.min(1, Math.max(0, a)) * 255);
  return hex + byte.toString(16).padStart(2, "0");
}

function mix(a, b, t) {
  const ch = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(ch(a, i) * (1 - t) + ch(b, i) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, b2] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const term = {
  background: "#201C1A",
  foreground: "#DCD2C3",
  cursor: "#FFA305",
  cursorText: "#201C1A",
  selection: "#463C34",
  selectedText: "#EEE6D7",

  black: "#3A3331",
  red: "#E64F37",
  green: "#59A660",
  yellow: "#E0BE5A",
  blue: "#5A84C2",
  magenta: "#BC6E98",
  cyan: "#459BA8",
  white: "#C8BEAF",

  brightBlack: "#716860",
  brightRed: "#F07A5E",
  brightGreen: "#75C178",
  brightYellow: "#F2E292",
  brightBlue: "#7396CD",
  brightMagenta: "#CC86AA",
  brightCyan: "#59B8C0",
  brightWhite: "#EEE6D7",
};

const ACCENTS = ["red", "green", "yellow", "blue", "purple", "aqua", "orange"];

function getPalette() {
  const t = term;
  const p = { mode: "dark", term: t };

  p.bg0_hard = "#171412";
  p.bg0 = t.background;
  p.bg1 = t.black;
  p.bg0_soft = mix(p.bg0, p.bg1, 0.5);
  p.bg2 = mix(t.black, t.brightBlack, 1 / 3);
  p.bg3 = mix(t.black, t.brightBlack, 2 / 3);
  p.bg4 = t.brightBlack;
  p.gray = mix(t.brightBlack, t.white, 0.25);
  p.fg4 = mix(t.brightBlack, t.white, 0.5);
  p.fg3 = mix(t.brightBlack, t.white, 0.75);
  p.fg2 = t.white;
  p.fg1 = t.foreground;
  p.fg0 = t.brightWhite;
  p.fg0_soft = mix(p.fg0, p.fg1, 0.5);

  p.red = t.brightRed;
  p.green = t.brightGreen;
  p.yellow = t.yellow;
  p.blue = t.brightBlue;
  p.purple = t.brightMagenta;
  p.aqua = t.brightCyan;
  p.orange = t.cursor;

  p.neutral = {
    red: t.red,
    green: t.green,
    yellow: mix(p.yellow, p.bg0, 0.2),
    blue: t.blue,
    purple: t.magenta,
    aqua: t.cyan,
    orange: mix(p.orange, p.bg0, 0.2),
  };

  p.faded = {};
  for (const c of ACCENTS) {
    let amount = 0.35;
    let color = mix(p.neutral[c], p.bg0, amount);
    while (contrast(p.fg0, color) < 4.5 && amount < 1) {
      amount += 0.01;
      color = mix(p.neutral[c], p.bg0, amount);
    }
    p.faded[c] = color;
  }

  p.text = p.fg0;
  p.func = p.green;
  p.string = p.fg1;

  return p;
}

module.exports = { term, getPalette, alpha, mix, contrast };
