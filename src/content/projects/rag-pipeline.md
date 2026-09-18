---
title: "RAG Pipeline QA"
summary: "Document Q&A with hybrid search, grounded answers, and one-click IEEE/APA citations"
date: 2026-09-17
category: ai
tags: [Python, FastAPI, Pinecone, Gemini, BM25, TypeScript, Vite, Docker, GitHub Actions]
status: maintained
series: "AI Security & Governance"
phase: 1
repo: https://github.com/Dayvid-T/Rag-pipeline
cover: /images/rag-answer.png
coverAlt: "The Document Q&A app answering a question about an assignment PDF, with cited sources and retrieved passages"
frameLabel: "rag-pipeline-qa · localhost:8000"
featured: true
order: 30
---

A containerized retrieval-augmented generation service that answers questions
over your own documents and shows its work: every answer cites the source
files and exposes the exact passages it was grounded in.

## What it does

- **Drop in PDFs or text files** and they're chunked, embedded and indexed
  in seconds. The library persists across restarts because the vector store
  is the only copy of the corpus.
- **Hybrid retrieval** - dense semantic search (Pinecone, `multilingual-e5-large`)
  and sparse keyword search (BM25) fused with Reciprocal Rank Fusion, so
  paraphrased questions and exact identifiers both land.
- **Grounded generation** - Gemini answers only from the retrieved context
  and says "I don't know" when the answer isn't there.
- **Cite it** - one click detects title, authors and year from the document
  and formats a reference in IEEE or APA 7.

## Architecture

<figure>
<svg viewBox="0 0 960 300" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#6f95c9"/>
    </marker>
  </defs>
  <g stroke="#6f95c9" stroke-width="1.5" fill="none" marker-end="url(#arr)">
    <path d="M150 80 H210"/>
    <path d="M370 80 H430"/>
    <path d="M590 60 H650"/>
    <path d="M590 100 H650"/>
    <path d="M810 80 H830 V170 H770"/>
    <path d="M610 170 H560"/>
    <path d="M400 170 H340"/>
    <path d="M280 200 V230"/>
  </g>
  <g fill="#0f1622" stroke="#1f2b40">
    <rect x="30" y="50" width="120" height="60" rx="10"/>
    <rect x="210" y="50" width="160" height="60" rx="10"/>
    <rect x="430" y="50" width="160" height="60" rx="10"/>
    <rect x="650" y="40" width="160" height="34" rx="8"/>
    <rect x="650" y="86" width="160" height="34" rx="8"/>
    <rect x="610" y="150" width="160" height="40" rx="8"/>
    <rect x="400" y="150" width="160" height="40" rx="8"/>
    <rect x="180" y="150" width="160" height="40" rx="8"/>
    <rect x="180" y="230" width="160" height="40" rx="8" stroke="#c1803f"/>
  </g>
  <g fill="#e8e3dc" text-anchor="middle">
    <text x="90" y="76">PDF / TXT</text>
    <text x="90" y="94" fill="#9aa0a8" font-size="11">upload or data/</text>
    <text x="290" y="76">Parse + chunk</text>
    <text x="290" y="94" fill="#9aa0a8" font-size="11">PyMuPDF · 500/50</text>
    <text x="510" y="76">Embed</text>
    <text x="510" y="94" fill="#9aa0a8" font-size="11">multilingual-e5-large</text>
    <text x="730" y="62">Pinecone (dense)</text>
    <text x="730" y="108">BM25 (sparse)</text>
    <text x="690" y="175">RRF fusion</text>
    <text x="480" y="175">Grounded prompt</text>
    <text x="260" y="175">Gemini</text>
    <text x="260" y="255">answer + sources + contexts</text>
  </g>
  <text x="30" y="290" fill="#9aa0a8" font-size="11">Question → dense + sparse retrieval → Reciprocal Rank Fusion → Gemini, constrained to the retrieved context.</text>
</svg>
<figcaption>Ingestion on top, the query path underneath. Both retrievers read the same chunk set, so an upload is searchable immediately.</figcaption>
</figure>

## Decisions worth explaining

**Rank fusion instead of score blending.** Cosine similarity lives in 0–1;
BM25 scores are unbounded. Reciprocal Rank Fusion combines the two by
*position* in each list, which avoids inventing a normalization that would
need re-tuning every time the corpus changes.

**Pinecone as the single source of truth.** The keyword index is rebuilt in
memory from the chunk text stored alongside each vector. That's what lets a
document uploaded through the browser survive a container restart with no
volume to manage.

**Swapping the PDF parser.** The first parser silently dropped every space
in my course PDFs - fine for embeddings, catastrophic for keyword search.
Reading the extracted text is the test that caught it.

**Retries at the boundary.** The free Gemini tier throws intermittent 429s
and 503s. A three-attempt exponential backoff turned most of those into
answers instead of 500s.

## Stack

FastAPI · Pinecone (hosted inference) · `rank-bm25` · Google Gemini ·
PyMuPDF · Vite + TypeScript (no framework) · multi-stage Dockerfile ·
GitHub Actions running the backend, frontend and evaluation test suites.
A deploy script for AWS ECR + App Runner is included but the project is
designed to run anywhere a container runs.
