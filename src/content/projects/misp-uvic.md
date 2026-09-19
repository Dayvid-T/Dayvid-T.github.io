---
title: "MISP Pre-Production Deployment"
summary: "Dockerized a threat-intelligence sharing platform for UVic's Information Security team"
date: 2025-04-01
category: cybersec
tags: [Docker, Linux, MISP, Cyber Threat Intelligence, MariaDB, Technical Documentation]
status: complete
frameLabel: "internal UVic project — no public demo"
order: 5
---

Between October 2024 and April 2025 I worked with the University of
Victoria's Information Security team to stand up a pre-production instance
of [MISP](https://www.misp-project.org/) (Malware Information Sharing
Platform), a threat-intelligence platform security teams use to store,
correlate and share indicators of compromise. This is an internal UVic
system, so there's no public repo or live demo here - what follows is what
I built and what I took away from it.

## What I did

- **Containerized the whole stack with Docker Compose**, and swapped the
  deprecated MySQL 5.7 that MISP's default setup expects for MariaDB, which
  meant adjusting the compose config and working through the compatibility
  gaps that came with the swap.
- **Configured it for internal-only use** - no web services (Apache, PHP)
  installed directly on the host, everything reachable only through the
  container network. That was a deliberate constraint from the Information
  Security team, not a default.
- **Worked with the sysadmins** troubleshooting deployment issues as they
  came up, and used what we found to improve the onboarding steps for
  whoever set this up next.
- **Wrote the internal runbook** - a concise guide for troubleshooting and
  maintaining the instance, aimed at someone who hadn't been in the
  deployment process from the start.
- **Presented the finished instance** to UVic's University Systems
  Cybersecurity Working Group: what it does, what I found deploying it,
  and where it fits for teams that need to manage and share threat intel.

## Roughly how it's laid out

<figure>
<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="13">
  <defs>
    <marker id="arr-misp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#7aa2d8"/>
    </marker>
  </defs>

  <rect x="40" y="40" width="820" height="240" rx="14" fill="none" stroke="#253349" stroke-dasharray="4 4"/>
  <text x="60" y="66" fill="#98a3b5" font-size="12">Linux host</text>

  <rect x="80" y="90" width="740" height="160" rx="12" fill="#121927" stroke="#b98240"/>
  <text x="100" y="114" fill="#d29a58" font-size="12">Docker network (internal only - no ports exposed to the host web stack)</text>

  <g stroke="#7aa2d8" stroke-width="1.5" fill="none" marker-end="url(#arr-misp)">
    <path d="M330 190 H430"/>
  </g>

  <rect x="140" y="150" width="190" height="80" rx="10" fill="#182234" stroke="#253349"/>
  <text x="235" y="184" fill="#e4e8ee" text-anchor="middle">MISP container</text>
  <text x="235" y="202" fill="#98a3b5" font-size="11" text-anchor="middle">app + web UI</text>

  <rect x="430" y="150" width="190" height="80" rx="10" fill="#182234" stroke="#253349"/>
  <text x="525" y="184" fill="#e4e8ee" text-anchor="middle">MariaDB container</text>
  <text x="525" y="202" fill="#98a3b5" font-size="11" text-anchor="middle">replaces deprecated MySQL 5.7</text>

  <rect x="660" y="150" width="130" height="80" rx="10" fill="#182234" stroke="#253349"/>
  <text x="725" y="184" fill="#e4e8ee" text-anchor="middle">Volumes</text>
  <text x="725" y="202" fill="#98a3b5" font-size="11" text-anchor="middle">persistent data</text>

  <text x="490" y="270" fill="#66707f" font-size="11" text-anchor="middle">No Apache/PHP installed on the host - everything runs inside the Docker network.</text>
</svg>
<figcaption>Conceptual layout, not the real config - MISP and MariaDB each in their own container, nothing else on the host serving web traffic.</figcaption>
</figure>

## What I took from it

Most of what I'd built before this ran on my own machine or a free-tier
cloud box where I could break things without anyone noticing. This was the
first time I was deploying something onto infrastructure other people
already depended on, with a sysadmin team who'd have to live with whatever
I configured after I was gone. That changed how I approached it - I spent
more time on the runbook than I expected to, because "it works on my
machine" isn't good enough when you're not the one who has to fix it at
2 a.m. Swapping MySQL 5.7 for MariaDB also taught me to read a project's
assumptions before trusting its default setup; the compose file assumed a
database version that no longer exists, and that gap doesn't show up until
something silently fails.
