// SVG card renderers for the profile page.
//
// Every card is a self-contained SVG in the somtripathi.dev design language.
// Colours are the site's own CSS custom properties, read from its stylesheet.
//
// Two constraints shape this file:
//   1. GitHub serves these from raw.githubusercontent.com without the camo proxy,
//      so <style> blocks and CSS animation survive intact (verified 2026-08-14).
//   2. Anchors inside an SVG loaded through <img> are inert, so no card carries a
//      link. Clickable content stays in the README markdown.

export const THEMES = {
  light: {
    paper: "#ffffff", surface: "#f3f3f3", ink: "#000000", muted: "#000000ad",
    line: "#0000001f", lineStrong: "#0000004d", accent: "#0b76cc",
    faint: "#00000073", live: "#0a7a46",
  },
  dark: {
    paper: "#000000", surface: "#1f1f1f", ink: "#ffffff", muted: "#ffffffb3",
    line: "#ffffff1f", lineStrong: "#ffffff40", accent: "#2f6bff",
    faint: "#ffffff6b", live: "#2ee58a",
  },
};

const MONO =
  "Hack, 'JetBrains Mono', 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace";
const DISP = "'Space Grotesk', 'Segoe UI', system-ui, -apple-system, sans-serif";

// Monospace advance width as a fraction of font size. Hack and its fallbacks are all 0.6.
const ADVANCE = 0.6;

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Truncate to fit a pixel budget at a given monospace size. */
export function fitMono(text, maxPx, size) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  const max = Math.floor(maxPx / (ADVANCE * size));
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(1, max - 1))}…`;
}

/** Terminal window chrome: rounded frame, title bar, three dots. */
function shell({ w, h, t, title, titleBar = true }) {
  const bar = titleBar
    ? `<rect x="1" y="1" width="${w - 2}" height="45" fill="${t.surface}"/>
    <rect x="1" y="45.5" width="${w - 2}" height="1" fill="${t.line}"/>
    <circle cx="26" cy="23.5" r="6" fill="${t.accent}"/>
    <circle cx="48" cy="23.5" r="6" fill="${t.live}"/>
    <circle cx="70" cy="23.5" r="6" fill="${t.faint}"/>
    <text class="m" x="${w / 2}" y="28" text-anchor="middle" font-size="12.5" letter-spacing="0.06em" fill="${t.faint}">${esc(title)}</text>`
    : "";
  return `<clipPath id="win"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12"/></clipPath>
  <g clip-path="url(#win)">
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="${t.paper}"/>
    ${bar}
  </g>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="none" stroke="${t.lineStrong}"/>`;
}

const doc = ({ w, h, label, style, body }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
  <style>
    .m { font-family: ${MONO}; }
    .d { font-family: ${DISP}; }
${style}
  </style>
${body}
</svg>
`;

// ---------------------------------------------------------------- hero

/**
 * The terminal panel: identity plus the newest merged upstream pull requests.
 *
 * Every element is drawn in its finished state. Animation only ever modulates
 * something already visible, and never reveals content.
 *
 * That rule is not stylistic. GitHub embeds this through <img>, and SVG animation
 * does not reliably run in that context: measured 2026-08-14 in Chrome, an identical
 * file animated under <object> while under <img> a CSS build stayed on its 0% keyframe
 * and a SMIL build stayed on its first value. Both rendered permanently blank. Any
 * reveal-style animation therefore risks showing a recruiter an empty box.
 */
