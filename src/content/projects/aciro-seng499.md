---
title: "ACIRO — Autonomous Cybersecurity Incident Response Orchestrator"
summary: "A capstone prototype that reads security logs with a RAG pipeline and recommends a mitigation, with the reasoning shown"
date: 2026-07-01
category: cybersec
tags: [Svelte, Vitest, Pytest, FastAPI, RAG, DuckDB, Team project]
status: complete
frameLabel: "ACIRO · aciro.ca (prototype)"
order: 4
---

ACIRO was my SENG 499 capstone: an 18-person team building a prototype
SOAR (security orchestration, automation and response) tool that reads a
corpus of security logs and recommends how to respond to a suspected
attack - **REVOKE_ACCESS**, **BLOCK_IP**, **ESCALATE_TO_HUMAN**, or
**MONITOR_ONLY** - with the evidence and reasoning shown alongside the
recommendation, and no action taken without a human approving it first.
The bet behind it: classical SOAR rules are brittle against novel attacks,
and an LLM reading logs through a retrieval pipeline can catch patterns a
fixed rule set misses, as long as it explains itself and never acts alone.

I moved across three sprints on this project, which meant picking up a
different part of the stack each time.

## Sprint 1 — frontend

I worked on the early UI: wireframes and the first working prototype for
the operator-facing dashboard - the incident list, a network map showing
which hosts an attack touched, and a threat summary view that pairs a
recommendation with its indicators of compromise and the playbook section
that backs it up.

## Sprint 2 — test infrastructure

I moved to devops and set up the team's testing suite: Vitest on the
Svelte frontend, Pytest on the FastAPI backend. Beyond wiring the
frameworks in, I spent most of this sprint troubleshooting failing suites
across a team of eighteen people committing to the same repo, and putting
together the test reports we used to actually see where coverage was thin
instead of assuming the suite passing meant the feature worked.

## Sprint 3 — data simulation and the bias trap

The last sprint was about the chaos engine - the tool that generates
synthetic log corpora to test detection against. I worked on the scenarios
that fed it, including what we called the bias trap: log sets where a
proxy field (department, seniority, job title, location, nationality) lines
up with an attack pattern on purpose, so we could check whether the
orchestrator's reasoning actually stayed keyed to technical indicators of
compromise or quietly leaned on who the user was instead. That ties
straight into one of the project's harder requirements - the system has to
show its reasoning quoting specific log fields, and none of them could be
a bias proxy.

## Roughly how it fits together

<figure>
<svg viewBox="0 0 960 300" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13">
  <defs>
    <marker id="arr-aciro" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#7aa2d8"/>
    </marker>
  </defs>
  <g stroke="#7aa2d8" stroke-width="1.5" fill="none" marker-end="url(#arr-aciro)">
    <path d="M140 80 H200"/>
    <path d="M360 80 H420"/>
    <path d="M580 80 H640"/>
    <path d="M800 80 H820 V190 H770"/>
    <path d="M610 190 H560"/>
    <path d="M400 190 H350"/>
    <path d="M190 190 H140"/>
  </g>
  <g fill="#121927" stroke="#253349">
    <rect x="20" y="50" width="120" height="60" rx="10"/>
    <rect x="200" y="50" width="160" height="60" rx="10"/>
    <rect x="420" y="50" width="160" height="60" rx="10" stroke="#b98240"/>
    <rect x="640" y="50" width="160" height="60" rx="10"/>
    <rect x="640" y="160" width="160" height="60" rx="10"/>
    <rect x="400" y="160" width="160" height="60" rx="10"/>
    <rect x="140" y="160" width="160" height="60" rx="10"/>
  </g>
  <g fill="#e4e8ee" text-anchor="middle">
    <text x="80" y="76">Chaos engine</text>
    <text x="80" y="94" fill="#98a3b5" font-size="11">synthetic logs</text>
    <text x="280" y="76">4 detectors</text>
    <text x="280" y="94" fill="#98a3b5" font-size="11">brute force, lateral move…</text>
    <text x="500" y="76">Bias filter</text>
    <text x="500" y="94" fill="#d29a58" font-size="11">strips proxy fields</text>
    <text x="720" y="76">RAG pipeline</text>
    <text x="720" y="94" fill="#98a3b5" font-size="11">security playbook</text>
    <text x="720" y="186">LLM orchestrator</text>
    <text x="480" y="186">Recommendation</text>
    <text x="480" y="204" fill="#98a3b5" font-size="11">+ IoCs + playbook citation</text>
    <text x="220" y="186">Human approval</text>
    <text x="220" y="204" fill="#98a3b5" font-size="11">nothing runs automatically</text>
  </g>
  <text x="20" y="260" fill="#98a3b5" font-size="11">Sprint 3 fed the chaos engine, including bias-trap scenarios that plant a proxy field alongside a real attack pattern.</text>
</svg>
<figcaption>Conceptual, not the real architecture diagram - the flow from synthetic logs to a human-reviewed recommendation.</figcaption>
</figure>

## What I got out of it

This was the first project where I felt the cost of switching layers
mid-project. Going from frontend to test infrastructure to synthetic data
design in three sprints meant I never got to specialize, but it also meant
I understood more of the system than I would have staying in one lane -
by Sprint 3 I actually knew what the frontend expected from a log record
because I'd built part of it in Sprint 1. The bias trap work was the part
that stuck with me most: it's easy to say a system should be fair, much
harder to write test data that would actually catch it failing, and that
gap is where most of the real thinking happened.
