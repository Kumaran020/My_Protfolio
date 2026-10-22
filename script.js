const themeButton = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

const projectUrls = {
  taskflow: "https://benevolent-eclair-c82e1f.netlify.app/",
  spendwise: "https://spend-wise-kumaran.netlify.app/",
  weathernow: "https://weather-now-kumaran.netlify.app/"
};

// Theme: save the user's choice in this browser.
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

function updateThemeButton() {
  const isLight = document.body.classList.contains("light-theme");
  themeButton.textContent = isLight ? "🌙" : "☀️";
  themeButton.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

updateThemeButton();

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const theme = document.body.classList.contains("light-theme")
    ? "light"
    : "dark";

  localStorage.setItem("portfolio-theme", theme);
  updateThemeButton();
});

// Mobile navigation menu.
menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
  menuButton.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  });
});

// Filter projects.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.hidden = !matches;
    });
  });
});

// Add your real Netlify links here when ready.
document.querySelectorAll("[data-project-link]").forEach((link) => {
  const key = link.dataset.projectLink;
  const url = projectUrls[key];
  let demoUrl;

  try {
    demoUrl = new URL(url);
  } catch {
    demoUrl = null;
  }

  if (
    demoUrl &&
    demoUrl.protocol === "https:" &&
    demoUrl.hostname.endsWith(".netlify.app")
  ) {
    link.href = demoUrl.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Add this project's Netlify URL in script.js first.");
    });
  }
});

// Update the footer year automatically.
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: validate and open an email draft.
// No message is stored or sent by this website.
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  // Replace this with your email address.
  const recipient = "your-email@example.com";

  if (recipient === "your-email@example.com") {
    formStatus.textContent =
      "Form works! Add your real email address in script.js to prepare an email.";
    return;
  }

  const subject = encodeURIComponent("Portfolio contact from " + name);
  const body = encodeURIComponent(
    "Name: " + name + "\n" +
    "Email: " + email + "\n\n" +
    "Message:\n" + message
  );

  formStatus.textContent = "Opening your email app...";
  window.location.href =
    "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
});

// GitHub profile: add your username before publishing.
const githubUsername = "YOUR_GITHUB_USERNAME";
const githubLink = document.getElementById("github-link");

if (githubUsername !== "YOUR_GITHUB_USERNAME") {
  githubLink.href = "https://github.com/" + githubUsername;
  githubLink.target = "_blank";
  githubLink.rel = "noopener noreferrer";
} else {
  githubLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Add your GitHub username in script.js first.");
  });
}