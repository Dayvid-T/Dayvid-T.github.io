---
title: "RAG Evaluation Suite"
summary: "Black-box evaluation of the pipeline: hallucination rate, accuracy, retrieval hits, latency"
date: 2026-09-17
tags: [Python, LLM-as-judge, Gemini, httpx, pytest]
status: complete
series: "AI Security & Governance"
phase: 2
repo: https://github.com/Dayvid-T/Rag-pipeline/tree/main/evaluation
frameLabel: "evaluation/run_eval.py"
featured: true
order: 20
---

A shipping RAG system is only as trustworthy as the way you measure it.
This suite treats the service as a black box: it sends a golden dataset to
`POST /query`, times every call on the wire, and asks an independent LLM
judge whether each answer was actually supported by the passages the
system retrieved.

## What it measures

<div class="metrics">
  <div class="metric"><b>Hallucination</b><span>share of answers with an unsupported claim</span></div>
  <div class="metric"><b>Accuracy</b><span>matches the reference answer</span></div>
  <div class="metric"><b>Abstention</b><span>refuses when the answer isn't there</span></div>
  <div class="metric"><b>Retrieval hit</b><span>expected file appears in sources</span></div>
  <div class="metric"><b>Latency</b><span>mean · p50 · p95 · max</span></div>
</div>

## How it works

1. `dataset.jsonl` holds one case per line: the question, a reference
   answer, the file that should be retrieved, and whether the system is
   *expected to abstain* (out-of-scope questions are half the point).
2. Each case is posted to the running service. The response carries the
   answer, its cited sources and the raw retrieved contexts.
3. A Gemini judge - JSON mode, temperature 0, strict rubric - grades
   `grounded`, `correct` and `abstained`, and explains why in one sentence.
4. Results roll up into a Markdown report and a timestamped JSON with every
   verdict, and the run exits non-zero if a threshold is breached:

```bash
python run_eval.py --base-url http://localhost:8000 \
  --max-hallucination-rate 0.1 --max-p95-latency-ms 5000
```

That last part is what turns an evaluation into a **gate**: the same
command runs against a local container in CI or against a deployed URL
before promoting a release.

## What the numbers said

Across three runs of an 18-question set over course PDFs:

<div class="metrics">
  <div class="metric"><b>5.6–11 %</b><span>hallucination rate</span></div>
  <div class="metric"><b>72–91 %</b><span>accuracy</span></div>
  <div class="metric"><b>100 %</b><span>retrieval hit rate</span></div>
  <div class="metric"><b>4.4 s</b><span>p50 latency</span></div>
  <div class="metric"><b>46–50 s</b><span>p95 during free-tier brownouts</span></div>
</div>

Retrieval never missed; the variance is all in generation. Runs during a
Gemini free-tier brownout lost accuracy and abstention while p95 latency
blew out on retries - exactly the kind of regression you want a suite like
this to surface before a user does.

## Why LLM-as-judge

Exact-match scoring punishes correct answers phrased differently; embedding
similarity rewards fluent nonsense. Asking a separate model *"is every
claim here supported by this context?"* is the cheapest signal that tracks
what people actually mean by hallucination. The judge is mocked in unit
tests, so the suite's own logic is verified without spending tokens.
