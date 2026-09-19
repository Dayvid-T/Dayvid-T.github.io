// Everything personal lives here so the rest of the site never needs editing.
export const site = {
  name: "David Whyte",
  handle: "david.whyte",
  headline: "I build software, then check it does what it claims.",
  tagline:
    "Software engineering student at UVic. Most of what's here is about AI, cyber security, and information management. Each project has the code, what I did, and what went wrong along the way.",
  about: [
    "I'm in software engineering at the University of Victoria. I like working on a full system rather than one layer of it, and I care more about whether something works in practice than whether it demos well.",
    "The projects are grouped into three areas: AI, cyber security, and information management. The AI section is a three-part project I built end to end: a RAG pipeline, an evaluation suite that grades it, and guardrails that block prompt injection at the API boundary.",
    "Outside of work I play guitar, and I'll take any excuse to get out for badminton or tennis.",
  ],
  location: "Victoria, BC",
  skills: {
    tagline: "Understand the system. Build it. Prove it works.",
    blurb:
      "Before I write code I want to know how the pieces actually fit together - what talks to what, where something breaks, what has to be true for the rest to work. That's the part I like most, and it's why most of these projects end up with an evaluation suite or an audit log next to the feature itself.",
    items: [
      { label: "Python", short: "PY" },
      { label: "TypeScript", short: "TS" },
      { label: "C", short: "C" },
      { label: "Docker", short: "DK" },
      { label: "System Design", short: "SD" },
    ],
  },
  links: {
    github: "https://github.com/Dayvid-T",
    linkedin: "https://www.linkedin.com/in/david-w-30aa9b156",
    email: "whytedavid3@gmail.com",
    resume: "", // e.g. /resume.pdf after dropping the file in public/
  },
};
