# Obsidian Design System

A token-first design system for **Obsidian**, the local-first knowledge-management
app where people build a "second brain." This system captures Obsidian's dark-first,
power-user aesthetic: a deep canvas, a single signature purple accent, the native
system font stack, and the chrome vocabulary of a serious text editor crossed with a
local database — file tree, tabbed editor, command palette, and the force-directed
graph view.

> **Scope of this build.** Per the kickoff, this system currently ships **tokens +
> foundations + specimen cards** only. There are no reusable React components or
> product UI kits yet — see *Next steps* at the bottom. Everything here is driven by
> the `<design-context>` spec supplied at kickoff.

---

## Sources & provenance

- **Design spec:** the `Obsidian` design-context (`version: alpha`) provided at
  project kickoff — the authoritative source for every color, type, spacing, radius,
  shadow, and motion value in this system.
- **GitHub repo attached:** `gerard-d-kelly/tbb-website`
  (<https://github.com/gerard-d-kelly/tbb-website>) — **this repository is empty
  (no commits)** and is unrelated to Obsidian (its name implies a CrossFit "TBB"
  website). Nothing was imported from it. It is recorded here only for traceability;
  if a populated repo becomes available, re-attach it and we can lift real assets.

> ⚠️ **Brand-vs-spec mismatch (resolved with the user).** The kickoff brief named the
> company "CrossFit TBB," but the attached design-context fully described **Obsidian**.
> The user confirmed we should build the **Obsidian** system. If that was wrong, stop
> and re-scope before building further.

---

## Brand at a glance

Obsidian is for serious knowledge workers who spend long hours writing and thinking.
Every decision flows from that: dark by default (less eye strain, signals "deep work,
not quick tasks"), local and Markdown (you own your files), and extensible through
CSS variables (the theme/plugin community is a growth engine). The graph view is the
emotional peak of the product — the moment a user sees their whole vault as a living
network.

- **Dark-only default** as a philosophical stance.
- **Purple links** (`#9580FF`) are the visualization of intellectual connection — not
  decoration. Link density is how vault quality is measured.
- **System fonts** for maximum native feel — you're working in your OS, not "inside
  software."
- **Keyboard-first, near-instant** interactions throughout.

---

## CONTENT FUNDAMENTALS

How Obsidian writes — useful when authoring UI copy, empty states, docs, and marketing.

- **Voice: calm, technical, ownership-forward.** The throughline is *your* data, *your*
  vault, *locally yours*. Copy reassures rather than hypes.
- **Person: "you" / "your."** Address the user directly ("your notes," "your vault,"
  "your second brain"). Avoid first-person product voice ("we think…").
- **Casing: sentence case everywhere** — buttons, menus, headings, settings labels.
  Not Title Case. e.g. "Open another vault", "Reveal current file in navigation".
- **Tone: precise and unembellished.** Prefer the plain verb: *Open, Create, Link,
  Reveal, Move, Search, Toggle*. Command-palette actions read as `Verb + object`
  ("Insert template", "Open graph view", "Toggle reading view").
- **Vocabulary is product-specific and consistent:** *vault, note, backlink, outgoing
  link, WikiLink (`[[…]]`), tag (`#…`), callout, canvas, pane, command palette, quick
  switcher, graph view, orphan note*. Use these exact terms.
- **Markdown is the native idiom.** Examples and docs are written in Markdown; show
  real syntax (`[[Note]]`, `#tag`, `> [!note]`) rather than describing it abstractly.
- **No emoji in product chrome.** Obsidian's UI does not use emoji as decoration or
  iconography. (Users may type emoji into their own notes — that's content, not UI.)
- **Numbers/metadata are quiet and factual:** "14 backlinks", "modified 2m ago",
  "1,204 notes · 3,890 links". Set in muted ink, never as celebratory stats.
- **Vibe:** a competent, private workshop. Confident but not loud; helpful but never
  chatty. Examples: *"No backlinks found."* / *"This note has no links yet."* /
  *"Create new note"* / *"Search or create…"*.

---

## VISUAL FOUNDATIONS

- **Color:** Monochromatic dark base (`#202020` canvas → `#2A2A2A` → `#303030`
  surfaces, `#3D3D3D` borders) with a **single purple accent** carrying nearly all
  brand color. `#7C3AED` for active nodes / selection / tags / filled buttons;
  `#9580FF` (lighter) for the interactive ink of links. Ink is **soft white
  `#DCDCDC`, never pure `#fff`** — gentler over long sessions. Semantic callout
  accents (info/success/warning/danger) are used sparingly inside notes only.
- **Type:** **Native system stack** (`-apple-system, BlinkMacSystemFont, "Segoe UI"…`)
  for both UI and editor body — a deliberate non-choice that makes the app feel like
  part of the OS. **Fira Code** monospace for Markdown source and code blocks. Body is
  generous: **16px / 1.7 line-height**, content measured to a **700px** column.
  Headings get a size step-down (28→14) with a bold-weight boost. Display is 32/700
  with -0.01em tracking.
- **Spacing:** 8px base, scale `4 8 12 16 24 32 48 64`. Dense, information-rich layout
  — Obsidian fits a lot on screen (28px file-tree rows, 32px tabs) but keeps the
  reading column airy.
- **Backgrounds:** Flat dark fills — **no gradients, no imagery, no textures or
  patterns** in product chrome. The graph view's canvas is the one "scenic" surface,
  and it's still just nodes + edges on the canvas color. (The placeholder wordmark in
  this kit uses a gradient *only* as a stand-in; the real brand chrome is flat.)
- **Corner radii:** Modest. 4px inputs/tags, 8px cards/buttons/popovers, 12px
  modals/command palette, pill for toggles/chips. Nothing very round.
- **Cards & surfaces:** A "card" is a raised flat surface (`--surface-1`/`-2`) with a
  1px `#3D3D3D` border and, when floating, a deep shadow. **Elevation is carried by
  shadow + a subtly lighter fill**, since there's no light on a dark canvas to catch a
  highlight. `--shadow-card` → `--shadow-elevated` → `--shadow-modal` deepen in blur
  and opacity (0.4 → 0.6).
- **Borders:** 1px, `#3D3D3D`, used freely as seams between panes, tabs, rows, and
  around inputs. Borders — not shadows — do most of the structural separation in
  docked chrome.
- **Transparency & blur:** Used lightly. Tag pills tint the accent at ~16% over the
  canvas (`color-mix`). Hover rows lift to the next surface step rather than going
  translucent. No heavy glassmorphism.
- **Hover states:** Surfaces step **lighter** (row → `--surface-2`); the primary
  purple steps **darker** to `--ob-purple-hover` (`#6D28D9`); links step **lighter**
  to `#B4A0FF`. Link hover also triggers a **preview popover** that slides in.
- **Press / active:** Selected/active elements adopt the purple accent (active graph
  node, selected file row, active tab). No bouncy scale transforms — feedback is
  color and immediacy.
- **Motion:** **Near-instant.** 80ms for hovers/previews/micro-feedback, 150ms for
  panel reveals and the command palette, all on `cubic-bezier(0.4, 0, 0.2, 1)`. The
  graph view is the exception: a continuous force/physics simulation (nodes
  repel/attract). Everything is gated behind `prefers-reduced-motion: reduce`, which
  zeroes the durations.
- **Focus:** A `2px` solid `#9580FF` outline at `2px` offset (5.3:1 on canvas) — the
  link color doubling as the focus color.
- **Imagery vibe:** Essentially none in chrome. Where imagery appears (community
  themes, marketing) it skews cool, dark, and high-contrast to match the canvas.

### Accessibility (from spec)

- Body ink `#DCDCDC` on `#202020` = **11.9:1** (AAA). Muted `#888888` = **4.6:1**
  (AA — do not dim further).
- **Purple primary `#7C3AED` is only 2.9:1 on canvas — fails AA.** Use it for large
  text (18px+), icons, decorative graph nodes, and *filled* surfaces (white-on-purple)
  only. Never as the sole color for normal-weight body text.
- Link `#9580FF` = **5.3:1** (AA) — fine for interactive text, not for maximum-legibility body copy.
- Touch/hit targets **44×44px** minimum. Focus ring as above.
- Graph edges (`#444444`) and borders (`#3D3D3D`) are decorative — never rely on them to carry text/label meaning.

---

## ICONOGRAPHY

Obsidian's product icons come from the open-source **[Lucide](https://lucide.dev)**
icon set — the same library Obsidian ships and exposes to plugin authors. They are
**stroke icons** (consistent ~2px stroke, 24×24 grid, round caps/joins), rendered in
the current ink color and tinted to the purple accent only when active.

- **Use Lucide for all UI icons.** Pull individual SVGs from Lucide, or load via CDN
  (`https://unpkg.com/lucide@latest`). The callout specimen card in this kit uses
  inline Lucide-style paths (info, alert-triangle) as a demonstration of the stroke
  weight and grid.
- **Style:** outline/stroke, not filled; no duotone; no rounded "bubbly" icons. Match
  Lucide's 2px stroke and 24px viewBox if you ever add a custom glyph.
- **No emoji in chrome.** Emoji and Unicode symbols are *content* a user might type
  into a note, never part of the interface.
- **Brand mark:** Obsidian's real logo is a faceted purple gemstone — it is the
  company's trademark and is **not reproduced here**. `guidelines/brand-wordmark.card.html`
  shows a clearly-labeled *placeholder* lockup built from the type system. If you have
  rights to the official mark, drop the SVG into `assets/` and swap it in.

> **Substitution flags for the user:**
> 1. **Fonts** — UI/body intentionally use the OS system stack (no webfont needed).
>    The mono face is **Fira Code loaded from Google Fonts** (not a vendored binary).
>    If you need offline/self-hosted fonts, send the `.woff2` files and I'll vendor them.
> 2. **Icons** — documented as **Lucide** (Obsidian's actual icon set). No icon binaries
>    were importable (empty repo), so usage is via CDN/inline. Confirm or send a sprite
>    and I'll vendor it into `assets/`.
> 3. **Logo** — placeholder only; needs the official mark (or confirmation to keep a
>    generic wordmark).

---

## Index / manifest

Root entry point consumers link: **`styles.css`** (a list of `@import`s only).

```
styles.css                      → imports every token + font file below
tokens/
  fonts.css                     @font-face / Fira Code (Google Fonts); system stack rationale
  colors.css                    palette ramp + semantic aliases
  typography.css                families, weights, heading scale, roles, leading, tracking
  spacing.css                   spacing scale, radius, layout constants
  effects.css                   shadows, motion (duration/easing), focus ring
guidelines/                     specimen cards shown in the Design System tab
  colors-*.card.html            primary · links · surfaces · ink · graph · callouts
  type-*.card.html              display · headings · body · ui · mono · families
  spacing-*.card.html           scale · radius · shadows · motion · layout
  brand-*.card.html             wordmark · wikilinks · callout · focus
assets/                         (empty — awaiting real logo/icon binaries)
README.md                       this file
SKILL.md                        Agent-Skills front-matter for download/reuse
```

**Token namespace (for any future component cards):** `window.ObsidianDesignSystem_de9ee1`.

### Next steps (not yet built)

- **Reusable components** — Button, IconButton, Input, Select, Checkbox, Switch, Card,
  Badge, Tag, Tabs, Dialog/Modal, Command palette, Tooltip, Callout.
- **UI kit** — full-screen recreations: editor with file tree + tabs + backlinks panel,
  graph view, command palette / quick switcher, settings.

Say the word and I'll build either. To make UI kits high-fidelity I'll want a real
source (a populated repo or Figma) — the current repo is empty.
