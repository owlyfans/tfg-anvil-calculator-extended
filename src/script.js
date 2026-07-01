const darkModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#cccccc" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675Z"/><path fill="currentColor" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63Z"/></svg>`;

const lightModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75Z"/><path fill="currentColor" fill-rule="evenodd" d="M6.25 12a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0ZM12 7.75a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5Z" clip-rule="evenodd"/><path fill="currentColor" d="M5.46 4.399a.75.75 0 0 0-1.061 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM22.75 12a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm-3.149-6.54a.75.75 0 1 0-1.06-1.061l-.707.707a.75.75 0 1 0 1.06 1.06l.707-.707ZM12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75Zm6.894-2.416a.75.75 0 1 0-1.06 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM3.75 12a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm2.416 6.894a.75.75 0 0 0-1.06-1.06l-.707.707a.75.75 0 0 0 1.06 1.06l.707-.707Z"/></svg>`;

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();

  document.querySelectorAll('.action-icon').forEach(icon => {
    icon.src = '../res/empty.png';
    icon.setAttribute('data-action', '');
  });

  document.querySelectorAll('.priority').forEach(select => {
    select.selectedIndex = 0;
  });

  document.getElementById('target-value').value = '';
  document.getElementById('result').classList.remove('visible');
});

// Event listener for the dark mode toggle switch
document.getElementById('mode-toggle-checkbox').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateGitHubIconColor(true);
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('darkMode', 'false');
    updateGitHubIconColor(false);
  }
  updateModeIcon();
});

// Function to update the mode icon
function updateModeIcon() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  modeIcon.innerHTML = isDarkMode ? darkModeIcon : lightModeIcon;
}

// Set dark mode as default and handle mode persistence
function initializeMode() {
  const storedMode = localStorage.getItem('darkMode');
  const darkModeEnabled = storedMode === null ? true : storedMode === 'true';
  const modeToggle = document.getElementById('mode-toggle-checkbox');

  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    modeToggle.checked = true;
    updateGitHubIconColor(true);
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    modeToggle.checked = false;
    updateGitHubIconColor(false);
  }
  updateModeIcon();
}

// ============================================================
// Paste-to-read target value from an anvil GUI screenshot.
//
// The anvil's work-value ruler draws one tick per unit, alternating a
// darker and lighter gray, with an orange tick at every value ending in 5
// (5, 15, 25, ...) and a taller tick at every multiple of 10. A red arrow
// marks the target value. We locate the ruler by scanning for a row with
// evenly spaced orange ticks (a signature unlikely to occur elsewhere in a
// screenshot), use that spacing to calibrate pixels-per-unit, then find the
// red arrow's horizontal center relative to that scale.
// ============================================================

function isGrayscalePixel(r, g, b, tolerance = 14) {
  return Math.abs(r - g) <= tolerance && Math.abs(g - b) <= tolerance && Math.abs(r - b) <= tolerance;
}

function isOrangeTickPixel(r, g, b) {
  return r >= 170 && r <= 230 && g >= 95 && g <= 160 && b >= 55 && b <= 120 && (r - b) > 55 && (r - g) > 30;
}

function isRulerTickPixel(r, g, b) {
  if (isOrangeTickPixel(r, g, b)) return true;
  if (!isGrayscalePixel(r, g, b)) return false;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return (lum >= 40 && lum <= 85) || (lum >= 115 && lum <= 165);
}

function isRedArrowPixel(r, g, b) {
  return r >= 180 && g <= 70 && b <= 70;
}

