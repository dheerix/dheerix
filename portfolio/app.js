const PROJECTS = [
  {
    id: "guardlane",
    title: "Guardlane",
    category: "Production AI",
    summary:
      "Turning an AI moderation workflow into a production-ready capability with governance, observability, and human oversight.",
    architecture: ["Input", "Moderation", "Policy Decision", "Fallback / Human Review", "Outcome"],
    focus: "Production readiness for AI moderation",
    tradeoff: "Automation speed balanced against reliability, governance, and human review",
    outcome: "Safer marketplace processing with a clearer path to production adoption",
    storyPath: "../stories/01_OPENLANE/GUARDLANE.md",
  },
  {
    id: "ai-upload",
    title: "AI Upload",
    category: "AI Product Engineering",
    summary:
      "Leading a multi-phase AI-enabled workflow for dealer content across product, platform, and operations concerns.",
    architecture: ["Dealer Content", "Upload UI", "BFF Layer", "AI Processing", "Validation / Review", "Marketplace Output"],
    focus: "AI-assisted workflow for dealer-provided content",
    tradeoff: "Product utility balanced against staged delivery and operational confidence",
    outcome: "A practical AI workflow that fits into real marketplace operations",
    storyPath: "../stories/01_OPENLANE/AI_UPLOAD.md",
  },
  {
    id: "marketplace-modernization",
    title: "Marketplace Modernization",
    category: "Platform Engineering",
    summary:
      "Modernizing legacy marketplace capabilities incrementally across services, cloud infrastructure, frontend systems, and deployment workflows.",
    architecture: ["Legacy Marketplace", "Strangler Layer", "Cloud Services", "Frontend Modernization", "Production Delivery"],
    focus: "Incremental marketplace modernization",
    tradeoff: "Platform evolution balanced against uninterrupted production continuity",
    outcome: "A more maintainable path from legacy systems to modern services",
    storyPath: "../stories/01_OPENLANE/MARKETPLACE_MODERNIZATION.md",
  },
  {
    id: "enterprise-search",
    title: "Enterprise Search",
    category: "Search Engineering",
    summary:
      "Shaping commerce search architecture through Elasticsearch, business rules, APIs, and customer-facing product discovery.",
    architecture: ["Commerce UI", "Search APIs", "Promotion Logic", "Elasticsearch", "Results / Browse Experience"],
    focus: "Enterprise discovery and promotion systems",
    tradeoff: "Search quality balanced against business rules and operational stability",
    outcome: "Search that better connected product discovery with commerce outcomes",
    storyPath: "../stories/02_HOLLAND_BARRETT/ENTERPRISE_SEARCH.md",
  },
];

const DNA_FLOW = [
  { title: "Product", text: "Start with the user problem and the business outcome." },
  { title: "Architecture", text: "Shape the system so it can evolve safely." },
  { title: "Implementation", text: "Build the smallest thing that can work in production." },
  { title: "Deployment", text: "Treat release readiness as part of the code." },
  { title: "Production", text: "Observe the system where reality is loudest." },
  { title: "Iteration", text: "Refine based on evidence, not assumptions." },
];

const TIMELINE = [
  {
    year: "2011",
    title: "Foundations",
    text: "Android, .NET, PHP, desktop applications, and the habit of learning the stack deeply enough to own outcomes.",
  },
  {
    year: "2014",
    title: "Enterprise Development",
    text: "Web, mobile, and back-end systems built in environments where reliability and change management mattered.",
  },
  {
    year: "2018",
    title: "Search and Commerce",
    text: "Enterprise search, promotion logic, backend APIs, and customer-facing commerce delivery at Holland & Barrett.",
  },
  {
    year: "2022",
    title: "Marketplace Modernization",
    text: "Cloud-native services, backend-for-frontend layers, and production continuity at Openlane.",
  },
  {
    year: "2024",
    title: "Production AI",
    text: "Guardlane and AI Upload brought AI into real operating workflows instead of demos.",
  },
  {
    year: "Now",
    title: "Systems Thinking",
    text: "Architecture, mentoring, and cross-team delivery have become the center of gravity.",
  },
];

const BREADTH = [
  {
    title: "AI Engineering",
    lead: "Production AI, guardrails, evaluation, and human-in-the-loop design.",
    tags: ["LLMs", "SageMaker", "Governance", "HITL"],
  },
  {
    title: "Platform Engineering",
    lead: "Cloud-native services, deployment flow, observability, and service boundaries.",
    tags: ["AWS", "Kubernetes", "Docker", "ArgoCD"],
  },
  {
    title: "Backend",
    lead: "APIs, orchestration, integration layers, and distributed application design.",
    tags: [".NET", "Java", "Node.js", "Python"],
  },
  {
    title: "Frontend",
    lead: "React, Svelte, Stencil, Flutter, and customer-facing product work.",
    tags: ["React", "Svelte", "Stencil", "Flutter"],
  },
  {
    title: "Cloud and Data",
    lead: "AWS services, search systems, databases, and event-driven pipelines.",
    tags: ["AWS", "Oracle", "PostgreSQL", "Elasticsearch"],
  },
  {
    title: "Leadership",
    lead: "Architecture, technical judgment, mentoring, and cross-functional delivery.",
    tags: ["Ownership", "Communication", "Trade-offs", "Reliability"],
  },
];

