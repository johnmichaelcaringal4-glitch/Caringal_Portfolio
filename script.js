// Load portfolio content from data.json and place it into the page.
async function loadPortfolio() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not load data.json");
    const data = await response.json();

    document.title = `${data.name} | Portfolio`;
    document.getElementById("heroName").textContent = data.name;
    document.getElementById("heroRole").textContent = data.role;
    document.getElementById("heroTagline").textContent = data.tagline;
    document.getElementById("heroLocation").textContent = `📍 ${data.location}`;
    document.getElementById("aboutText").textContent = data.about;
    document.getElementById("contactLocation").textContent = data.location;
    document.getElementById("footerName").textContent = data.name;
    document.getElementById("year").textContent = new Date().getFullYear();

    const initials = data.name.split(" ").filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    document.querySelector(".avatar").textContent = initials || "YN";

    const emailLink = document.getElementById("emailLink");
    emailLink.textContent = data.email;
    emailLink.href = `mailto:${data.email}`;

    document.getElementById("skillsList").innerHTML = data.skills.map(skill => `
      <article class="skill-card">
        <h3>${escapeHTML(skill.name)}</h3>
        ${skill.level ? `<span class="skill-level">${escapeHTML(skill.level)}</span>` : ""}
      </article>
    `).join("");

    document.getElementById("projectsList").innerHTML = data.projects.map((project, index) => `
      <article class="project-card">
        <span class="project-number">PROJECT ${(index + 1).toString().padStart(2, "0")}</span>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
        <div class="tech-tags">${project.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join("")}</div>
      </article>
    `).join("");

    document.getElementById("certificationsList").innerHTML = data.certifications.map(item => `
      <article class="timeline-card">
        <div class="timeline-meta">${escapeHTML(item.year)}</div>
        <h3>${escapeHTML(item.title)}</h3>
        <p class="organization">${escapeHTML(item.issuer)}</p>
      </article>
    `).join("");

    document.getElementById("experienceList").innerHTML = data.experience.map(item => `
      <article class="timeline-card">
        <div class="timeline-meta">${escapeHTML(item.period)}</div>
        <h3>${escapeHTML(item.role)}</h3>
        <p class="organization">${escapeHTML(item.organization)}</p>
        <p>${escapeHTML(item.description)}</p>
      </article>
    `).join("");

    document.getElementById("leadershipList").innerHTML = data.leadership.map(item => `
      <article class="timeline-card">
        <h3>${escapeHTML(item.role)}</h3>
        <p class="organization">${escapeHTML(item.organization)}</p>
        <p>${escapeHTML(item.description)}</p>
      </article>
    `).join("");

    document.getElementById("socialLinks").innerHTML = data.socialLinks.map(link => `
      <a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} ↗</a>
    `).join("");
  } catch (error) {
    console.error(error);
    document.getElementById("aboutText").textContent =
      "Could not load portfolio data. Please run this website using a local server and make sure data.json is in the same folder.";
  }
}

// Escape text before inserting JSON values into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function escapeAttribute(value) {
  return String(value).replace(/["'<>]/g, "");
}

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("visitorName").value.trim();
  const email = document.getElementById("visitorEmail").value.trim();
  const message = document.getElementById("visitorMessage").value.trim();
  const recipient = document.getElementById("emailLink").textContent;
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

loadPortfolio();
