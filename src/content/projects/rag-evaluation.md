---
title: "RAG Evaluation Suite"
summary: "A fixed set of questions run against the pipeline, graded for hallucination, accuracy and latency"
date: 2026-09-17
category: ai
tags: [Python, LLM-as-judge, Gemini, httpx, pytest]
status: complete
series: "AI Security & Governance"
phase: 2
repo: https://github.com/Dayvid-T/Rag-pipeline/tree/main/evaluation
cover: /images/eval-run.png
coverAlt: "Terminal output of run_eval.py grading 18 questions and printing hallucination rate, accuracy and latency"
frameLabel: "evaluation/run_eval.py"
featured: true
order: 20
---

You can't tell whether a RAG system is any good by trying a few questions
by hand. This suite runs a fixed set of questions against the API, times
each one, and has a separate model grade whether the answer was actually
supported by the passages the system retrieved.

## What it measures

<div class="metrics">
  <div class="metric"><b>Hallucination</b><span>answers with a claim the context doesn't support</span></div>
  <div class="metric"><b>Accuracy</b><span>matches the reference answer</span></div>
  <div class="metric"><b>Abstention</b><span>says "I don't know" when it should</span></div>
  <div class="metric"><b>Retrieval hit</b><span>the right file shows up in the sources</span></div>
  <div class="metric"><b>Latency</b><span>mean · p50 · p95 · max</span></div>
</div>

## How it works

1. `dataset.jsonl` has one case per line: the question, a reference answer,
   the file that should come back, and whether the system is supposed to
   refuse. Out-of-scope questions are a big part of it, because a system
   that never says "I don't know" will happily make things up.
2. Each case is sent to the running service. The response includes the
   answer, its sources, and the raw retrieved passages.
3. A Gemini judge (JSON mode, temperature 0, strict rubric) marks
   `grounded`, `correct` and `abstained`, with a one-line reason.
4. Everything is written to a Markdown report and a timestamped JSON with
   each verdict. If you set thresholds, a bad run fails the command:

```bash
python run_eval.py --base-url http://localhost:8000 \
  --max-hallucination-rate 0.1 --max-p95-latency-ms 5000
```

That's the part that matters. The same command runs in CI against a local
container or against a deployed URL, so it can block a release.

## Results

Three runs on an 18-question set over course PDFs:

<div class="metrics">
  <div class="metric"><b>5.6–11 %</b><span>hallucination rate</span></div>
  <div class="metric"><b>72–91 %</b><span>accuracy</span></div>
  <div class="metric"><b>100 %</b><span>retrieval hit rate</span></div>
  <div class="metric"><b>4.4 s</b><span>p50 latency</span></div>
  <div class="metric"><b>46–50 s</b><span>p95 during Gemini free-tier outages</span></div>
</div>

Retrieval never missed once. All the variation is in the generation step.
Two of the runs happened while Gemini's free tier was struggling, and you
can see it: accuracy and abstention both dropped and p95 latency blew up
from retries. That's the kind of thing I'd rather find out from a report
than from a user.

## Why use a model as the judge

Exact-match scoring marks a correct answer wrong if it's worded
differently. Embedding similarity gives fluent nonsense a good score.
Asking a separate model "is every claim here supported by this context?"
is the cheapest signal that lines up with what people actually mean by
hallucination. The judge is mocked in the unit tests, so the suite's own
logic gets tested without spending tokens.
