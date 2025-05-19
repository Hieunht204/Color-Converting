// HEX
const tbHEX = document.getElementById("tbHEX");    
const cvHEX = document.getElementById("cvHEX");   

// RGB
const tbRGB_R = document.getElementById("tbRGB_R"); 
const rgRGB_R = document.getElementById("rgRGB_R"); 

const tbRGB_G = document.getElementById("tbRGB_G"); 
const rgRGB_G = document.getElementById("rgRGB_G"); 

const tbRGB_B = document.getElementById("tbRGB_B"); 
const rgRGB_B = document.getElementById("rgRGB_B"); 

const txtRGB = document.getElementById("txtRGB");
const cvRGB = document.getElementById("cvRGB");

// CMYK
const tbCMYK_C = document.getElementById("tbCMYK_C");
const rgCMYK_C = document.getElementById("rgCMYK_C");

const tbCMYK_M = document.getElementById("tbCMYK_M");
const rgCMYK_M = document.getElementById("rgCMYK_M");

const tbCMYK_Y = document.getElementById("tbCMYK_Y");
const rgCMYK_Y = document.getElementById("rgCMYK_Y");

const tbCMYK_K = document.getElementById("tbCMYK_K");
const rgCMYK_K = document.getElementById("rgCMYK_K");

const txtCMYK = document.getElementById("txtCMYK");
const cvCMYK = document.getElementById("cvCMYK");

// HSL
const tbHSL_H = document.getElementById("tbHSL_H");
const rgHSL_H = document.getElementById("rgHSL_H");

const tbHSL_S = document.getElementById("tbHSL_S");
const rgHSL_S = document.getElementById("rgHSL_S");

const tbHSL_L = document.getElementById("tbHSL_L");
const rgHSL_L = document.getElementById("rgHSL_L");

const txtHSL = document.getElementById("txtHSL");
const cvHSL = document.getElementById("cvHSL");

// HSV
const tbHSV_H = document.getElementById("tbHSV_H");
const rgHSV_H = document.getElementById("rgHSV_H");

const tbHSV_S = document.getElementById("tbHSV_S");
const rgHSV_S = document.getElementById("rgHSV_S");

const tbHSV_V = document.getElementById("tbHSV_V");
const rgHSV_V = document.getElementById("rgHSV_V");

const txtHSV = document.getElementById("txtHSV");
const cvHSV = document.getElementById("cvHSV");

const hex = { text: tbHEX, picker: cvHEX };

const rgb = {
  r: { input: tbRGB_R, slider: rgRGB_R },
  g: { input: tbRGB_G, slider: rgRGB_G },
  b: { input: tbRGB_B, slider: rgRGB_B },
  text: txtRGB,
  picker: cvRGB
};

const cmyk = {
  c: { input: tbCMYK_C, slider: rgCMYK_C },
  m: { input: tbCMYK_M, slider: rgCMYK_M },
  y: { input: tbCMYK_Y, slider: rgCMYK_Y },
  k: { input: tbCMYK_K, slider: rgCMYK_K },
  text: txtCMYK,
  picker: cvCMYK
};

const hsl = {
  h: { input: tbHSL_H, slider: rgHSL_H },
  s: { input: tbHSL_S, slider: rgHSL_S },
  l: { input: tbHSL_L, slider: rgHSL_L },
  text: txtHSL,
  picker: cvHSL
};

const hsv = {
  h: { input: tbHSV_H, slider: rgHSV_H },
  s: { input: tbHSV_S, slider: rgHSV_S },
  v: { input: tbHSV_V, slider: rgHSV_V },
  text: txtHSV,
  picker: cvHSV
};

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(ch => ch + ch).join("");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