// Scans every row for the ruler's tick pattern, scored by how long a
// contiguous run of tick-colored pixels it has and how many evenly spaced
// orange ("value ending in 5") marks it contains. Returns the best-scoring
// row's y and the x-centers of its orange marks, or null if none qualifies.
function findRulerTickRow(getPixel, width, height) {
  let best = null;

  for (let y = 0; y < height; y++) {
    let run = 0;
    let maxRun = 0;
    const orangeBlobs = [];
    let inOrange = false;
    let orangeStart = 0;

    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y);

      if (isRulerTickPixel(r, g, b)) {
        run++;
        if (run > maxRun) maxRun = run;
      } else {
        run = 0;
      }

      const orange = isOrangeTickPixel(r, g, b);
      if (orange && !inOrange) { inOrange = true; orangeStart = x; }
      if (!orange && inOrange) { inOrange = false; orangeBlobs.push((orangeStart + x - 1) / 2); }
    }
    if (inOrange) orangeBlobs.push((orangeStart + width - 1) / 2);

    if (orangeBlobs.length < 2) continue;

    const spacings = [];
    for (let i = 1; i < orangeBlobs.length; i++) spacings.push(orangeBlobs[i] - orangeBlobs[i - 1]);
    const meanSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    const variance = spacings.reduce((a, b) => a + (b - meanSpacing) ** 2, 0) / spacings.length;
    const stddev = Math.sqrt(variance);
    if (stddev >= meanSpacing * 0.25) continue;

    const score = maxRun * (1 + orangeBlobs.length);
    if (!best || score > best.score) best = { y, orangeBlobs, score };
  }

  return best;
}

// Finds the red target-value arrow near the ruler's tick row and returns
// its horizontal center, or null if none is found.
function findRulerArrowCenterX(getPixel, width, height, tickRowY) {
  const top = Math.max(0, tickRowY - 15);
  const bottom = Math.min(height - 1, tickRowY + 15);
  let minX = Infinity;
  let maxX = -Infinity;

  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y);
      if (isRedArrowPixel(r, g, b)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }

  return minX <= maxX ? (minX + maxX) / 2 : null;
}

