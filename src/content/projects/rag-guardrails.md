---
title: "Guardrails at the API Boundary"
summary: "Prompt-injection detection and bias filtering, measured with the evaluation suite"
date: 2026-10-01
tags: [Python, FastAPI, Prompt injection, AI safety]
status: planned
series: "AI Security & Governance"
phase: 3
repo: https://github.com/Dayvid-T/Rag-pipeline
frameLabel: "coming soon"
featured: true
order: 10
---

The third phase hardens the pipeline where it meets the outside world.

## Plan

- **Prompt-injection detection** on both the question and the retrieved
  passages, so a poisoned document can't hijack the answer.
- **Bias and toxicity filtering** on generated output, with a clear refusal
  path instead of silent rewriting.
- **Auditability** - every block or rewrite is logged with the rule that
  fired, so decisions can be reviewed.
- **Measured, not assumed** - an adversarial split is added to the
  evaluation dataset so the Phase 2 suite reports attack success rate
  alongside hallucination rate.

This page will fill in as the work lands.
