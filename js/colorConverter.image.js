let currentMode = 1;

function switchMode() {
  currentMode = 3 - currentMode; 

  document.getElementById("mode-1").style.display =
    currentMode === 1 ? "block" : "none";
  document.getElementById("mode-2").style.display =
    currentMode === 2 ? "block" : "none";

  document.getElementById("switch-btn").textContent =
    currentMode === 1
      ? "Chuyển sang chế độ Tách kênh màu"
      : "Chuyển sang chế độ Đồng bộ màu";
}

function handleImageDisplay() {
  const fileInput = document.getElementById("upload-image-mode2");
  const model = document.getElementById("color-model-select").value;
  const container = document.getElementById("color-version-container");

  if (!fileInput.files[0]) return;

  const img = new Image();
  const reader = new FileReader();
  reader.onload = (e) => (img.src = e.target.result);

  img.onload = () => {
    const width = img.width;
    const height = img.height;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);

    // clone lại dữ liệu gốc để xử lý
    const cloned = new ImageData(
      new Uint8ClampedArray(imageData.data),
      width,
      height
    );

    const channelImages = convertColorModelImageMode(cloned, model);
    const channels = getColorChannelsImageMode(model);

    container.innerHTML = "";

    channelImages.forEach((channelData, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "col-3";

      const label = document.createElement("h6");
      label.textContent = `Kênh ${channels[idx]} của ${model.toUpperCase()}`;
      wrapper.appendChild(label);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.className = "w-100 border";
      wrapper.appendChild(canvas);

      const c = canvas.getContext("2d");
      c.putImageData(channelData, 0, 0);

      container.appendChild(wrapper);
    });
  };

  reader.readAsDataURL(fileInput.files[0]);
}

function getColorChannelsImageMode(model) {
  switch (model.toUpperCase()) {
    case "RGB":
      return ["R", "G", "B"];
    case "CMYK":
      return ["C", "M", "Y", "K"];
    case "HSV":
      return ["H", "S", "V"];
    case "HSL":
      return ["H", "S", "L"];
    case "YIQ":
      return ["Y", "I", "Q"];
    default:
      return [];
  }
}

function convertColorModelImageMode(cloned, model) {
  const width = cloned.width;
  const height = cloned.height;
  const numChannels = getColorChannelsImageMode(model).length;
  const channelImages = [];

  // Hàm chuyển giá trị từ [-1,1] sang [0,1]
  const mapTo01 = (v) => (v + 1) / 2;

  for (let ch = 0; ch < numChannels; ch++) {
    const output = new ImageData(width, height);

    for (let i = 0; i < cloned.data.length; i += 4) {
      const r = cloned.data[i] / 255;
      const g = cloned.data[i + 1] / 255;
      const b = cloned.data[i + 2] / 255;

      let components, rgb;

      switch (model.toUpperCase()) {
        case "RGB":
          components = [r, g, b];
          rgb = [0, 0, 0];
          rgb[ch] = components[ch];
          break;

        case "CMYK":
          components = rgbToCmykImage(r, g, b);
          let modifiedCmyk = components.map((v, idx) => (idx === ch ? v : 0));
          rgb = cmykToRgbImage(...modifiedCmyk);
          break;

        case "HSV":
          components = rgbToHsvImage(r, g, b);
          if (ch === 0) {
            // Hue channel: giữ Hue gốc, S=1, V=1
            rgb = hsvToRgbImage(components[0], 1, 1);
          } else if (ch === 1) {
            // Saturation channel: Hue=0 (đỏ), S = giá trị S, V=1
            rgb = hsvToRgbImage(0, components[1], 1);
          } else {
            // Value channel: grayscale
            const val = components[2];
            rgb = [val, val, val];
          }
          break;

        case "HSL":
          components = rgbToHslImage(r, g, b);
          if (ch === 0) {
            // Hue channel: giữ Hue gốc, S=1, L=0.5
            rgb = hslToRgbImage(components[0], 1, 0.5);
          } else if (ch === 1) {
            // Saturation channel: Hue=0 (đỏ), S = giá trị S, L=0.5
            rgb = hslToRgbImage(0, components[1], 0.5);
          } else {
            // Lightness channel: grayscale
            const val = components[2];
            rgb = [val, val, val];
          }
          break;

        case "YIQ":
          components = rgbToYiqImage(r, g, b);
          const modified = [0, 0, 0];
          modified[ch] = components[ch];
          rgb = yiqToRgbImage(...modified); // chỉ giữ 1 thành phần Y hoặc I hoặc Q
          break;

        default:
          rgb = [r, g, b];
          break;
      }

      output.data[i] = Math.round(Math.min(255, Math.max(0, rgb[0] * 255)));
      output.data[i + 1] = Math.round(Math.min(255, Math.max(0, rgb[1] * 255)));
      output.data[i + 2] = Math.round(Math.min(255, Math.max(0, rgb[2] * 255)));
      output.data[i + 3] = 255; // alpha
    }

    channelImages.push(output);
  }

  return channelImages;
}

function rgbToCmykImage(r, g, b) {
  // r,g,b là 0..1
  let c = 1 - r;
  let m = 1 - g;
  let y = 1 - b;
  let k = Math.min(c, m, y);

  if (k === 1) return [0, 0, 0, 1];

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  return [c, m, y, k];
}
function rgbToHslImage(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}
function rgbToHsvImage(r, g, b) {
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, v];
}
function cmykToRgbImage(c, m, y, k) {
  // trả về 0..1
  const r = (1 - c) * (1 - k);
  const g = (1 - m) * (1 - k);
  const b = (1 - y) * (1 - k);
  return [r, g, b];
}
function hslToRgbImage(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; 
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}
function hsvToRgbImage(h, s, v) {
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [r, g, b];
}
function rgbToYiqImage(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const i = 0.596 * r - 0.274 * g - 0.322 * b;
  const q = 0.211 * r - 0.523 * g + 0.312 * b;
  return [y, i, q];
}

function yiqToRgbImage(y, i, q) {
  const r = y + 0.956 * i + 0.621 * q;
  const g = y - 0.272 * i - 0.647 * q;
  const b = y - 1.106 * i + 1.703 * q;
  return [r, g, b];
}