// Reads a pasted anvil GUI screenshot (or a tight crop of just the ruler)
// and returns the target value marked by the red arrow. Throws if the
// ruler or the arrow can't be found.
function detectAnvilTargetValue(imgElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth || imgElement.width;
  canvas.height = imgElement.naturalHeight || imgElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const getPixel = (x, y) => {
    const i = (y * canvas.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const tickRow = findRulerTickRow(getPixel, canvas.width, canvas.height);
  if (!tickRow) throw new Error("Couldn't find the anvil ruler in that image.");

  const spacings = [];
  for (let i = 1; i < tickRow.orangeBlobs.length; i++) spacings.push(tickRow.orangeBlobs[i] - tickRow.orangeBlobs[i - 1]);
  const pxPerUnit = (spacings.reduce((a, b) => a + b, 0) / spacings.length) / 10;
  const zeroX = tickRow.orangeBlobs[0] - 5 * pxPerUnit;

  const arrowCenterX = findRulerArrowCenterX(getPixel, canvas.width, canvas.height, tickRow.y);
  if (arrowCenterX === null) throw new Error("Couldn't find the target arrow on the ruler.");

  return Math.max(0, Math.round((arrowCenterX - zeroX) / pxPerUnit));
}

function setTargetScreenshotStatus(message, kind) {
  const status = document.getElementById('target-screenshot-status');
  status.textContent = message;
  status.classList.remove('status-success', 'status-error');
  if (kind) status.classList.add(`status-${kind}`);
}

function handleTargetScreenshotPaste(event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (!items) return;

  for (const item of items) {
    if (!item.type.startsWith('image/')) continue;

    event.preventDefault();
    const blob = item.getAsFile();
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = function() {
      setTargetScreenshotStatus('Reading image…', null);
      setTimeout(() => {
        try {
          const value = detectAnvilTargetValue(img);
          document.getElementById('target-value').value = value;
          setTargetScreenshotStatus(`Detected target value: ${value}`, 'success');
        } catch (err) {
          setTargetScreenshotStatus(err.message, 'error');
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }, 0);
    };
    img.src = objectUrl;
    break;
  }
}

document.getElementById('target-screenshot-dropzone').addEventListener('paste', handleTargetScreenshotPaste);
document.getElementById('target-value').addEventListener('paste', handleTargetScreenshotPaste);

// Helper function to create a colored wrapper + image for a result action.
// badgeNumber, if given, renders a small number above the icon (used to mark
// an item's position within a run of consecutive repeats).
function createActionImage(action, badgeNumber) {
  const baseAction = action.replace(/\d+$/, ''); // hit1/hit2/hit3 → hit

  const wrapper = document.createElement("div");
  wrapper.className = "result-icon-wrapper";
  wrapper.setAttribute("data-action", action);

  if (badgeNumber) {
    const badge = document.createElement("span");
    badge.className = "result-icon-badge";
    badge.textContent = badgeNumber;
    wrapper.appendChild(badge);
  }

  const img = document.createElement("img");
  img.src = `../res/${action}.png`;
  img.alt = action;
  img.title = baseAction.charAt(0).toUpperCase() + baseAction.slice(1);
  img.classList.add("result-icon");

  wrapper.appendChild(img);

  return wrapper;
}

// Returns, for each entry in actionsList, its 1-based position within its run
// of consecutive identical actions — or null if that action doesn't repeat.
// e.g. [A,A,A,A,A,B,B,A,A] -> [1,2,3,4,5,1,2,1,2]
function computeRunBadges(actionsList) {
  const badges = new Array(actionsList.length).fill(null);
  let i = 0;
  while (i < actionsList.length) {
    let j = i;
    while (j < actionsList.length && actionsList[j] === actionsList[i]) j++;
    const runLength = j - i;
    if (runLength > 1) {
      for (let k = 0; k < runLength; k++) badges[i + k] = k + 1;
    }
    i = j;
  }
  return badges;
}

// Renders a list of actions into container as icons, with repeat-run badges
function renderActionRow(container, actionsList) {
  container.innerHTML = '';
  const badges = computeRunBadges(actionsList);
  actionsList.forEach((action, idx) => {
    container.appendChild(createActionImage(action, badges[idx]));
  });
}

// Function to apply tooltips to existing action icons in the instruction set and popup
function applyTooltipToIcon(iconElement) {
  const action = iconElement.getAttribute("data-action");
  if (action) {
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    iconElement.title = capitalizedAction;
  } else if (action === "") {
    iconElement.title = "None";
  }
}

// Holds the most recently calculated result, used when saving a recipe
let lastCalculation = null;

function showCalculateError(message) {
  document.getElementById('calculate-error').textContent = message;
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
  document.getElementById('result').classList.remove('visible');
  lastCalculation = null;
}

document.getElementById("calculate-button").addEventListener("click", function() {
  document.getElementById('calculate-error').textContent = '';

  const targetValue = parseInt(document.getElementById("target-value").value);
  if (!Number.isFinite(targetValue)) {
    showCalculateError('Please enter a target value.');
    return;
  }

  // Collect and filter instructions
  const instructions = [];
  document.querySelectorAll("[class^='instruction-set']").forEach((set) => {
    const actionElement = set.querySelector(".action-icon");
    const action = actionElement.getAttribute("data-action");
    const priority = set.querySelector(".priority").value;
    if (action && priority) {
      instructions.push({ action, priority });
    }
  });

  // Action values
  const actions = {
    punch: 2,
    bend: 7,
    upset: 13,
    shrink: 16,
    hit1: -3,
    hit2: -6,
    hit3: -9,
    draw: -15
  };

  function selectBestHit(preTargetValue, remainingHits) {
    let bestHitAction = null;
    let minActions = Infinity;

    remainingHits.forEach(hit => {
      const hitValue = actions[hit];
      const actionsNeeded = Math.ceil(preTargetValue / hitValue);
      if (actionsNeeded < minActions && (preTargetValue % hitValue === 0 || preTargetValue + hitValue <= targetValue)) {
        minActions = actionsNeeded;
        bestHitAction = hit;
      }
    });

    return bestHitAction;
  }

  function calculateSetupActions(targetValue, instructions) {
    let instructionSum = 0;
    instructions.forEach(instr => {
      if (instr.action === "hit") {
        const bestHit = selectBestHit(targetValue - instructionSum, ["hit1", "hit2", "hit3"]);
        instructionSum += actions[bestHit];
        instr.action = bestHit;
      } else {
        instructionSum += actions[instr.action];
      }
    });

    let preTargetValue = targetValue - instructionSum;
    if (!Number.isFinite(preTargetValue) || preTargetValue < 0) {
      throw new Error('The selected final instructions already overshoot this target value — pick a higher target or different instructions.');
    }
    const dp = Array(preTargetValue + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 0; i <= preTargetValue; i++) {
      if (dp[i] !== Infinity) {
        for (let action in actions) {
          let nextValue = i + actions[action];
          if (nextValue <= preTargetValue) {
            dp[nextValue] = Math.min(dp[nextValue], dp[i] + 1);
          }
        }
      }
    }

    let setupActions = [];
    let currentValue = preTargetValue;

    while (currentValue > 0) {
      for (let action in actions) {
        let prevValue = currentValue - actions[action];
        if (prevValue >= 0 && dp[prevValue] === dp[currentValue] - 1) {
          setupActions.push(action);
          currentValue = prevValue;
          break;
        }
      }
    }

    setupActions.reverse();

    return setupActions;
  }

  function sortInstructions(instructions) {
    const last = instructions.filter(i => i.priority === 'last');
    const secondLast = instructions.filter(i => i.priority === 'second-last');
    const thirdLast = instructions.filter(i => i.priority === 'third-last');
    const notLast = instructions.filter(i => i.priority === 'not-last');
    const anyPriority = instructions.filter(i => i.priority === 'any');

    let sortedInstructions = [...thirdLast, ...secondLast, ...notLast, ...last];

    if (anyPriority.length > 0) {
      const anyHits = anyPriority.map(i => i);

      let insertionPoint = 0;
      if (last.length > 0 && secondLast.length > 0) {
        insertionPoint = sortedInstructions.length - last.length - secondLast.length;
      } else if (last.length > 0) {
        insertionPoint = sortedInstructions.length - last.length;
      } else {
        insertionPoint = sortedInstructions.length;
      }

      sortedInstructions.splice(insertionPoint, 0, ...anyHits);
    }

    return sortedInstructions;
  }

  // Resolve "Hit" magnitudes and sum instruction values in the order they're
  // actually applied in-game (third-last -> ... -> last), not UI slot order,
  // since the remaining-value math for picking a hit's size depends on it.
  const sortedInstructions = sortInstructions(instructions);

  let setupActions;
  try {
    setupActions = calculateSetupActions(targetValue, sortedInstructions);
  } catch (err) {
    showCalculateError(err.message);
    return;
  }

  // Display results as images
  const setupContainer = document.getElementById("setup-actions");
  const finalContainer = document.getElementById("final-actions");
  const finalActions = sortedInstructions.map(instr => instr.action);

  renderActionRow(setupContainer, setupActions);
  renderActionRow(finalContainer, finalActions);

  // Show the result card with a transition
  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");

  // Remember this result so it can be saved as a recipe
  lastCalculation = {
    targetValue,
    setupActions: [...setupActions],
    finalActions
  };
});

// ============================================================
// Recent Anvil Recipes — save/view/localStorage
// ============================================================
const RECIPES_STORAGE_KEY = 'tfgAnvilRecipes';
const MAX_STORED_RECIPES = 50;

function loadRecipes() {
  try {
    const raw = localStorage.getItem(RECIPES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecipes(recipes) {
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes.slice(0, MAX_STORED_RECIPES)));
}

function deleteRecipe(id) {
  saveRecipes(loadRecipes().filter(recipe => recipe.id !== id));
  renderRecentRecipes();
}

// Chain-view mode — an opt-in state entered via the "View Chain" button.
// While active, clicking a recipe selects it (instead of opening the view
// popup); selecting a second recipe opens both side by side as a chain and
// exits chain-view mode.
let chainMode = false;
let chainSelection = [];

function updateChainControls(recipeCount) {
  const button = document.getElementById('chain-toggle-button');
  const hint = document.getElementById('chain-hint');

  button.disabled = !chainMode && recipeCount < 2;
  button.textContent = chainMode ? 'Cancel Chain' : 'View Chain';
  button.classList.toggle('active', chainMode);

  hint.classList.toggle('hidden', !chainMode);
  hint.textContent = !chainMode
    ? ''
    : chainSelection.length < 2
      ? `Select 2 recipes to chain (${chainSelection.length}/2)`
      : 'Selection full — click a highlighted recipe to deselect';
}

function toggleChainMode() {
  chainMode = !chainMode;
  chainSelection = [];
  renderRecentRecipes();
}

function toggleRecipeSelection(id) {
  const idx = chainSelection.indexOf(id);
  if (idx !== -1) {
    chainSelection.splice(idx, 1);
  } else if (chainSelection.length < 2) {
    chainSelection.push(id);
  } else {
    return;
  }

  if (chainSelection.length === 2) {
    const recipes = loadRecipes();
    const recipeA = recipes.find(recipe => recipe.id === chainSelection[0]);
    const recipeB = recipes.find(recipe => recipe.id === chainSelection[1]);
    chainMode = false;
    chainSelection = [];
    renderRecentRecipes();
    if (recipeA && recipeB) openRecipeChain(recipeA, recipeB);
    return;
  }

  renderRecentRecipes();
}

function renderRecentRecipes() {
  const listContainer = document.getElementById('recent-recipes-list');
  const sectionCard = document.getElementById('recent-recipes');
  const recipes = loadRecipes();

  listContainer.innerHTML = '';
  listContainer.classList.toggle('chain-mode', chainMode);
  sectionCard.style.display = recipes.length ? '' : 'none';

  recipes.forEach(recipe => {
    const isSelected = chainSelection.includes(recipe.id);

    const item = document.createElement('div');
    item.className = isSelected ? 'recipe-item selected' : 'recipe-item';
    item.dataset.id = recipe.id;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'recipe-item-icon-wrap';

    const img = document.createElement('img');
    img.className = 'recipe-item-icon';
    img.src = recipe.icon || '../res/empty.png';
    img.alt = recipe.name;
    iconWrap.appendChild(img);

    if (chainMode) {
      if (isSelected) {
        const check = document.createElement('span');
        check.className = 'recipe-item-check';
        check.textContent = '✓';
        iconWrap.appendChild(check);
      }
    } else {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'recipe-item-delete';
      deleteButton.textContent = '×';
      deleteButton.title = `Delete "${recipe.name}"`;
      deleteButton.setAttribute('aria-label', `Delete "${recipe.name}"`);
      deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        deleteRecipe(recipe.id);
      });
      iconWrap.appendChild(deleteButton);
    }

    const label = document.createElement('span');
    label.className = 'recipe-item-name';
    label.textContent = recipe.name;

    item.appendChild(iconWrap);
    item.appendChild(label);
    item.addEventListener('click', () => {
      if (chainMode) {
        toggleRecipeSelection(recipe.id);
      } else {
        openViewRecipe(recipe);
      }
    });

    listContainer.appendChild(item);
  });

  updateChainControls(recipes.length);
}

function fillChainPanel(side, recipe) {
  document.getElementById(`recipe-chain-${side}-icon`).src = recipe.icon || '../res/empty.png';
  document.getElementById(`recipe-chain-${side}-name`).textContent = recipe.name;
  document.getElementById(`recipe-chain-${side}-target`).textContent = `Target: ${recipe.targetValue}`;
  renderActionRow(document.getElementById(`recipe-chain-${side}-setup`), recipe.setupActions);
  renderActionRow(document.getElementById(`recipe-chain-${side}-final`), recipe.finalActions);
}

function openRecipeChain(recipeA, recipeB) {
  fillChainPanel('a', recipeA);
  fillChainPanel('b', recipeB);
  document.getElementById('recipe-chain-overlay').classList.remove('hidden');
}

function closeRecipeChain() {
  document.getElementById('recipe-chain-overlay').classList.add('hidden');
}

// Crops an image to a centered square and returns a data URL
function cropImageToSquareDataUrl(img, outputSize = 128) {
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);

  return canvas.toDataURL('image/png');
}

// Builds a document-level paste handler that crops a pasted image and
// writes the result into the given preview <img>, reporting it via onCropped.
function createIconPasteHandler(previewElementId, onCropped) {
  return function(event) {
    const items = event.clipboardData && event.clipboardData.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = function() {
          const dataUrl = cropImageToSquareDataUrl(img);
          document.getElementById(previewElementId).src = dataUrl;
          onCropped(dataUrl);
          URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
        event.preventDefault();
        break;
      }
    }
  };
}

