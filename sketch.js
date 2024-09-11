let theta = 0;
let rectSize = 15;
let zoom = 0;
let valuesL = 28;
let addedRadius = 0;
let targetRadius = 0;
let t = 0.0;
let thetaIncrement = 0.001; // Initialize thetaIncrement for controlling speed
let showStroke = true; // Variable to toggle stroke
let redrawBackground = true; // Variable to toggle background redraw
let staggerAmount = 0; // Variable to control hue staggering
let currentBlendMode; // Declare but don't initialize yet

// Simulated values
let simulatedMouseX = 800;
let hueValue = 0;
let saturationValue = 100;
let lightnessValue = 50; // Fixed at 50%
let alphaValue = 0.8; // Default alpha (opacity)

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();

  // Initialize default blend mode to BLEND after p5.js has loaded
  currentBlendMode = BLEND;

  // Attach color picker element
  let colorPicker = document.getElementById('colorPicker');
  colorPicker.addEventListener('input', () => {
    let col = colorPicker.value;
    let hsl = hexToHSL(col);
    hueValue = hsl.h;
    saturationValue = hsl.s;
  });

  // Attach alpha slider element
  let alphaSlider = document.getElementById('alphaSlider');
  alphaSlider.addEventListener('input', () => alphaValue = alphaSlider.value / 100); // Convert to a 0-1 range for alpha

  // Attach stroke checkbox element
  let strokeCheckbox = document.getElementById('strokeCheckbox');
  strokeCheckbox.addEventListener('change', () => {
    showStroke = strokeCheckbox.checked;

    // If stroke is re-enabled, set blend mode to BLEND
    if (showStroke) {
      currentBlendMode = BLEND;
      document.getElementById('blendModeSelect').value = 'blend';
    }
  });

  // Attach x position slider
  let xSlider = document.getElementById('xSlider');
  xSlider.addEventListener('input', () => simulatedMouseX = xSlider.value);

  // Attach radius slider
  let radiusSlider = document.getElementById('radiusSlider');
  radiusSlider.addEventListener('input', () => targetRadius = radiusSlider.value);

  // Attach speed slider
  let speedSlider = document.getElementById('speedSlider');
  speedSlider.addEventListener('input', () => thetaIncrement = speedSlider.value / 10000); // Adjust speed based on slider

  // Attach background redraw checkbox
  let bgCheckbox = document.getElementById('bgCheckbox');
  bgCheckbox.addEventListener('change', () => redrawBackground = bgCheckbox.checked); // Toggle background redraw on checkbox change

  // Attach stagger slider
  let staggerSlider = document.getElementById('staggerSlider');
  staggerSlider.addEventListener('input', () => staggerAmount = staggerSlider.value); // Update stagger amount based on slider

  // Attach blend mode selector
  let blendModeSelect = document.getElementById('blendModeSelect');
  blendModeSelect.addEventListener('change', () => {
    let selectedBlendMode = blendModeSelect.value;
    
    // Set the blend mode based on the selected value
    switch (selectedBlendMode) {
      case 'blend':
        currentBlendMode = BLEND;
        break;
      case 'add':
        currentBlendMode = ADD;
        break;
      case 'subtract':
        currentBlendMode = SUBTRACT;
        break;
      case 'difference':
        currentBlendMode = DIFFERENCE;
        break;
      case 'multiply':
        currentBlendMode = MULTIPLY;
        break;
      case 'overlay':
        currentBlendMode = OVERLAY;
        break;
    }

    // If the blend mode is not BLEND, uncheck the stroke checkbox and disable strokes
    if (currentBlendMode !== BLEND) {
      showStroke = false;
      strokeCheckbox.checked = false;
    }
  });
}

function draw() {
  let values = new Array(valuesL);
  let values2 = new Array(valuesL);

  // Update theta based on the current speed
  theta += thetaIncrement;

  // Smoothly animate the radius towards the target value
  addedRadius = lerp(addedRadius, targetRadius, 0.05);

  translate(width / 2, height / 2);

  // Redraw background only if the checkbox is checked
  if (redrawBackground) {
    background(240);
  }

  // Apply the selected blend mode
  blendMode(currentBlendMode);

  for (let i = 0; i < values.length; i++) {
    values[i] = i;
    let totalPlanets = new Array(valuesL);

    for (let _i = 0; _i < values.length; _i++) {
      // Adjust the hue staggering based on the updated slider range (0-360)
      let staggeredHue = hueValue + ((_i + i) * staggerAmount);
      staggeredHue = staggeredHue % 360; // Ensure hue stays within 0-360

      // Draw each planet (ellipse) with the staggered hue
      drawPlanet(i * map(simulatedMouseX, 0, width, 0, 45), (_i + 1) / (-i - 0.5), staggeredHue, saturationValue, lightnessValue, alphaValue, _i / 2 + addedRadius);
    }
  }

  // Reset blend mode to default for future drawings
  blendMode(BLEND);
}

function drawPlanet(distance, speed, hue, saturation, lightness, alpha, radius) {
  push();
  rotate(theta * speed);
  translate(distance, 0);

  if (showStroke) {
    stroke(0); // Set stroke to black if checkbox is checked
  } else {
    noStroke(); // Remove stroke if checkbox is unchecked
  }

  // Set the fill color using HSLA with the staggered hue, saturation, lightness, and alpha
  fill(`hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);

  ellipse(rectSize, rectSize, radius, radius);
  pop();
}

// Function to convert hex color from the color picker to HSL
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255;
    g = parseInt(hex.substring(3, 5), 16) / 255;
    b = parseInt(hex.substring(5, 7), 16) / 255;
  }
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max != min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Automatically adjust the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
