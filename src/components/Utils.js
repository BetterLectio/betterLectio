export function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return h + " " + s + "% " + l + "%";
}

export function readable(HSL) {
  HSL = HSL.split(" ");
  let h = HSL[0],
    s = HSL[1],
    l = HSL[2];
  s = s.replace("%", "");
  l = l.replace("%", "");
  s /= 100;
  l /= 100;
  if (l < 0.35) {
    l = l + 1;
  } else {
    l = l - 2;
  }
  return h + " " + s * 100 + "% " + l * 100 + "%";
}

export function darken(HSL) {
  HSL = HSL.split(" ");
  let h = HSL[0],
    s = HSL[1],
    l = HSL[2];
  l = l.replace("%", "");
  l /= 100;
  l = l - 0.1;
  return h + " " + s + " " + l * 100 + "%";
}

export function mono(HSL) {
  HSL = HSL.split(" ");
  let h = HSL[0],
    s = HSL[1],
    l = HSL[2];
  s = s.replace("%", "");
  l = l.replace("%", "");
  s /= 100;
  l /= 100;
  s = 0;
  return h + " " + s * 100 + "% " + l * 100 + "%";
}