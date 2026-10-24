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

// Visual polish: scroll progress, subtle cursor glow, and reveal-on-scroll.
// These effects are decorative and do not change portfolio information.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Thin progress indicator at the top of the page.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${amount}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Reveal sections and cards as they enter the viewport.
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealItems = document.querySelectorAll(
      ".hero-content, .hero-card, .section > .eyebrow, .section-title, " +
      ".section-description, .about-card, .skill-card, .project-card, " +
      ".contact-card, .social-links"
    );
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-ready");
      if (item.classList.contains("skill-card") || item.classList.contains("project-card")) {
        item.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
      }
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach(item => observer.observe(item));
  }

  // Soft pointer glow on larger screens; disabled for touch/reduced-motion users.
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "pointer-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let frame = 0;
    window.addEventListener("pointermove", event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
        glow.classList.add("active");
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("active"));
  }

  // Close the mobile menu with Escape, and when clicking outside it.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
      menuButton.focus();
    }
  });

  document.addEventListener("click", event => {
    if (navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuButton.contains(event.target)) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    }
  });
})();


// ===== Additional interactions for the complete visual upgrade =====
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Typing animation cycles through closely related developer-role phrases,
  // while preserving the original student title in the HTML as its fallback.
  const typingTarget = document.getElementById("typing-text");
  if (typingTarget && !reduceMotion) {
    const phrases = [
      "BSc Computer Science Student",
      "Aspiring Developer",
      "Learning Web Development"
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = false;

    const typeNext = () => {
      const phrase = phrases[phraseIndex];
      if (deleting) {
        charIndex = Math.max(0, charIndex - 1);
      } else {
        charIndex = Math.min(phrase.length, charIndex + 1);
      }
      typingTarget.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? 38 : 68;
      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }
      window.setTimeout(typeNext, delay);
    };

    window.setTimeout(() => {
      deleting = true;
      typeNext();
    }, 1800);
  }

  // Reading progress indicator.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${amount}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Reveal sections and cards as they enter the viewport.
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealItems = document.querySelectorAll(
      ".hero-content, .hero-card, .section > .eyebrow, .section-title, " +
      ".section-description, .about-card, .skill-card, .project-card, " +
      ".contact-card, .social-links"
    );
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-ready");
      if (item.classList.contains("skill-card") || item.classList.contains("project-card")) {
        item.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
      }
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach(item => observer.observe(item));
  }

  // Desktop pointer glow.
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "pointer-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let frame = 0;
    window.addEventListener("pointermove", event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
        glow.classList.add("active");
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("active"));
  }

  // Keyboard and outside-click support for mobile navigation.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
      menuButton.focus();
    }
  });

  document.addEventListener("click", event => {
    if (navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuButton.contains(event.target)) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    }
  });
})();


// About Me quiz: answers are based on details provided by the portfolio owner.
(() => {
  const quiz = document.getElementById("bio-quiz");
  if (!quiz) return;
  const questions = [
    { question: "Which programming language is my favourite?", options: ["Python", "JavaScript", "Java", "C++"], answer: "JavaScript", detail: "JavaScript is my favourite programming language." },
    { question: "What is my career goal?", options: ["Game designer", "Web developer", "Data analyst", "Network engineer"], answer: "Web developer", detail: "My career goal is to become a web developer." },
    { question: "What am I currently studying?", options: ["BSc Computer Science", "BCom", "Mechanical Engineering", "BBA"], answer: "BSc Computer Science", detail: "I'm studying BSc Computer Science." },
    { question: "What do I love to do?", options: ["Create new ideas", "Collect stamps", "Repair cars", "Bake cakes"], answer: "Create new ideas", detail: "I love to create new ideas." }
  ];
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const feedbackEl = document.getElementById("quiz-feedback");
  const countEl = document.getElementById("quiz-count");
  const scoreEl = document.getElementById("quiz-score");
  const nextBtn = document.getElementById("quiz-next");
  const progress = quiz.querySelector(".quiz-progress");
  const progressFill = document.getElementById("quiz-progress-fill");
  let current = 0, score = 0, answered = false, finished = false;

  function renderQuestion() {
    const item = questions[current]; answered = false; finished = false;
    questionEl.textContent = item.question;
    countEl.textContent = `Question ${current + 1} of ${questions.length}`;
    scoreEl.textContent = `Score: ${score} / ${questions.length}`;
    progressFill.style.width = `${(current / questions.length) * 100}%`;
    progress.setAttribute("aria-valuenow", String(current));
    feedbackEl.textContent = ""; feedbackEl.className = "quiz-feedback";
    nextBtn.disabled = true; nextBtn.textContent = current === questions.length - 1 ? "See my result →" : "Next question →";
    optionsEl.replaceChildren();
    item.options.forEach(text => {
      const button = document.createElement("button"); button.type = "button"; button.className = "quiz-option"; button.textContent = text;
      button.addEventListener("click", () => chooseAnswer(button, text)); optionsEl.appendChild(button);
    });
  }
  function chooseAnswer(button, choice) {
    if (answered) return; answered = true;
    const item = questions[current], correct = choice === item.answer; if (correct) score++;
    optionsEl.querySelectorAll(".quiz-option").forEach(option => {
      option.disabled = true; if (option.textContent === item.answer) option.classList.add("correct");
    });
    if (!correct) button.classList.add("incorrect");
    feedbackEl.textContent = `${correct ? "Correct!" : "Not quite."} ${item.detail}`;
    feedbackEl.classList.add(correct ? "correct-text" : "incorrect-text");
    scoreEl.textContent = `Score: ${score} / ${questions.length}`;
    progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
    progress.setAttribute("aria-valuenow", String(current + 1)); nextBtn.disabled = false;
  }
  function showResult() {
    finished = true; countEl.textContent = "Quiz complete"; progressFill.style.width = "100%"; progress.setAttribute("aria-valuenow", String(questions.length));
    questionEl.textContent = "Thanks for getting to know me!"; optionsEl.replaceChildren();
    const result = document.createElement("p"); result.className = "quiz-result"; result.textContent = `You scored ${score} out of ${questions.length}.`; optionsEl.appendChild(result);
    feedbackEl.textContent = score === questions.length ? "Perfect score — you know my profile well!" : "Thanks for playing! Explore the rest of my portfolio to learn more.";
    feedbackEl.className = "quiz-feedback correct-text"; nextBtn.disabled = false; nextBtn.textContent = "Play again ↻";
  }
  nextBtn.addEventListener("click", () => {
    if (finished) { current = 0; score = 0; renderQuestion(); }
    else if (current < questions.length - 1) { current++; renderQuestion(); }
    else showResult();
  });
  renderQuestion();
})();
