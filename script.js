const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const tabButtons = [...document.querySelectorAll(".work-tab")];
const tabPanels = [...document.querySelectorAll(".work-panel")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOut = "cubic-bezier(.16, 1, .3, 1)";
const easeInOut = "cubic-bezier(.76, 0, .24, 1)";

function closeNavigation() {
  body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function activateTab(nextButton) {
  const nextTab = nextButton.dataset.tab;

  tabButtons.forEach((button) => {
    const active = button === nextButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== nextTab;
  });

  const activePanel = tabPanels.find((panel) => panel.dataset.panel === nextTab);
  if (!reducedMotion && activePanel) {
    activePanel.animate(
      [
        { opacity: 0, transform: "translateY(28px)", clipPath: "inset(0 0 18% 0)" },
        { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0 0)" }
      ],
      { duration: 850, easing: easeOut, fill: "both" }
    );
  }
}

function openingAnimation() {
  const opening = document.querySelector(".opening");
  if (!opening || reducedMotion) {
    opening?.remove();
    return;
  }

  body.classList.add("is-opening");
  const logo = opening.querySelector(".opening-logo");
  const left = opening.querySelector(".opening-panel-cyan");
  const right = opening.querySelector(".opening-panel-pink");
  const heroLines = [...document.querySelectorAll(".hero-line > span")];
  const heroExtras = [
    document.querySelector(".hero-sticker"),
    document.querySelector(".hero-subtitle"),
    document.querySelector(".hero-actions"),
    document.querySelector(".hero-meta")
  ].filter(Boolean);
  const heroArt = document.querySelector(".hero-art");

  logo.animate(
    [
      { opacity: 0, transform: "scaleX(.45) scaleY(1.35) translateY(40px)" },
      { opacity: 1, transform: "scaleX(1) scaleY(1) translateY(0)", offset: .65 },
      { opacity: 1, transform: "scale(1)" }
    ],
    { duration: 1000, easing: easeOut, fill: "both" }
  );

  setTimeout(() => {
    logo.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(1.2)", filter: "blur(8px)" }
      ],
      { duration: 450, easing: easeInOut, fill: "forwards" }
    );

    left.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-102%)" }],
      { duration: 950, easing: easeInOut, fill: "forwards" }
    );
    right.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(102%)" }],
      { duration: 950, easing: easeInOut, fill: "forwards" }
    );

    heroLines.forEach((line, index) => {
      line.animate(
        [
          { opacity: 0, transform: "translateY(115%) scaleY(.65) skewY(5deg)" },
          { opacity: 1, transform: "translateY(0) scaleY(1) skewY(0)" }
        ],
        { duration: 1050, delay: 210 + index * 115, easing: easeOut, fill: "both" }
      );
    });

    heroExtras.forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 850, delay: 620 + index * 90, easing: easeOut, fill: "both" }
      );
    });

    heroArt?.animate(
      [
        { opacity: 0, transform: "translateX(90px) rotate(5deg) scale(.88)", clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, transform: "translateX(0) rotate(0) scale(1)", clipPath: "inset(0 0 0 0)" }
      ],
      { duration: 1300, delay: 350, easing: easeOut, fill: "both" }
    );
  }, 920);

  setTimeout(() => {
    body.classList.remove("is-opening");
    opening.remove();
  }, 2100);
}

function setupScrollAnimations() {
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        const kicker = section.querySelector(".section-kicker");
        const title = section.querySelector(".display-title");
        const items = [...section.querySelectorAll(".stagger-item:not(.is-animated)")];
        const images = [...section.querySelectorAll(".image-reveal:not(.is-animated)")];

        kicker?.animate(
          [
            { opacity: 0, transform: "translateX(-55px)", letterSpacing: ".5em" },
            { opacity: 1, transform: "translateX(0)", letterSpacing: ".18em" }
          ],
          { duration: 900, easing: easeOut, fill: "both" }
        );

        title?.animate(
          [
            { opacity: 0, transform: "translateY(115%) scaleX(.72) skewY(4deg)" },
            { opacity: 1, transform: "translateY(0) scaleX(1) skewY(0)" }
          ],
          { duration: 1150, delay: 80, easing: easeOut, fill: "both" }
        );

        items.forEach((item, index) => {
          item.classList.add("is-animated");
          item.animate(
            [
              { opacity: 0, transform: "translateY(65px) rotate(1.5deg) scale(.96)" },
              { opacity: 1, transform: getComputedStyle(item).transform === "none" ? "translateY(0) rotate(0) scale(1)" : getComputedStyle(item).transform }
            ],
            { duration: 950, delay: 210 + index * 105, easing: easeOut, fill: "both" }
          );
        });

        images.forEach((image, index) => {
          image.classList.add("is-animated");
          image.animate(
            [
              { clipPath: "inset(0 0 100% 0)", transform: "scale(1.08)" },
              { clipPath: "inset(0 0 0 0)", transform: "scale(1)" }
            ],
            { duration: 1250, delay: 180 + index * 90, easing: easeOut, fill: "both" }
          );
        });

        observer.unobserve(section);
      });
    },
    { threshold: .12, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll("main section:not(.hero)").forEach((section) => sectionObserver.observe(section));
}

