<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/hero-light.svg">
  <img alt="Terminal replay: som tripathi, software, ai, quant and research, with the latest merged upstream pull requests" src="https://raw.githubusercontent.com/somtri/somtri/main/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="https://somtripathi.dev/"><b>somtripathi.dev</b></a> &nbsp;·&nbsp;
  <a href="https://linkedin.com/in/somtri">linkedin</a> &nbsp;·&nbsp;
  <a href="mailto:somtri@iastate.edu">somtri@iastate.edu</a> &nbsp;·&nbsp;
  ames, ia
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/merges-dark.svg">
    <img alt="Latest merged upstream pull requests" src="https://raw.githubusercontent.com/somtri/somtri/main/assets/merges-light.svg" width="48%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/impact-dark.svg">
    <img alt="Open source impact numbers" src="https://raw.githubusercontent.com/somtri/somtri/main/assets/impact-light.svg" width="48%">
  </picture>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/languages-dark.svg">
  <img alt="Language distribution by bytes across original repositories" src="https://raw.githubusercontent.com/somtri/somtri/main/assets/languages-light.svg" width="100%">
</picture>

---

### `$ cat about.md`

Software engineering student at Iowa State. Most of what I build is the kind of thing where checking the result is harder than producing it.

An order book engine will report whatever latency you want until you make it replay a real tape and match. A forecast looks excellent right up until you validate it in chronological order. So most of my time goes into the checking, which is slower and much less fun to demo.

The upstream patches above are mostly the unglamorous version of the same instinct: an index that overflows past 2^31, a shape check that runs after the crash instead of before it.

### `$ ls -1 work/`

| project | what it is | what it measured |
|---|---|---|
| **[impact-lab](https://github.com/somtri/impact-lab)** · `C++20` | Limit order book engine and a pre-registered aggregate price-impact study. [Live demo](https://somtri.github.io/impact-lab/). | 1.97B Binance futures trades · concave impact γ = 0.760, CI [0.740, 0.782] · 100.0000% book-reconstruction match · 4.06M msg/sec, p50 101 ns |
| **[flashbulb-amd](https://github.com/somtri/flashbulb-amd)** · `Python` | Self-hostable agent memory. A neural surprise gate decides what to keep, so the write path spends no LLM tokens and no data leaves the machine. [Live demo](https://somtri--flashbulb-amd-web.modal.run/). | 0 write-path tokens over 30 turns, against 2,055 for an LLM-extract baseline · ~5 ms per decision against ~400 ms · runs end to end on one AMD MI300X |
| **[flashbulb-qwen](https://github.com/somtri/flashbulb-qwen)** · `Python` | Drift-adaptive, zero-write-token memory for a Qwen agent. Qwen Cloud Hackathon, Track 1. | +0.35 clean recall under drift, against the prior state of the art |
| **[run_scope](https://github.com/somtri/run_scope)** · `Rust` | Real-time experimental process monitoring: WebSockets, React, anomaly detection, SQLite run history. | Live telemetry with persisted, replayable run history |
| **[smart_signal](https://github.com/somtri/smart_signal)** · `Python` | Stock movement forecasting with chronological validation, random forest modeling, and sentiment features. | Leakage-aware: validation runs in chronological order, so nothing looks ahead |
| **[portfolio](https://github.com/somtri/portfolio)** · `TypeScript` | The site this page borrows its face from. Next.js, statically generated, one API route. | [somtripathi.dev](https://somtripathi.dev/) |

<details>
<summary><code>$ ls -1 work/ --all</code></summary>

<br>

| project | what it is |
|---|---|
| **[macro_markets_ml](https://github.com/somtri/macro_markets_ml)** · `R` | Release-aware analysis of macro signals against next-month S&P 500 direction. [Report](https://somtri.github.io/macro_markets_ml/). |
| **[cine_ml](https://github.com/somtri/cine_ml)** · `Jupyter` | Movie rating regression on TMDB metadata and OMDb labels, with a Streamlit dashboard. |
| **[poke327](https://github.com/somtri/poke327)** · `C/C++` | Terminal monster-catching RPG in ncurses: procedural generation, pathfinding, turn-based battles. |

</details>

### `$ ls -1 research/`

```
2026-06 → now       computer vision research intern   AIIRA (AI Institute for Resilient Agriculture)
2025-08 → now       ml research intern                Translational AI Center, Iowa State
2025-10 → 2026-05   teaching assistant                Iowa State University
2025-01 → 2025-07   research assistant                Iowa State University
```

### `$ cat tools.txt`

```
ml         PyTorch  ·  titans-pytorch  ·  scikit-learn  ·  sentence-transformers
data       pandas  ·  numpy  ·  SQLite  ·  embeddings  ·  yfinance
build      CMake  ·  WebAssembly  ·  ncurses  ·  Playwright
serving    FastAPI  ·  uvicorn  ·  Modal  ·  ROCm  ·  MCP
web        Next.js  ·  React  ·  Streamlit  ·  plotly
```

### `$ contact --list`

```
web        https://somtripathi.dev
email      somtri@iastate.edu
linkedin   https://linkedin.com/in/somtri
location   ames, ia  ·  42.026°N 93.646°W
```

<sub>Every panel above is an SVG regenerated nightly from public GitHub data by <a href="scripts/build-profile.mjs">scripts/build-profile.mjs</a>. The workflow runs on GitHub's own actions only.</sub>