let pendingIconDataUrl = null;
const handleSaveIconPaste = createIconPasteHandler('save-icon-preview', dataUrl => {
  pendingIconDataUrl = dataUrl;
});

function openSaveDialog() {
  if (!lastCalculation) return;

  pendingIconDataUrl = null;
  document.getElementById('save-icon-preview').src = '../res/empty.png';
  document.getElementById('recipe-name-input').value = '';
  document.getElementById('save-target-preview').textContent = `Target: ${lastCalculation.targetValue}`;

  document.getElementById('save-recipe-overlay').classList.remove('hidden');
  document.addEventListener('paste', handleSaveIconPaste);
  document.getElementById('recipe-name-input').focus();
}

function closeSaveDialog() {
  document.getElementById('save-recipe-overlay').classList.add('hidden');
  document.removeEventListener('paste', handleSaveIconPaste);
}

let currentlyViewedRecipeId = null;

function openViewRecipe(recipe) {
  currentlyViewedRecipeId = recipe.id;

  document.getElementById('view-recipe-icon').src = recipe.icon || '../res/empty.png';
  document.getElementById('view-recipe-name').textContent = recipe.name;
  document.getElementById('view-recipe-target').textContent = `Target: ${recipe.targetValue}`;

  renderActionRow(document.getElementById('view-recipe-setup'), recipe.setupActions);
  renderActionRow(document.getElementById('view-recipe-final'), recipe.finalActions);

  document.getElementById('view-recipe-overlay').classList.remove('hidden');
}

