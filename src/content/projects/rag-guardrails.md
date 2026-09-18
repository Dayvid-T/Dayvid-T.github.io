---
title: "Guardrails at the API Boundary"
summary: "Prompt-injection detection and bias filtering, checked with the evaluation suite"
date: 2026-10-01
category: ai
tags: [Python, FastAPI, Prompt injection, AI safety]
status: planned
series: "AI Security & Governance"
phase: 3
repo: https://github.com/Dayvid-T/Rag-pipeline
frameLabel: "coming soon"
featured: true
order: 10
---

Phase 3 is about what happens when someone tries to misuse the pipeline.
Not started yet.

## Plan

- Detect prompt injection in both the question and the retrieved passages,
  so a poisoned document can't take over the answer.
- Filter biased or toxic output, and refuse clearly rather than quietly
  rewriting.
- Log every block or rewrite with the rule that triggered it, so decisions
  can be reviewed later.
- Add an adversarial split to the evaluation dataset so the Phase 2 suite
  reports attack success rate next to hallucination rate. If it can't be
  measured I won't know whether it works.

I'll update this page as I go.
