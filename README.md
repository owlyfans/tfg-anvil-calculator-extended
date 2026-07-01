# TFG Anvil Calculator (Extended Fork)

This is a fork of [AdrianMiller99/tfg-anvil-calculator](https://github.com/AdrianMiller99/tfg-anvil-calculator),
which helps you determine the most efficient sequence of smithing actions to always get a perfectly forged item
in the TerraFirmaGreg modpack. All credit for the original tool and design goes to
[AdrianMiller99](https://github.com/AdrianMiller99); this fork builds on top of it with the additions described below.

Link to the tool: https://owlyfans.github.io/tfg-anvil-calculator-extended/src/index.html

## What's New in This Fork

- **Recent Anvil Recipes** — save a calculated result (name, a custom icon pasted from the clipboard and
  auto-cropped to a square, target value, setup actions, and final actions) to a horizontally scrollable list,
  persisted in your browser's local storage.
- **Edit & delete saved recipes** — rename a saved recipe or replace its icon at any time; delete recipes you
  no longer need (delete button appears on hover).
- **Chain View** — opt in to selecting two saved recipes and view them side by side to compare their setup and
  final actions.
- **Paste-a-screenshot target detection** — paste a screenshot of the in-game anvil GUI (or just the ruler) and
  the calculator reads the red arrow's position on the work-value ruler to auto-fill the Target Value field, no
  resource pack or manual reading required.
- **More visible action colors and clearer delete affordance** — action icon backgrounds use stronger color
  saturation, and item delete buttons are easier to spot.

## How to Use

### 1. Choose Smithing Instructions
Select up to three smithing instructions from the provided options:
- **Punch**
- **Bend**
- **Upset**
- **Shrink**
- **Hit**
- **Draw**
- **None** (if fewer than three instructions are needed)

For each instruction, assign a priority (Last, Second Last, Third Last, Not Last, Any).

**Make sure that the instructions and their priorities are matching those of the in-game anvil GUI.**

### 2. Set Your Target Value
You can either:
- Paste a screenshot of the in-game anvil GUI (or a crop of just the ruler) into the target value paste area —
  the calculator will read the red arrow's position and fill in the value automatically, or
- Install a resource pack like [this one](https://www.curseforge.com/minecraft/texture-packs/tfc-tng-anvilgui-easy-smithing)
  to see the numeric target value directly in the anvil GUI, and enter it manually in the "Target Value" field.

### 3. Calculate
Click the "Calculate" button to generate the most efficient setup and final instructions. The results will be displayed below,
showing the necessary smithing actions as images.

The resulting actions that you need to perform in-game are divided into two sections:
- **Setup**: The initial setup actions that you need to perform to reach the _pre-target value_.
This is the value you need to reach before you can start performing the final actions which are dictated to you by the instructions.
The order of these actions is irrelevant.
- **Finally**: The final actions that you need to perform to reach the target value. After performing these actions in
the order shown on the calculator (left to right, top to bottom), you should have a perfectly forged item.

### 4. Save & Compare Recipes
Click "Save Recipe" on a result to store it under a name (and optionally a pasted custom icon) in the
"Recent Anvil Recipes" list at the top of the page. Click a saved recipe to view its full details, edit its name
or icon, or delete it. Use "View Chain" to select two saved recipes and compare them side by side.

### 5. Switch Between Light and Dark Modes
Use the toggle switch in the top right corner to switch between light and dark modes according to your preference.

## GitHub Pages Setup

This repository already includes a workflow (`.github/workflows/static.yml`) that deploys the site to GitHub Pages
automatically on every push to `main`. Since Pages settings aren't carried over to forks, you only need to enable
it once:

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the **Actions** tab) to trigger the first deployment.

Once deployed, the site will be available at `https://<your-username>.github.io/<your-repo-name>/src/index.html`.

## Support
If you encounter any issues or have suggestions for improvements regarding this fork,
feel free to open an issue on this [GitHub repository](https://github.com/owlyfans/tfg-anvil-calculator-extended/issues/new/choose).

For the original tool, credit and support go to [AdrianMiller99](https://github.com/AdrianMiller99) —
you can support them via [Ko-fi](https://ko-fi.com/adrianmiller99) or by starring the
[original repository](https://github.com/AdrianMiller99/tfg-anvil-calculator).

# License
This project is licensed under the European Union Public Licence (EUPL) 1.2. See the LICENSE file for details.