function closeViewRecipe() {
  document.getElementById('view-recipe-overlay').classList.add('hidden');
}

let pendingEditIconDataUrl = null;
const handleEditIconPaste = createIconPasteHandler('edit-icon-preview', dataUrl => {
  pendingEditIconDataUrl = dataUrl;
});

function openEditDialog() {
  const recipe = loadRecipes().find(r => r.id === currentlyViewedRecipeId);
  if (!recipe) return;

  pendingEditIconDataUrl = recipe.icon || null;
  document.getElementById('edit-icon-preview').src = recipe.icon || '../res/empty.png';
  document.getElementById('edit-name-input').value = recipe.name;
  document.getElementById('edit-target-preview').textContent = `Target: ${recipe.targetValue}`;

  closeViewRecipe();
  document.getElementById('edit-recipe-overlay').classList.remove('hidden');
  document.addEventListener('paste', handleEditIconPaste);
  document.getElementById('edit-name-input').focus();
}

function closeEditDialog() {
  document.getElementById('edit-recipe-overlay').classList.add('hidden');
  document.removeEventListener('paste', handleEditIconPaste);
}

document.getElementById('save-recipe-button').addEventListener('click', openSaveDialog);
document.getElementById('cancel-save-recipe').addEventListener('click', closeSaveDialog);
document.getElementById('close-view-recipe').addEventListener('click', closeViewRecipe);
document.getElementById('edit-recipe-button').addEventListener('click', openEditDialog);
document.getElementById('cancel-edit-recipe').addEventListener('click', closeEditDialog);
document.getElementById('chain-toggle-button').addEventListener('click', toggleChainMode);
document.getElementById('close-recipe-chain').addEventListener('click', closeRecipeChain);