export function hero({ theme, name, tagline, roles, merges }) {
  const t = THEMES[theme];
  const w = 880;
  const h = 400;
  const x = 34;

  const rowY = [274, 300, 326, 352];
  const rows = merges.slice(0, 4);

  // A selection bar that steps down the merge list. Frozen on the first row it
  // reads as a deliberate highlight, so a client that ignores SMIL loses nothing.
  const sweep = rows.length
    ? `<rect x="30" y="${rowY[0] - 18}" width="${w - 60}" height="26" rx="6" fill="${t.accent}" opacity="0.07">
    <animate attributeName="y" dur="7.2s" repeatCount="indefinite" calcMode="discrete"
      keyTimes="${rows.map((_, i) => (i / rows.length).toFixed(3)).join(";")}"
      values="${rows.map((_, i) => rowY[i] - 18).join(";")}"/>
  </rect>`
    : "";

  const mergeRows = rows
    .map(
      (pr, i) => `<text class="m" x="${x + 14}" y="${rowY[i]}" font-size="13" fill="${t.muted}">${esc(fitMono(pr.repo, 250, 13))}</text>
  <text class="m" x="${x + 282}" y="${rowY[i]}" font-size="13" fill="${t.faint}">#${pr.number}</text>
  <text class="m" x="${x + 366}" y="${rowY[i]}" font-size="13" fill="${t.ink}">${esc(fitMono(pr.title, 300, 13))}</text>
  <g opacity="1">
    <animate attributeName="opacity" dur="2.6s" begin="${(i * 0.35).toFixed(2)}s" repeatCount="indefinite" values="1;0.45;1"/>
    <rect x="${w - 108}" y="${rowY[i] - 12}" width="72" height="17" rx="8.5" fill="none" stroke="${t.live}"/>
    <text class="m" x="${w - 72}" y="${rowY[i]}" text-anchor="middle" font-size="10" letter-spacing="0.1em" fill="${t.live}">MERGED</text>
  </g>`,
    )
    .join("\n");

  const nodes = [
    `<text class="m" x="${x}" y="92" font-size="14.5" letter-spacing="0.02em"><tspan fill="${t.accent}">$</tspan><tspan fill="${t.ink}" font-weight="500"> whoami</tspan></text>`,
    `<text class="d" x="${x}" y="142" font-size="36" font-weight="700" letter-spacing="-0.02em" fill="${t.ink}">${esc(name)}</text>`,
    `<text class="m" x="${x + 1}" y="170" font-size="13.5" letter-spacing="0.09em" fill="${t.accent}">${esc(tagline)}</text>`,
    `<text class="m" x="${x + 1}" y="194" font-size="13" fill="${t.muted}">${esc(roles)}</text>`,
    `<text class="m" x="${x}" y="240" font-size="14.5" letter-spacing="0.02em"><tspan fill="${t.accent}">$</tspan><tspan fill="${t.ink}" font-weight="500"> gh pr list --author somtri --state merged</tspan></text>`,
    sweep,
    mergeRows,
  ];

  return doc({
    w,
    h,
    label: `Terminal. ${name}, ${tagline}. ${roles}. Latest merged pull requests: ${merges
      .slice(0, 4)
      .map((p) => `${p.repo} ${p.number}`)
      .join(", ")}.`,
    style: "",
    body: `${shell({ w, h, t, title: "somtri@github: ~" })}
${nodes.join("\n")}
  <text class="m" x="${x}" y="382" font-size="14.5" fill="${t.accent}">$</text>
  <rect x="${x + 14}" y="370.5" width="9" height="15" fill="${t.ink}">
    <animate attributeName="opacity" dur="1.1s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5" values="1;0"/>
  </rect>`,
  });
}

// ---------------------------------------------------------------- merge wall

/** Latest merged upstream pull requests, with the owner avatar for each repo. */
export function mergeWall({ theme, merges }) {
  const t = THEMES[theme];
  const w = 432;
  const h = 300;
  const rows = merges.slice(0, 5);

  const body = rows
    .map((pr, i) => {
      const y = 92 + i * 40;
      const avatar = pr.avatar
        ? `<clipPath id="a${i}"><circle cx="42" cy="${y - 4}" r="13"/></clipPath>
     <image clip-path="url(#a${i})" x="29" y="${y - 17}" width="26" height="26" href="${pr.avatar}"/>
     <circle cx="42" cy="${y - 4}" r="13" fill="none" stroke="${t.line}"/>`
        : `<circle cx="42" cy="${y - 4}" r="13" fill="none" stroke="${t.line}"/>`;
      return `${avatar}
  <text class="m" x="66" y="${y - 7}" font-size="12.5" font-weight="500" fill="${t.ink}">${esc(fitMono(pr.repoShort, 240, 12.5))}</text>
  <text class="m" x="66" y="${y + 9}" font-size="11" fill="${t.faint}">${esc(fitMono(pr.title, 250, 11))}</text>
  <text class="m" x="${w - 24}" y="${y - 7}" text-anchor="end" font-size="11" fill="${t.accent}">#${pr.number}</text>
  <text class="m" x="${w - 24}" y="${y + 9}" text-anchor="end" font-size="10" fill="${t.faint}">${esc(pr.date)}</text>`;
    })
    .join("\n");

  return doc({
    w,
    h,
    label: `Merged upstream pull requests: ${rows.map((p) => `${p.repoShort} ${p.number}`).join(", ")}.`,
    style: "",
    body: `${shell({ w, h, t, title: "merged upstream" })}
  <text class="m" x="29" y="70" font-size="11" letter-spacing="0.12em" fill="${t.faint}">LATEST MERGES</text>
${body}`,
  });
}

