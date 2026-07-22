const CONFIG = {
  startDate: "2024-06-24",
};

function getElapsedBreakdown(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function getNextMonthsary(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const day = start.getDate();

  let candidate = new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0);
  if (candidate <= now) {
    candidate = new Date(now.getFullYear(), now.getMonth() + 1, day, 0, 0, 0);
  }
  return candidate;
}

function animateCounter(el, endValue, duration = 900) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); 
    el.textContent = Math.round(eased * endValue);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initHeroCounter() {
  const { years, months, days } = getElapsedBreakdown(CONFIG.startDate);
  animateCounter(document.getElementById("numYears"), years);
  animateCounter(document.getElementById("numMonths"), months);
  animateCounter(document.getElementById("numDays"), days);
}

function initCountdown() {
  const target = getNextMonthsary(CONFIG.startDate);

  const els = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds"),
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function update() {
    const diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    els.days.textContent = pad(d);
    els.hours.textContent = pad(h);
    els.minutes.textContent = pad(m);
    els.seconds.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}

function initEnvelope() {
  const envelope = document.getElementById("envelope");

  function toggleOpen() {
    const isOpen = envelope.classList.toggle("is-open");
    envelope.setAttribute("aria-expanded", String(isOpen));
  }

  envelope.addEventListener("click", toggleOpen);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  });
}

function initGallery() {
  const photos = document.querySelectorAll(".polaroid");
  photos.forEach((photo) => {
    photo.setAttribute("tabindex", "0");
    photo.addEventListener("click", () => {
      photos.forEach((p) => p.classList.remove("is-active"));
      photo.classList.add("is-active");

  
      photo.classList.remove("is-floating");
      void photo.offsetWidth; 
      photo.classList.add("is-floating");
    });

  
    photo.addEventListener("animationend", (e) => {
      if (e.animationName === "photo-float") {
        photo.classList.remove("is-floating");
      }
    });
  });
}

function initLetterWave() {
  const targets = document.querySelectorAll(".letter-wave");
  targets.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${i * 0.08}s`;
      el.appendChild(span);
    });
  });
}

function initPetalField() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const field = document.getElementById("petalField");
  const petalCount = window.innerWidth < 600 ? 9 : 16;
  const symbols = ["❀", "✿", "♡"];

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = symbols[i % symbols.length];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.fontSize = `${0.7 + Math.random() * 0.9}rem`;
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
    petal.style.animationDuration = `${14 + Math.random() * 12}s`;
    petal.style.animationDelay = `${Math.random() * -20}s`;
    field.appendChild(petal);
  }
}

function initScrollThread() {
  const fill = document.getElementById("scrollFill");
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initMusicPlayer() {
  const toggle = document.getElementById("musicToggle");
  const label = document.getElementById("musicLabel");
  const audio = document.getElementById("bgAudio");

  toggle.addEventListener("click", async () => {
    const isPlaying = toggle.classList.contains("is-playing");
    try {
      if (isPlaying) {
        audio.pause();
        toggle.classList.remove("is-playing");
        toggle.setAttribute("aria-pressed", "false");
        label.textContent = "our song";
      } else {
        await audio.play();
        toggle.classList.add("is-playing");
        toggle.setAttribute("aria-pressed", "true");
        label.textContent = "playing...";
      }
    } catch (err) {
      label.textContent = "add a song file";
      console.warn("Couldn't play background audio. Did you add audio/our-song.mp3?", err);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroCounter();
  initCountdown();
  initEnvelope();
  initGallery();
  initLetterWave();
  initPetalField();
  initScrollThread();
  initMusicPlayer();
});