const PHILOSOPHY = [
  "Reliability before cleverness.",
  "Evidence before optimization.",
  "Incremental modernization over rewrites.",
  "Own the system, not just the code.",
  "Architecture should reduce future friction.",
];

const POLYGLOT = [
  "Java",
  ".NET",
  "Android",
  "Flutter",
  "Python",
  "Node.js",
  "React",
  "Swift",
  "PHP",
  "VB6",
];

const EVOLUTION = [
  { title: "Code", text: "Started by learning how to build and ship applications." },
  { title: "APIs", text: "Moved toward integration points and service boundaries." },
  { title: "Systems", text: "Worked across distributed and event-driven platforms." },
  { title: "Cloud", text: "Built and modernized cloud-native software and deployment flows." },
  { title: "AI", text: "Brought LLMs and machine learning into production workflows." },
  { title: "Thinking", text: "Now approach work through architecture, leverage, and outcomes." },
];

const WRITING_CATEGORIES = [
  {
    title: "Engineering",
    text: "Production lessons, code review thinking, and practical notes.",
  },
  {
    title: "Architecture",
    text: "System design, boundaries, trade-offs, and incremental evolution.",
  },
  {
    title: "AI",
    text: "Production AI, guardrails, evaluation, and operational design.",
  },
  {
    title: "Communication",
    text: "Explaining technical ideas clearly to engineers and non-engineers.",
  },
  {
    title: "Career",
    text: "Growth, ownership, and long-term engineering work.",
  },
];

const RECOGNITION = [
  { title: "Production AI", text: "Guardlane and AI Upload show how I think about reliable AI delivery." },
  { title: "Cross-team Ownership", text: "I work comfortably across engineering, product, and operational stakeholders." },
  { title: "Technical Leadership", text: "I help create clarity, reduce ambiguity, and move work forward." },
  { title: "Production Support", text: "I stay close to reliability, incidents, and what happens after launch." },
  { title: "Mentoring", text: "I aim to improve the team around me, not just the code I touch." },
];

const projectGrid = document.getElementById("project-grid");
const dnaFlow = document.getElementById("dna-flow");
const timelineTrack = document.getElementById("timeline-track");
const breadthMap = document.getElementById("breadth-map");
const philosophyBlock = document.getElementById("philosophy-block");
const polyglotRail = document.getElementById("polyglot-rail");
const evolutionTrack = document.getElementById("evolution-track");
const writingCategories = document.getElementById("writing-categories");
const recognitionStrip = document.getElementById("recognition-strip");
const storyTitle = document.getElementById("story-title");
const storySummary = document.getElementById("story-summary");
const storyMeta = document.getElementById("story-meta");
const storyView = document.getElementById("story-view");
const storySection = document.getElementById("projects");

let activeProjectId = "guardlane";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text) {
  let output = escapeHtml(text);
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return output;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeBuffer = [];
  let blockquote = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html += `<p>${formatInline(paragraph.join(" ").trim())}</p>`;
    paragraph = [];
  }

  function flushList() {
    if (!listType) return;
    html += `</${listType}>`;
    listType = null;
  }

  function flushBlockquote() {
    if (!blockquote.length) return;
    html += `<blockquote>${blockquote
      .map((line) => formatInline(line))
      .join("<br />")}</blockquote>`;
    blockquote = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`;
        codeBuffer = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        flushBlockquote();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      html += `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html += "<hr />";
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (bulletMatch || orderedMatch) {
      flushParagraph();
      flushBlockquote();
      const type = bulletMatch ? "ul" : "ol";
      const content = formatInline((bulletMatch || orderedMatch)[1]);
      if (listType && listType !== type) {
        flushList();
      }
      if (!listType) {
        listType = type;
        html += `<${type}>`;
      }
      html += `<li>${content}</li>`;
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      blockquote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushBlockquote();

  if (inCode && codeBuffer.length) {
    html += `<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`;
  }

  return html;
}

function renderProjectCards() {
  projectGrid.innerHTML = PROJECTS.map(
    (project) => `
      <button class="project-card" type="button" data-project="${project.id}" aria-pressed="${project.id === activeProjectId}">
        <div class="project-meta">
          <span class="tag">${project.category}</span>
          <span class="tag">${project.id === activeProjectId ? "Selected" : "Story"}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <span class="story-link">Read story →</span>
      </button>
    `,
  ).join("");

  projectGrid.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => selectProject(button.dataset.project));
  });
}

function renderDNA() {
  dnaFlow.innerHTML = DNA_FLOW.map(
    (step, index) => `
      <article class="dna-step">
        <span class="dna-index">0${index + 1}</span>
        <h3>${step.title}</h3>
        <p>${step.text}</p>
      </article>
    `,
  ).join("");
}