function setupParallax() {
  if (reducedMotion) return;
  const items = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;

  function render() {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed = Number(item.dataset.parallax) || .04;
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      item.style.setProperty("--parallax-y", `${centerOffset * speed}px`);
      if (!item.classList.contains("hero-art")) {
        item.style.translate = `0 ${centerOffset * speed}px`;
      }
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  }, { passive: true });
  render();
}

function setupActiveNavigation() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

function setupCustomCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const cursor = document.querySelector(".custom-cursor");
  if (!finePointer || !cursor) {
    cursor?.remove();
    return;
  }

  body.classList.add("cursor-enhanced");
  let targetX = -100;
  let targetY = -100;
  let currentX = targetX;
  let currentY = targetY;
  let cursorFrame = null;

  function renderCursor() {
    currentX += (targetX - currentX) * .24;
    currentY += (targetY - currentY) * .24;
    cursor.style.transform = `translate3d(${currentX - 4}px, ${currentY - 4}px, 0)`;
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .2) {
      cursorFrame = requestAnimationFrame(renderCursor);
    } else {
      cursorFrame = null;
    }
  }

  document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
    const interactive = event.target.closest("a, button, .project-block, .project-metrics article, .flow-line span");
    cursor.classList.toggle("is-active", Boolean(interactive));
    if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
  }, { passive: true });

  document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });

}

function setupHeroVideo() {
  const video = document.querySelector(".hero-background-video");
  const source = video?.querySelector("source[data-src]");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!video || !source || reducedMotion || connection?.saveData) return;

  const loadVideo = () => {
    source.src = source.dataset.src;
    video.load();
    video.play().catch(() => {
      video.controls = false;
    });
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadVideo, { timeout: 1500 });
  } else {
    setTimeout(loadVideo, 700);
  }
}

function setupMusic() {
  const music = document.getElementById("site-music");
  const toggle = document.querySelector(".music-toggle");
  if (!music || !toggle) return;

  let wantsMusic = true;
  music.volume = .32;

  const updateMusicButton = (playing) => {
    toggle.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    toggle.title = playing ? "暂停背景音乐" : "播放背景音乐";
  };

  const playMusic = () => {
    if (!wantsMusic) return;
    music.play()
      .then(() => {
        if (wantsMusic && !music.paused) updateMusicButton(true);
      })
      .catch(() => {
        // Browsers may wait for the first user interaction before allowing sound.
      });
  };

  toggle.addEventListener("click", () => {
    wantsMusic = !wantsMusic;
    if (wantsMusic) {
      playMusic();
    } else {
      music.pause();
      updateMusicButton(false);
    }
  });

  music.addEventListener("play", () => updateMusicButton(true));
  music.addEventListener("pause", () => {
    if (!wantsMusic) updateMusicButton(false);
  });

  document.addEventListener("pointerdown", playMusic, { once: true, capture: true });
  document.addEventListener("keydown", playMusic, { once: true, capture: true });
  playMusic();
}

navToggle.addEventListener("click", () => {
  const open = !body.classList.contains("nav-open");
  body.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateTab(button));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabButtons.length - 1;
    activateTab(tabButtons[nextIndex]);
    tabButtons[nextIndex].focus();
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

document.getElementById("current-year").textContent = new Date().getFullYear();
updateHeader();
setupScrollAnimations();
setupParallax();
setupActiveNavigation();
setupCustomCursor();
setupHeroVideo();
setupMusic();
openingAnimation();