function cmykToRgb(c, m, y, k) {
  c = Math.min(Math.max(c, 0), 100) / 100;
  m = Math.min(Math.max(m, 0), 100) / 100;
  y = Math.min(Math.max(y, 0), 100) / 100;
  k = Math.min(Math.max(k, 0), 100) / 100;

  let r = 255 * (1 - c) * (1 - k);
  let g = 255 * (1 - m) * (1 - k);
  let b = 255 * (1 - y) * (1 - k);

  r = Math.round(Math.min(Math.max(r, 0), 255));
  g = Math.round(Math.min(Math.max(g, 0), 255));
  b = Math.round(Math.min(Math.max(b, 0), 255));

  return { r, g, b };
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

function hsvToRgb(h, s, v) {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60)      { r = c; g = x; b = 0; }
  else if (h < 120)          { r = x; g = c; b = 0; }
  else if (h < 180)          { r = 0; g = c; b = x; }
  else if (h < 240)          { r = 0; g = x; b = c; }
  else if (h < 300)          { r = x; g = 0; b = c; }
  else if (h < 360)          { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}


function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(val => {
        const hex = val.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToCmyk(r, g, b) {
  const rPrime = r / 255, gPrime = g / 255, bPrime = b / 255;
  const k = 1 - Math.max(rPrime, gPrime, bPrime);

  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }; 

  const c = ((1 - rPrime - k) / (1 - k)) * 100;
  const m = ((1 - gPrime - k) / (1 - k)) * 100;
  const y = ((1 - bPrime - k) / (1 - k)) * 100;

  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k * 100)
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // màu xám
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g:
        h = ((b - r) / d + 2); break;
      case b:
        h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0, s = 0, v = max;

  if (delta !== 0) {
    s = max === 0 ? 0 : delta / max;

    switch (max) {
      case r: h = ((g - b) / delta + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / delta + 2); break;
      case b: h = ((r - g) / delta + 4); break;
    }

    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

function updateFromHex(hexValue) {
  const cleanHex = hexValue.startsWith("#") ? hexValue : "#" + hexValue;
  const { r, g, b } = hexToRgb(hexValue);

  // HEX
  hex.text.value = cleanHex.toUpperCase();
  hex.picker.value = cleanHex;

  updateFromRgb(r, g, b);
}

function updateFromRgb(r, g, b) {
  const hexValue = rgbToHex(r, g, b);

  // HEX
  hex.text.value = hexValue.toUpperCase();
  hex.picker.value = hexValue;

  // RGB
  rgb.r.input.value = rgb.r.slider.value = r;
  rgb.g.input.value = rgb.g.slider.value = g;
  rgb.b.input.value = rgb.b.slider.value = b;

  rgb.text.value = `rgb(${r}, ${g}, ${b})`;
  rgb.picker.value = hexValue;

  // CMYK
  const { c, m, y, k } = rgbToCmyk(r, g, b);
  cmyk.c.input.value = cmyk.c.slider.value = c;
  cmyk.m.input.value = cmyk.m.slider.value = m;
  cmyk.y.input.value = cmyk.y.slider.value = y;
  cmyk.k.input.value = cmyk.k.slider.value = k;

  cmyk.text.value = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
  cmyk.picker.value = hexValue;

  // HSL
  const { h, s, l } = rgbToHsl(r, g, b);
  hsl.h.input.value = hsl.h.slider.value = h;
  hsl.s.input.value = hsl.s.slider.value = s;
  hsl.l.input.value = hsl.l.slider.value = l;

  hsl.text.value = `hsl(${h}°, ${s}%, ${l}%)`;
  hsl.picker.value = hexValue;

  // HSV
  const { h: hsvH, s: hsvS, v: hsvV } = rgbToHsv(r, g, b);
  hsv.h.input.value = hsv.h.slider.value = hsvH;
  hsv.s.input.value = hsv.s.slider.value = hsvS;
  hsv.v.input.value = hsv.v.slider.value = hsvV;

  hsv.text.value = `hsv(${hsvH}°, ${hsvS}%, ${hsvV}%)`;
  hsv.picker.value = hexValue;

}

function updateFromCmyk(c, m, y, k) {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  updateFromRgb(r, g, b);
}

function updateFromHsl(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  updateFromRgb(r, g, b);
}

function updateFromHsv(h, s, v) {
  const { r, g, b } = hsvToRgb(h, s, v);
  updateFromRgb(r, g, b);
}

rgb.picker.addEventListener("input", () => {
  const hexValue = rgb.picker.value;
  const { r, g, b } = hexToRgb(hexValue);
  updateFromRgb(r, g, b);
});

cmyk.picker.addEventListener("input", () => {
  const hexValue = cmyk.picker.value;
  const { r, g, b } = hexToRgb(hexValue);
  updateFromRgb(r, g, b);
});

hsl.picker.addEventListener("input", () => {
  const hexValue = hsl.picker.value;
  const { r, g, b } = hexToRgb(hexValue);
  updateFromRgb(r, g, b);
});

hsv.picker.addEventListener("input", () => {
  const hexValue = hsv.picker.value;
  const { r, g, b } = hexToRgb(hexValue);
  updateFromRgb(r, g, b);
});



function onColorInput() {
  // HEX 
  hex.text.addEventListener("input", () => {
    const val = hex.text.value;
    if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
      updateFromHex(val.startsWith("#") ? val : "#" + val);
    }
  });

  hex.picker.addEventListener("input", () => {
    updateFromHex(hex.picker.value);
  });

  // RGB 
  ["r", "g", "b"].forEach(ch => {
    rgb[ch].input.addEventListener("input", () => {
      const r = parseInt(rgb.r.input.value) || 0;
      const g = parseInt(rgb.g.input.value) || 0;
      const b = parseInt(rgb.b.input.value) || 0;
      updateFromRgb(r, g, b);
    });

    rgb[ch].slider.addEventListener("input", () => {
      const r = parseInt(rgb.r.slider.value);
      const g = parseInt(rgb.g.slider.value);
      const b = parseInt(rgb.b.slider.value);
      updateFromRgb(r, g, b);
    });
  });

  // CMYK
  ["c", "m", "y", "k"].forEach(ch => {
    cmyk[ch].input.addEventListener("input", () => {
      const c = parseInt(cmyk.c.input.value) || 0;
      const m = parseInt(cmyk.m.input.value) || 0;
      const y = parseInt(cmyk.y.input.value) || 0;
      const k = parseInt(cmyk.k.input.value) || 0;
      updateFromCmyk(c, m, y, k);
    });

    cmyk[ch].slider.addEventListener("input", () => {
      const c = parseInt(cmyk.c.slider.value);
      const m = parseInt(cmyk.m.slider.value);
      const y = parseInt(cmyk.y.slider.value);
      const k = parseInt(cmyk.k.slider.value);
      updateFromCmyk(c, m, y, k);
    });
  });

  //HSL
  ["h", "s", "l"].forEach(ch => {
    hsl[ch].input.addEventListener("input", () => {
      const h = parseInt(hsl.h.input.value) || 0;
      const s = parseInt(hsl.s.input.value) || 0;
      const l = parseInt(hsl.l.input.value) || 0;
      updateFromHsl(h, s, l);
    });

    hsl[ch].slider.addEventListener("input", () => {
      const h = parseInt(hsl.h.slider.value);
      const s = parseInt(hsl.s.slider.value);
      const l = parseInt(hsl.l.slider.value);
      updateFromHsl(h, s, l);
    });
  });

  //HSV
  ["h", "s", "v"].forEach(ch => {
    hsv[ch].input.addEventListener("input", () => {
      const h = parseInt(hsv.h.input.value) || 0;
      const s = parseInt(hsv.s.input.value) || 0;
      const v = parseInt(hsv.v.input.value) || 0;
      updateFromHsv(h, s, v);
    });

    hsv[ch].slider.addEventListener("input", () => {
      const h = parseInt(hsv.h.slider.value);
      const s = parseInt(hsv.s.slider.value);
      const v = parseInt(hsv.v.slider.value);
      updateFromHsv(h, s, v);
    });
  });

  if (!originalImageData) return;

  const rOffset = parseInt(document.getElementById('tbRGB_R').value);
  const gOffset = parseInt(document.getElementById('tbRGB_G').value);
  const bOffset = parseInt(document.getElementById('tbRGB_B').value);

  const imageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = clamp(imageData.data[i] + rOffset, 0, 255);     // Red
    imageData.data[i + 1] = clamp(imageData.data[i + 1] + gOffset, 0, 255); // Green
    imageData.data[i + 2] = clamp(imageData.data[i + 2] + bOffset, 0, 255); // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}

const fileInput = document.getElementById('upload-image');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
let originalImageData = null; 

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); 
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

document.getElementById('download-btn').addEventListener('click', function () {
  const canvas = document.getElementById('image-canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  const imgData = ctx.getImageData(0, 0, width, height).data;
  
  let hasImage = false;
  for (let i = 3; i < imgData.length; i += 4) { // alpha channel
    if (imgData[i] !== 0) {
      hasImage = true;
      break;
    }
  }

  if (!hasImage) {
    alert('Không có ảnh để tải xuống!');
    return;
  }

  const image = canvas.toDataURL('image/png'); 
  const link = document.createElement('a');
  link.href = image;
  link.download = 'edited.png';
  link.click();
});



window.addEventListener("DOMContentLoaded", onColorInput);
