// Regenerates every SVG card in assets/ from live public GitHub data.
// Called by .github/workflows/profile.yml through actions/github-script.
//
// Writes 4 cards x 2 themes. The workflow commits only what actually changed,
// so a day with no new activity produces no commit.
//
// Reads public data only, so the default GITHUB_TOKEN is enough.

import { writeFileSync, mkdirSync } from "node:fs";
import { hero, mergeWall, impact, languages, contributions } from "./cards.mjs";

// The contribution calendar exists only in GraphQL. The total covers work in private
// repositories once the account switches on "Private contribution counts", and GitHub
// anonymises that work first: a number for the day, never a repository or a message.
// restrictedContributionsCount is how a repo-scoped token detects the setting, because
// it counts only the contributions this viewer is not allowed to look at directly.
const CALENDAR_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount weekday } }
        }
      }
    }
  }`;

const NAME = "som tripathi";
const TAGLINE = "software · ai · quant · research";
const ROLES = "computer vision @ AIIRA  ·  agent memory @ TAIC  ·  iowa state university";

// Markup and data formats are excluded from the language chart. Without this,
// one knitted R Markdown report in macro_markets_ml (1.25 MB of generated HTML,
// measured 2026-08-14) outweighs every hand-written language combined.
const MARKUP = new Set([
  "HTML", "CSS", "SCSS", "Sass", "Less", "Markdown", "TeX", "XML",
  "JSON", "YAML", "Roff", "SVG", "Vim Snippet",
]);

const repoOf = (item) => item.repository_url.replace(/.*\/repos\//, "");
const shortRepo = (full) => (full.length > 26 ? full.split("/")[1] : full);

function compact(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

/** Fetch an avatar and inline it as a data URI. SVG in <img> cannot load remote hrefs. */
async function avatarDataUri(url, core) {
  try {
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}s=48`);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/png";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 60_000) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch (error) {
    core.info(`avatar fetch failed for ${url}: ${error.message}`);
    return null;
  }
}

