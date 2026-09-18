---
title: "RAG Pipeline QA"
summary: "Ask questions about your own documents and get answers that cite where they came from"
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

A RAG (retrieval-augmented generation) service that answers questions about
documents you upload. Every answer lists the files it used and shows the
exact passages it was working from, so you can check it instead of trusting
it.

## What it does

- You drag in PDFs or text files. They get split into chunks, embedded, and
  indexed. The library survives restarts because the vector store is the
  only copy of the data.
- Search is hybrid: a semantic search (Pinecone, `multilingual-e5-large`)
  and a keyword search (BM25), merged with reciprocal rank fusion. That way
  a question phrased differently from the source still lands, and so does an
  exact term like an assignment number.
- Gemini writes the answer using only the retrieved passages. If the answer
  isn't in them, it says so instead of guessing.
- Each document has a Cite button that pulls out the title, authors and
  year and formats a reference in IEEE or APA 7.

## Architecture

<figure>
<svg viewBox="0 0 960 300" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#7aa2d8"/>
    </marker>
  </defs>
  <g stroke="#7aa2d8" stroke-width="1.5" fill="none" marker-end="url(#arr)">
    <path d="M150 80 H210"/>
    <path d="M370 80 H430"/>
    <path d="M590 60 H650"/>
    <path d="M590 100 H650"/>
    <path d="M810 80 H830 V170 H770"/>
    <path d="M610 170 H560"/>
    <path d="M400 170 H340"/>
    <path d="M280 200 V230"/>
  </g>
  <g fill="#121927" stroke="#253349">
    <rect x="30" y="50" width="120" height="60" rx="10"/>
    <rect x="210" y="50" width="160" height="60" rx="10"/>
    <rect x="430" y="50" width="160" height="60" rx="10"/>
    <rect x="650" y="40" width="160" height="34" rx="8"/>
    <rect x="650" y="86" width="160" height="34" rx="8"/>
    <rect x="610" y="150" width="160" height="40" rx="8"/>
    <rect x="400" y="150" width="160" height="40" rx="8"/>
    <rect x="180" y="150" width="160" height="40" rx="8"/>
    <rect x="180" y="230" width="160" height="40" rx="8" stroke="#b98240"/>
  </g>
  <g fill="#e4e8ee" text-anchor="middle">
    <text x="90" y="76">PDF / TXT</text>
    <text x="90" y="94" fill="#98a3b5" font-size="11">upload or data/</text>
    <text x="290" y="76">Parse + chunk</text>
    <text x="290" y="94" fill="#98a3b5" font-size="11">PyMuPDF · 500/50</text>
    <text x="510" y="76">Embed</text>
    <text x="510" y="94" fill="#98a3b5" font-size="11">multilingual-e5-large</text>
    <text x="730" y="62">Pinecone (dense)</text>
    <text x="730" y="108">BM25 (sparse)</text>
    <text x="690" y="175">RRF fusion</text>
    <text x="480" y="175">Grounded prompt</text>
    <text x="260" y="175">Gemini</text>
    <text x="260" y="255">answer + sources + contexts</text>
  </g>
  <text x="30" y="290" fill="#98a3b5" font-size="11">Question → dense + sparse retrieval → reciprocal rank fusion → Gemini, limited to the retrieved context.</text>
</svg>
<figcaption>Ingestion along the top, the query path underneath. Both searches read the same chunks, so an upload is searchable right away.</figcaption>
</figure>

## Some decisions

**Rank fusion instead of blending scores.** Cosine similarity is between 0
and 1; BM25 scores can be anything. Reciprocal rank fusion only looks at
where a chunk ranks in each list, so I didn't have to invent a way to put
the two on the same scale and re-tune it every time the corpus changed.

**Pinecone is the only copy of the corpus.** The keyword index gets rebuilt
in memory from the chunk text stored next to each vector. That's how an
upload from the browser survives a container restart without a volume.

**I had to swap the PDF parser.** The first one silently dropped every
space in my course PDFs. Embeddings didn't care, but keyword search was
useless. I only noticed because I read the extracted text.

**Retries on the LLM call.** Gemini's free tier throws 429s and 503s at
random. Three attempts with backoff turned most of those into answers
instead of 500 errors.

## Stack

FastAPI, Pinecone (with its hosted embedding model), `rank-bm25`, Google
Gemini, PyMuPDF, Vite + TypeScript with no framework, a multi-stage
Dockerfile, and GitHub Actions running the backend, frontend and evaluation
test suites. There's a deploy script for AWS ECR + App Runner in the repo,
but it runs anywhere a container runs.