// ---------------------------------------------------------------- impact

/** Four headline numbers in a two by two grid. */
export function impact({ theme, stats }) {
  const t = THEMES[theme];
  const w = 432;
  const h = 300;

  const cells = stats.slice(0, 4).map((s, i) => {
    const cx = i % 2 === 0 ? 29 : 232;
    const cy = i < 2 ? 108 : 216;
    return `<text class="d" x="${cx}" y="${cy}" font-size="44" font-weight="700" letter-spacing="-0.03em" fill="${i === 0 ? t.live : t.ink}">${esc(s.value)}</text>
  <text class="m" x="${cx + 2}" y="${cy + 24}" font-size="11" letter-spacing="0.1em" fill="${t.faint}">${esc(s.label)}</text>`;
  });

  return doc({
    w,
    h,
    label: `Open source impact. ${stats.map((s) => `${s.value} ${s.label}`).join(", ")}.`,
    style: "",
    body: `${shell({ w, h, t, title: "impact --upstream" })}
  <rect x="216" y="72" width="1" height="180" fill="${t.line}"/>
  <rect x="29" y="162" width="374" height="1" fill="${t.line}"/>
${cells.join("\n")}`,
  });
}

// ---------------------------------------------------------------- languages

const LANG_COLOR = {
  "C++": "#f34b7d", Python: "#3572A5", Rust: "#dea584", TypeScript: "#3178c6",
  C: "#555555", R: "#198CE7", HTML: "#e34c26", "Jupyter Notebook": "#DA5B0B",
  JavaScript: "#f1e05a", CMake: "#DA3434", Shell: "#89e051", CSS: "#663399",
  Makefile: "#427819", Dockerfile: "#384d54",
};

/** Stacked bar of language bytes across the owner's non-fork repositories. */
export function languages({ theme, langs }) {
  const t = THEMES[theme];
  const w = 880;
  const h = 150;
  const barX = 34;
  const barW = w - 68;
  const total = langs.reduce((sum, l) => sum + l.bytes, 0) || 1;

  let cursor = barX;
  const segments = langs.map((l) => {
    const seg = Math.max(2, (l.bytes / total) * barW);
    const rect = `<rect x="${cursor.toFixed(1)}" y="76" width="${seg.toFixed(1)}" height="14" fill="${LANG_COLOR[l.name] ?? t.faint}"/>`;
    cursor += seg;
    return rect;
  });

  const legend = langs.map((l, i) => {
    const lx = barX + (i % 5) * 166;
    const ly = 118 + Math.floor(i / 5) * 22;
    const share = ((l.bytes / total) * 100).toFixed(1);
    return `<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${LANG_COLOR[l.name] ?? t.faint}"/>
  <text class="m" x="${lx + 17}" y="${ly}" font-size="11.5" fill="${t.muted}">${esc(fitMono(l.name, 96, 11.5))} <tspan fill="${t.faint}">${share}%</tspan></text>`;
  });

  return doc({
    w,
    h,
    label: `Language distribution: ${langs.map((l) => `${l.name} ${((l.bytes / total) * 100).toFixed(1)} percent`).join(", ")}.`,
    style: "",
    body: `${shell({ w, h, t, title: "cat stack.txt", titleBar: false })}
  <text class="m" x="${barX}" y="46" font-size="11" letter-spacing="0.12em" fill="${t.faint}">PROGRAMMING LANGUAGES BY BYTES, ACROSS ORIGINAL REPOSITORIES &#183; MARKUP EXCLUDED</text>
  <clipPath id="bar"><rect x="${barX}" y="76" width="${barW}" height="14" rx="7"/></clipPath>
  <g clip-path="url(#bar)">${segments.join("")}</g>
${legend.join("\n")}`,
  });
}