export default async function build({ github, context, core }) {
  const owner = context.repo.owner;

  // ---- merged and open pull requests in repositories this account does not own.
  const search = async (q) =>
    (
      await github.rest.search.issuesAndPullRequests({
        q,
        sort: "updated",
        order: "desc",
        per_page: 100,
      })
    ).data.items;

  const notMine = (item) => !repoOf(item).startsWith(`${owner}/`);
  const mergedUp = (await search(`author:${owner} type:pr is:merged`)).filter(notMine);
  const openUp = (await search(`author:${owner} type:pr is:open`)).filter(notMine);
  core.info(`${mergedUp.length} merged upstream, ${openUp.length} open upstream.`);

  // ---- stars and avatars for every upstream repository touched.
  const upstreamNames = [...new Set([...mergedUp, ...openUp].map(repoOf))];
  // Private repositories are dropped here, not merely left unrendered. A token with
  // broader scope than the workflow's (a maintainer running this locally) would
  // otherwise publish private repository names and pull request titles onto a public page.
  const meta = new Map();
  let stars = 0;
  for (const full of upstreamNames) {
    const [o, r] = full.split("/");
    try {
      const { data } = await github.rest.repos.get({ owner: o, repo: r });
      if (data.private) {
        core.info(`excluding private repo ${full}`);
        continue;
      }
      meta.set(full, { stars: data.stargazers_count, avatar: data.owner.avatar_url });
      stars += data.stargazers_count;
    } catch (error) {
      core.info(`skipping ${full}: ${error.status ?? error.message}`);
    }
  }
  const isPublic = (item) => meta.has(repoOf(item));
  const mergedPublic = mergedUp.filter(isPublic);
  const openPublic = openUp.filter(isPublic);
  core.info(
    `${meta.size} public upstream repos, ${stars} combined stars; ` +
      `${mergedPublic.length} merged / ${openPublic.length} open after the private filter.`,
  );

  // ---- newest merges first, at most two per repository so one busy day cannot fill it.
  const perRepo = new Map();
  const merges = [];
  for (const pr of mergedPublic
    .slice()
    .sort((a, b) => new Date(b.closed_at) - new Date(a.closed_at))) {
    const full = repoOf(pr);
    const used = perRepo.get(full) ?? 0;
    if (used >= 2) continue;
    perRepo.set(full, used + 1);
    merges.push({
      repo: full,
      repoShort: shortRepo(full),
      number: pr.number,
      title: pr.title,
      date: pr.closed_at.slice(0, 10),
      avatarUrl: meta.get(full)?.avatar ?? null,
    });
    if (merges.length >= 5) break;
  }

  for (const m of merges) {
    m.avatar = m.avatarUrl ? await avatarDataUri(m.avatarUrl, core) : null;
  }

  // ---- language bytes across original repositories.
  const repos = await github.paginate(
    github.rest.repos.listForUser,
    { username: owner, per_page: 100, type: "owner" },
    (response) => response.data,
  );
  const totals = new Map();
  for (const repo of repos.filter((r) => !r.fork)) {
    try {
      const { data } = await github.rest.repos.listLanguages({ owner, repo: repo.name });
      for (const [lang, bytes] of Object.entries(data)) {
        if (MARKUP.has(lang)) continue;
        totals.set(lang, (totals.get(lang) ?? 0) + bytes);
      }
    } catch (error) {
      core.info(`languages unavailable for ${repo.name}: ${error.status ?? error.message}`);
    }
  }
  const langs = [...totals.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
  core.info(`languages: ${langs.map((l) => l.name).join(", ")}`);

  // ---- contribution calendar and streaks.
  let calendar = null;
  try {
    const res = await github.graphql(CALENDAR_QUERY, { login: owner });
    const cal = res.user.contributionsCollection.contributionCalendar;
    const restricted = res.user.contributionsCollection.restrictedContributionsCount;
    const weeks = cal.weeks.map((wk) =>
      wk.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        weekday: d.weekday,
      })),
    );
    const days = weeks.flat();

    let longest = 0;
    let run = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      if (run > longest) longest = run;
    }

    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current += 1;
      else if (i === days.length - 1) continue; // a quiet today does not end a live streak
      else break;
    }

    calendar = { weeks, total: cal.totalContributions, current, longest, restricted };
    core.info(
      `calendar: ${cal.totalContributions} contributions ` +
        `(${restricted} of them anonymised from private repos), ` +
        `current streak ${current}, longest ${longest}, ${days.length} days.`,
    );
  } catch (error) {
    core.info(`Contribution calendar unavailable, keeping the previous card: ${error.message}`);
  }

  const stats = [
    { value: String(mergedPublic.length), label: "MERGED UPSTREAM" },
    { value: String(openPublic.length), label: "OPEN PULL REQUESTS" },
    { value: String(meta.size), label: "UPSTREAM REPOS" },
    // Rounded to the nearest 5k. The combined figure across 14 upstream repos moves
    // every few hours, so an exact count rewrote this card - and committed it - on
    // almost every scheduled run while telling the reader nothing new. The exact
    // number is still logged above.
    { value: compact(Math.round(stars / 5000) * 5000), label: "STARS REACHED" },
  ];

  // ---- render.
  mkdirSync("assets", { recursive: true });
  let written = 0;
  for (const theme of ["light", "dark"]) {
    const cards = {
      hero: hero({ theme, name: NAME, tagline: TAGLINE, roles: ROLES, merges }),
      merges: mergeWall({ theme, merges }),
      impact: impact({ theme, stats }),
      languages: languages({ theme, langs }),
    };
    // Omitted when the calendar query failed, so the previous card survives untouched.
    if (calendar) cards.contributions = contributions({ theme, ...calendar });
    for (const [key, svg] of Object.entries(cards)) {
      writeFileSync(`assets/${key}-${theme}.svg`, svg);
      written += 1;
    }
  }
  core.info(`Wrote ${written} SVG files.`);
}