document.getElementById('save-recipe-overlay').addEventListener('click', function(event) {
  if (event.target === this) closeSaveDialog();
});

document.getElementById('view-recipe-overlay').addEventListener('click', function(event) {
  if (event.target === this) closeViewRecipe();
});

document.getElementById('edit-recipe-overlay').addEventListener('click', function(event) {
  if (event.target === this) closeEditDialog();
});

document.getElementById('recipe-chain-overlay').addEventListener('click', function(event) {
  if (event.target === this) closeRecipeChain();
});

document.addEventListener('keydown', function(event) {
  if (event.key !== 'Escape') return;
  if (!document.getElementById('save-recipe-overlay').classList.contains('hidden')) closeSaveDialog();
  if (!document.getElementById('view-recipe-overlay').classList.contains('hidden')) closeViewRecipe();
  if (!document.getElementById('edit-recipe-overlay').classList.contains('hidden')) closeEditDialog();
  if (!document.getElementById('recipe-chain-overlay').classList.contains('hidden')) closeRecipeChain();
  if (chainMode) toggleChainMode();
});

document.getElementById('confirm-save-recipe').addEventListener('click', function() {
  if (!lastCalculation) return;

  const nameInput = document.getElementById('recipe-name-input');
  const name = nameInput.value.trim() || 'Unnamed Recipe';

  const recipe = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    icon: pendingIconDataUrl,
    targetValue: lastCalculation.targetValue,
    setupActions: lastCalculation.setupActions,
    finalActions: lastCalculation.finalActions,
    savedAt: Date.now()
  };

  const recipes = loadRecipes();
  recipes.unshift(recipe);
  saveRecipes(recipes);
  renderRecentRecipes();
  closeSaveDialog();
});

