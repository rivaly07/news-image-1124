# World news, evidence first — 24 Nov 2026

A deterministic, offline Node 22 entry that draws an original 960×960 PNG editorial card. The repository and official kit contained no verifiable date-specific reporting for 24 November 2026, so the image explicitly says the headlines could not be verified rather than presenting invented events as news.

[Competition](https://make.fun/c/news-image-20261124)

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/rivaly07/news-image-1124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/rivaly07/news-image-1124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

Run locally:

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
MAKEFUN_OUTPUT_DIR=out node verify.mjs
```

In the grader, the entry writes `/output/entry.png`; `MAKEFUN_OUTPUT_DIR` overrides that location for local runs. `verify.mjs` checks the PNG signature, dimensions, size, chunk integrity, CRCs, and end-of-file. The PNG is generated using only Node built-ins; no network or installed dependencies are used.

Factual uncertainty: the target date is stated in the kit, but no locally available sources establish any specific event occurring or first reported that day. This image is transparent about that limitation and should not be mistaken for a sourced roundup of actual headlines.