function renderTimeline() {
  timelineTrack.innerHTML = TIMELINE.map(
    (item) => `
      <article class="timeline-card">
        <p class="timeline-year">${item.year}</p>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `,
  ).join("");
}

function renderBreadth() {
  const intro = `
    <article class="breadth-core">
      <p class="eyebrow">Software</p>
      <h3>One engineer across many systems</h3>
      <p>
        AI, platform, product, cloud, and search work all belong to the same engineering
        story when they are tied to production outcomes.
      </p>
    </article>
  `;
  const nodes = BREADTH.map(
    (item) => `
      <article class="breadth-node">
        <h3>${item.title}</h3>
        <p>${item.lead}</p>
        <div class="tag-row">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </article>
    `,
  ).join("");
  breadthMap.innerHTML = intro + nodes;
}

function renderPhilosophy() {
  philosophyBlock.innerHTML = `
    <div class="philosophy-quote">
      ${PHILOSOPHY.map((line) => `<p>${line}</p>`).join("")}
    </div>
    <div class="philosophy-note">
      <strong>My bias:</strong>
      <span>build the smallest thing that works, keep it observable, and evolve it with evidence.</span>
    </div>
  `;
}

function renderPolyglot() {
  polyglotRail.innerHTML = `
    <div class="polyglot-spine">
      ${POLYGLOT.map(
        (item, index) => `
          <div class="polyglot-node">
            <span>${item}</span>
            ${index < POLYGLOT.length - 1 ? '<i aria-hidden="true"></i>' : ""}
          </div>
        `,
      ).join("")}
    </div>
    <p class="polyglot-note">
      Learned one language. Learned many. Then realized they are all solving the same
      engineering problems: clarity, boundaries, reliability, and change.
    </p>
  `;
}

function renderEvolution() {
  evolutionTrack.innerHTML = EVOLUTION.map(
    (item, index) => `
      <article class="evolution-step">
        <span class="evolution-index">0${index + 1}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `,
  ).join("");
}

function renderWritingCategories() {
  writingCategories.innerHTML = WRITING_CATEGORIES.map(
    (item) => `
      <article class="writing-category">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `,
  ).join("");
}

function renderRecognition() {
  recognitionStrip.innerHTML = RECOGNITION.map(
    (item) => `
      <article class="recognition-card">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `,
  ).join("");
}

function renderStoryMeta(project) {
  storyMeta.innerHTML = `
    <div class="story-meta-card">
      <p class="eyebrow">Architecture</p>
      <div class="story-steps">
        ${project.architecture
          .map(
            (step, index) => `
              <div class="story-step">${step}</div>
              ${index < project.architecture.length - 1 ? '<div class="story-arrow">↓</div>' : ""}
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="story-meta-card">
      <p class="eyebrow">Why it matters</p>
      <div class="story-facts">
        <div class="story-fact">
          <label>Focus</label>
          <strong>${escapeHtml(project.focus)}</strong>
        </div>
        <div class="story-fact">
          <label>Trade-off</label>
          <strong>${escapeHtml(project.tradeoff)}</strong>
        </div>
        <div class="story-fact">
          <label>Outcome</label>
          <strong>${escapeHtml(project.outcome)}</strong>
        </div>
      </div>
    </div>
  `;
}

async function loadStory(project) {
  storyTitle.textContent = project.title;
  storySummary.textContent = project.summary;
  renderStoryMeta(project);
  storyView.innerHTML = "<p>Loading story…</p>";

  try {
    const response = await fetch(project.storyPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${project.storyPath}`);
    }
    const markdown = await response.text();
    storyView.innerHTML = renderMarkdown(markdown);
  } catch (error) {
    storyView.innerHTML = `
      <h3>Story unavailable</h3>
      <p>${escapeHtml(error.message)}</p>
      <p>This page expects the story Markdown to be available relative to the portfolio directory.</p>
    `;
  }
}

function selectProject(projectId) {
  const project = PROJECTS.find((item) => item.id === projectId) || PROJECTS[0];
  activeProjectId = project.id;
  renderProjectCards();
  loadStory(project);
  storySection.scrollIntoView({ behavior: "smooth", block: "start" });
  const url = new URL(window.location.href);
  url.hash = project.id;
  history.replaceState(null, "", url);
}

function initFromUrl() {
  const hash = window.location.hash.replace("#", "");
  const matchingProject = PROJECTS.find((project) => project.id === hash);
  if (matchingProject) {
    activeProjectId = matchingProject.id;
  }
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "");
  const matchingProject = PROJECTS.find((project) => project.id === hash);
  if (matchingProject) {
    selectProject(matchingProject.id);
  }
});

initFromUrl();
renderDNA();
renderTimeline();
renderBreadth();
renderPhilosophy();
renderPolyglot();
renderEvolution();
renderWritingCategories();
renderRecognition();
renderProjectCards();
selectProject(activeProjectId);
