<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/somtri/somtri/main/assets/header-light.svg">
  <img alt="som tripathi, software, ai, quant and research" src="https://raw.githubusercontent.com/somtri/somtri/main/assets/header-light.svg" width="100%">
</picture>

<p align="center">
  <a href="https://somtripathi.dev/"><b>somtripathi.dev</b></a> &nbsp;·&nbsp;
  <a href="https://linkedin.com/in/somtri">linkedin</a> &nbsp;·&nbsp;
  <a href="mailto:somtri@iastate.edu">somtri@iastate.edu</a> &nbsp;·&nbsp;
  ames, ia
</p>

---

### `$ cat about.md`

Software engineering student at Iowa State. Most of what I build is the kind of thing where checking the result is harder than producing it.

An order book engine will report whatever latency you want until you make it replay a real tape and match. A forecast looks excellent right up until you validate it in chronological order. So most of my time goes into the checking, which is slower and much less fun to demo.

Currently: computer vision at AIIRA, agent memory at the Translational AI Center.

### `$ gh pr list --author somtri --state merged`

Merged patches in Zed, TensorFlow, CuPy, CloudCompare and memsearch, with open work at PyTorch, scikit-image and VGGT. Mostly unglamorous fixes: an index that overflows past 2^31, a shape check that runs after the crash instead of before it.

<!-- OSS:START -->

```
7 merged  ·  27 open  ·  14 upstream repositories

zed-industries/zed          #61997    editor: Align selections by display posit…  2026-08-14
CloudCompare/CloudCompare   #2356     Add -PLY_NO_SF_PREFIX command line option…  2026-08-13
tensorflow/tensorflow       #125041   Reconcile bounded-dynamic prefix dims in …  2026-08-13
zilliztech/memsearch        #663      fix(store): don't report every local open…  2026-08-12
tensorflow/tensorflow       #124966   Reconcile bounded-dynamic dims in BCastGr…  2026-08-11
CloudCompare/CloudCompare   #2347     Add -MATCH_SCALES command line option (#1…  2026-07-25
```

<!-- OSS:END -->

### `$ ls -1 work/`

| project | what it is | what it measured |
|---|---|---|
| **[impact-lab](https://github.com/somtri/impact-lab)** · `C++20` | Limit order book engine and a pre-registered aggregate price-impact study. [Live demo](https://somtri.github.io/impact-lab/). | 1.97B Binance futures trades · concave impact γ = 0.760, CI [0.740, 0.782] · 100.0000% book-reconstruction match · 4.06M msg/sec, p50 101 ns |
| **[flashbulb-amd](https://github.com/somtri/flashbulb-amd)** · `Python` | Self-hostable agent memory. A neural surprise gate decides what to keep, so the write path spends no LLM tokens and no data leaves the machine. [Live demo](https://somtri--flashbulb-amd-web.modal.run/). | 0 write-path tokens over 30 turns, against 2,055 for an LLM-extract baseline · ~5 ms per decision against ~400 ms · runs end to end on one AMD MI300X |
| **[vantref-bench](https://github.com/somtri/vantref-bench)** · `TypeScript` | Agent-readiness benchmark, with three realistic target apps ([shop](https://github.com/somtri/dummyshop), [clinic](https://github.com/somtri/dummyclinic), [jobs](https://github.com/somtri/dummyjobs)) that agents are scored against. | Server-side verifiers that never trust the agent · cookie-scoped session isolation · fail-closed storage |
| **[run_scope](https://github.com/somtri/run_scope)** · `Rust` | Real-time experimental process monitoring: WebSockets, React, anomaly detection, SQLite run history. | Live telemetry with persisted, replayable run history |
| **[smart_signal](https://github.com/somtri/smart_signal)** · `Python` | Stock movement forecasting with chronological validation, random forest modeling, and sentiment features. | Leakage-aware: validation runs in chronological order, so nothing looks ahead |
| **[portfolio](https://github.com/somtri/portfolio)** · `TypeScript` | The site this page borrows its face from. Next.js, statically generated, one API route. | [somtripathi.dev](https://somtripathi.dev/) |

<details>
<summary><code>$ ls -1 work/ --all</code></summary>

<br>

| project | what it is |
|---|---|
| **[flashbulb-qwen](https://github.com/somtri/flashbulb-qwen)** · `Python` | Drift-adaptive, zero-write-token memory for a Qwen agent. Qwen Cloud Hackathon, Track 1. +0.35 clean recall under drift against the prior state of the art. |
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

### `$ cat stack.txt`

```
systems     C++20  ·  Rust  ·  C  ·  CMake  ·  WebAssembly  ·  ncurses
ml          PyTorch  ·  titans-pytorch  ·  scikit-learn  ·  sentence-transformers  ·  R
data        pandas  ·  numpy  ·  SQLite  ·  embeddings  ·  yfinance
serving     FastAPI  ·  uvicorn  ·  Modal  ·  ROCm  ·  MCP
web         TypeScript  ·  Next.js  ·  React  ·  Streamlit  ·  plotly
```

### `$ git log --author=somtri --oneline -5`

<!-- ACTIVITY:START -->

```
0ad5441  zed              editor: Align selections by display position in…  8h ago
d5809d7  memsearch        fix(store): classify local Milvus open failures…  2d ago
558747a  portfolio        docs: record D-023 and D-024 from the productio…  3d ago
a37ae2e  portfolio        chore(deps): bump next, react and eslint-config…  3d ago
0d81b08  portfolio        fix(deps): revert the two majors that broke lin…  3d ago
```

<!-- ACTIVITY:END -->

### `$ contact --list`

```
web        https://somtripathi.dev
email      somtri@iastate.edu
linkedin   https://linkedin.com/in/somtri
location   ames, ia  ·  42.026°N 93.646°W
```

<sub>The two blocks above refresh daily from public GitHub data. The workflow runs on GitHub's own actions only: <a href="scripts/update-readme.mjs">scripts/update-readme.mjs</a>.</sub>
