# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static web tool (no build step, no package manager, no dependencies) that calculates the
optimal sequence of anvil smithing actions for the TerraFirmaGreg Minecraft modpack. Given up to three
required final instructions (with priorities) and a target value, it computes:
1. **Setup actions** (any order) to reach a pre-target value
2. **Final actions** (exact order) to hit the target value while satisfying the instruction priorities

Live version is deployed via GitHub Pages at the URL in README.md.

## Running/testing locally

There is no build tooling. Just open `src/index.html` directly in a browser, or serve the repo root with
any static file server (paths in `src/index.html`/`script.js` reference `../res/...`, so `src/` must stay
a sibling of `res/`). There are no automated tests or linters configured.

## Deployment

`.github/workflows/static.yml` deploys the entire repository as-is to GitHub Pages on every push to `main`
(no build/compile step — raw files are uploaded).

## Architecture

Three files in `src/`, all vanilla JS/CSS/HTML, no framework:

- **`index.html`** — three `.instruction-set` blocks (icon + priority `<select>`), a target-value input,
  a result card, and an action-selection popup (`#action-popup`) shared by all three instruction sets.
- **`script.js`** — all logic lives in a single `DOMContentLoaded`/top-level script, structured around the
  click handler on `#calculate-button`:
  - **Action values** (`actions` object in the click handler): `punch: 2, bend: 7, upset: 13, shrink: 16,
    hit1: -3, hit2: -6, hit3: -9, draw: -15`. `hit` is a placeholder the user picks in the UI; it gets
    resolved to `hit1`/`hit2`/`hit3` per-instruction via `selectBestHit`, based on which hit size reaches
    the running target most efficiently.
  - **`calculateSetupActions`**: first resolves `hit` → `hit1/2/3` for every instruction and sums their
    values to get the "pre-target value" the setup phase must reach. Then runs a coin-change-style DP
    (`dp[value] = min actions to reach value`, forward-filled over `actions`) to find the minimum number
    of unordered setup actions summing to that pre-target value, then backtracks through `dp` to recover
    the actual action sequence.
  - **`sortInstructions`**: orders the (already-chosen) final instructions by priority into
    `third-last, second-last, not-last, last`, then splices `any`-priority instructions into a computed
    insertion point (before `last`+`second-last` if both present, else before `last`, else at the end).
  - Icon selection: `setupInstructionListener` wires each `.instruction-set`'s icon to open the shared
    `#action-popup` positioned under the clicked icon; picking a popup icon copies its image/`data-action`
    onto the instruction icon and closes the popup.
  - Result rendering: `createActionImage` builds a wrapper `<div>` per action for `#setup-actions` /
    `#final-actions`. Note `hit1/hit2/hit3` are separate image assets in `res/` but share the "Hit" tooltip
    label (stripped via `action.replace(/\d+$/, '')` in `createActionImage`, hardcoded per-name in
    `applyTooltipToIcon`).
  - Dark/light mode is persisted to `localStorage` (`darkMode` key, defaults to dark) and toggled via a
    checkbox; `updateGitHubIconColor` keeps the header GitHub icon in sync with the theme.
- **`styles.css`** — theme via `body.dark-mode` / `body.light-mode` class toggling (no CSS variables/media
  queries for theme); action icon colors are documented in `color-ref.txt` at repo root for reference when
  adding/editing `res/*.png` action icons.

## Key domain logic to preserve when editing

- **Do not alter the calculation logic** — the action point values (`actions` object), `selectBestHit`,
  `calculateSetupActions` (including its DP), and `sortInstructions` priority-ordering rules are considered
  correct and already matched to the in-game anvil GUI's behavior. Do not change values, formulas, DP
  transitions, or ordering rules as a side effect of unrelated work (UI, styling, refactors, etc.). Only
  touch this logic if the user explicitly asks for a calculation change.
- Action point values and the setup-phase DP in `calculateSetupActions` are the core "calculator" logic —
  changes here directly affect correctness of results shown to users.
- Priority ordering semantics (`last` > `second-last` > `third-last` > `not-last`, with `any` slotted in
  relative to `last`/`second-last`) must match the in-game anvil GUI's interpretation, per README.md.
