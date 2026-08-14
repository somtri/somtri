// Rewrites the auto-generated blocks in README.md from public GitHub data.
// Called by .github/workflows/profile.yml through actions/github-script.
//
// Two blocks:
//   OSS       : merged pull requests in repositories this account does not own.
//   ACTIVITY  : the most recent authored commits.
//
// Design notes:
//   - Uses the search API, not the events API. Verified 2026-08-14: the events
//     PushEvent payload no longer carries a commit list, so it cannot supply messages.
//   - Merge commits are dropped. They describe the merge, not the work.
//   - On failure it leaves README.md untouched, so a broken run goes stale, never blank.
//   - Reads only public data, so the default GITHUB_TOKEN is enough.

import { readFileSync, writeFileSync } from "node:fs";

const MAX_PRS = 6;
const MAX_PRS_PER_REPO = 2;
const MAX_COMMITS = 5;
const REPO_COL = 26;
const TITLE_COL = 42;
const MSG_COL = 48;
const SHORT_REPO_COL = 15;

function relativeAge(iso, now) {
  const mins = Math.max(0, Math.round((now - new Date(iso)) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

function fit(text, width) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= width) return clean.padEnd(width);
  return `${clean.slice(0, width - 1)}…`;
}

function replaceBlock(readme, name, body, core) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  const startAt = readme.indexOf(start);
  const endAt = readme.indexOf(end);
  if (startAt === -1 || endAt === -1) {
    core.setFailed(`Missing ${start} / ${end} markers in README.md`);
    return null;
  }
  const block = ["```", body, "```"].join("\n");
  return readme.slice(0, startAt + start.length) + `\n\n${block}\n\n` + readme.slice(endAt);
}

const repoOf = (item) => item.repository_url.replace(/.*\/repos\//, "");

export default async function update({ github, context, core }) {
  const owner = context.repo.owner;
  const now = Date.now();

  // ---- OSS block: merged pull requests in repositories this account does not own.
  const merged = await github.rest.search.issuesAndPullRequests({
    q: `author:${owner} type:pr is:merged`,
    sort: "updated",
    order: "desc",
    per_page: 100,
  });
  const open = await github.rest.search.issuesAndPullRequests({
    q: `author:${owner} type:pr is:open`,
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  const notMine = (item) => !repoOf(item).startsWith(`${owner}/`);
  const mergedUp = merged.data.items.filter(notMine);
  const openUp = open.data.items.filter(notMine);
  const repoCount = new Set([...mergedUp, ...openUp].map(repoOf)).size;

  // Cap rows per repository, or one busy day in a single repo fills the whole list.
  const usedPerRepo = new Map();
  const prRows = [];
  for (const pr of mergedUp
    .slice()
    .sort((a, b) => new Date(b.closed_at) - new Date(a.closed_at))) {
    const repo = repoOf(pr);
    const used = usedPerRepo.get(repo) ?? 0;
    if (used >= MAX_PRS_PER_REPO) continue;
    usedPerRepo.set(repo, used + 1);
    prRows.push(
      `${fit(repo, REPO_COL)}  #${String(pr.number).padEnd(7)}  ` +
        `${fit(pr.title, TITLE_COL)}  ${pr.closed_at.slice(0, 10)}`,
    );
    if (prRows.length >= MAX_PRS) break;
  }

  const summary =
    `${mergedUp.length} merged  ·  ${openUp.length} open  ·  ${repoCount} upstream repositories`;
  const ossBody = prRows.length
    ? [summary, "", ...prRows].join("\n")
    : summary;

  // ---- ACTIVITY block: most recent authored commits, merge commits excluded.
  const commits = await github.rest.search.commits({
    q: `author:${owner}`,
    sort: "author-date",
    order: "desc",
    per_page: 40,
  });

  const commitRows = [];
  for (const item of commits.data.items) {
    const subject = item.commit.message.split("\n")[0];
    if (/^Merge (branch|pull request|remote)/i.test(subject)) continue;
    commitRows.push(
      `${item.sha.slice(0, 7)}  ${fit(item.repository.name, SHORT_REPO_COL)}  ` +
        `${fit(subject, MSG_COL)}  ${relativeAge(item.commit.author.date, now)}`,
    );
    if (commitRows.length >= MAX_COMMITS) break;
  }

  const activityBody = commitRows.length
    ? commitRows.join("\n")
    : "no public commits indexed in the last 90 days";

  // ---- Write both blocks.
  let readme = readFileSync("README.md", "utf8");
  const original = readme;

  readme = replaceBlock(readme, "OSS", ossBody, core);
  if (readme === null) return;
  readme = replaceBlock(readme, "ACTIVITY", activityBody, core);
  if (readme === null) return;

  if (readme === original) {
    core.info("Both blocks already current.");
    return;
  }

  writeFileSync("README.md", readme);
  core.info(
    `Rewrote OSS (${prRows.length} rows, ${mergedUp.length} merged) ` +
      `and ACTIVITY (${commitRows.length} rows).`,
  );
}
