import { PROJECTS, SITE_DATA } from "./data.js";
import { initSuitcaseScene } from "./suitcase-scene.js";

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const cards = PROJECTS.map((project) => {
    return `
      <article class="project-card">
        <h3>${project.title}</h3>
        <p class="project-meta">${project.tag ?? "Case Study"}</p>
        <p class="project-desc">${project.subtitle}</p>
        <a class="project-link" href="${project.href}" ${project.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
          ${project.cta} &rarr;
        </a>
      </article>
    `;
  }).join("");

  grid.innerHTML = cards;
}

function hydrateContactInfo() {
  const mailLink = document.querySelector('a[href^="mailto:"]');
  if (mailLink) {
    mailLink.href = `mailto:${SITE_DATA.email}`;
  }

  const linkedInLinks = document.querySelectorAll('a[href="https://www.linkedin.com/"]');
  linkedInLinks.forEach((link) => {
    link.href = SITE_DATA.linkedInUrl;
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

renderProjects();
hydrateContactInfo();
setFooterYear();
initSuitcaseScene(PROJECTS);