document.getElementById('confirm-edit-recipe').addEventListener('click', function() {
  const recipes = loadRecipes();
  const recipe = recipes.find(r => r.id === currentlyViewedRecipeId);
  if (!recipe) return;

  const nameInput = document.getElementById('edit-name-input');
  recipe.name = nameInput.value.trim() || 'Unnamed Recipe';
  recipe.icon = pendingEditIconDataUrl;

  saveRecipes(recipes);
  renderRecentRecipes();
  closeEditDialog();
});

renderRecentRecipes();

// Single function to manage icon selection
function setupInstructionListener(selector) {
  const icon = document.querySelector(selector + ' .action-icon');
  const popup = document.getElementById('action-popup');

  icon.addEventListener('click', function(event) {
    event.stopPropagation();
    const currentIcon = this;

    // Position the popup directly under the clicked icon
    popup.classList.remove('hidden');
    const iconRect = currentIcon.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    let left = iconRect.left + window.scrollX;
    const maxLeft = window.scrollX + window.innerWidth - popupRect.width - 8;
    left = Math.max(window.scrollX + 8, Math.min(left, maxLeft));

    popup.style.top = `${iconRect.bottom + window.scrollY + 8}px`;
    popup.style.left = `${left}px`;

    // Remove all existing listeners on popup icons
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      popupIcon.onclick = null;
    });

    // Add listener to popup icons for the current selection
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      // Apply tooltip to each popup icon
      applyTooltipToIcon(popupIcon);

      popupIcon.onclick = function() {
        currentIcon.src = this.src;
        currentIcon.setAttribute('data-action', this.getAttribute('data-action'));
        closePopup();
      };
    });

    // Close popup when clicking outside of it
    function handleOutsideClick(event) {
      if (!popup.contains(event.target) && !icon.contains(event.target)) {
        closePopup();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    function closePopup() {
      popup.classList.add('hidden');
      document.removeEventListener('click', handleOutsideClick);
    }
  });

  // Apply tooltip to the instruction set icon on load
  applyTooltipToIcon(icon);
}

// Function to reset all inputs and selections
function resetPage() {
  // Reset target value input
  document.getElementById('target-value').value = '';

  // Reset instruction sets
  document.querySelectorAll('.instruction-set').forEach(set => {
    const actionIcon = set.querySelector('.action-icon');
    actionIcon.src = '../res/empty.png';
    actionIcon.setAttribute('data-action', '');
    actionIcon.title = 'None';

    const prioritySelect = set.querySelector('.priority');
    if (prioritySelect) {
      prioritySelect.selectedIndex = 0;
    }
  });

  // Hide result card
  const resultCard = document.getElementById('result');
  resultCard.classList.remove('visible');

  // Clear setup and final actions
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
}

function updateGitHubIconColor(isDarkMode) {
  const githubIcon = document.getElementById('github-icon');
  if (githubIcon) {
    githubIcon.style.fill = isDarkMode ? '#ffffff' : '#24292f';
  }
}

// Call resetPage on window load
window.addEventListener('load', resetPage);

// Apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');



