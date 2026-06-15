const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const tabButtons = [...document.querySelectorAll(".work-tab")];
const tabPanels = [...document.querySelectorAll(".work-panel")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOut = "cubic-bezier(.16, 1, .3, 1)";
const easeInOut = "cubic-bezier(.76, 0, .24, 1)";

function runTransientAnimation(element, keyframes, options) {
  if (!element) return null;
  const animation = element.animate(keyframes, options);
  animation.finished.then(() => animation.cancel()).catch(() => {});
  return animation;
}

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
    runTransientAnimation(
      activePanel,
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

        runTransientAnimation(
          kicker,
          [
            { opacity: 0, transform: "translateX(-55px)", letterSpacing: ".5em" },
            { opacity: 1, transform: "translateX(0)", letterSpacing: ".18em" }
          ],
          { duration: 900, easing: easeOut, fill: "both" }
        );

        runTransientAnimation(
          title,
          [
            { opacity: 0, transform: "translateY(115%) scaleX(.72) skewY(4deg)" },
            { opacity: 1, transform: "translateY(0) scaleX(1) skewY(0)" }
          ],
          { duration: 1150, delay: 80, easing: easeOut, fill: "both" }
        );

        items.forEach((item, index) => {
          item.classList.add("is-animated");
          runTransientAnimation(
            item,
            [
              { opacity: 0, transform: "translateY(65px) rotate(1.5deg) scale(.96)" },
              { opacity: 1, transform: getComputedStyle(item).transform === "none" ? "translateY(0) rotate(0) scale(1)" : getComputedStyle(item).transform }
            ],
            { duration: 950, delay: 210 + index * 105, easing: easeOut, fill: "both" }
          );
        });

        images.forEach((image, index) => {
          image.classList.add("is-animated");
          runTransientAnimation(
            image,
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
  const visibleItems = new Set();
  let ticking = false;

  function render() {
    const updates = [];
    visibleItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const speed = Number(item.dataset.parallax) || .04;
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      updates.push([item, centerOffset * speed]);
    });

    updates.forEach(([item, offset]) => {
      item.style.setProperty("--parallax-y", `${offset}px`);
      if (!item.classList.contains("hero-art")) {
        item.style.translate = `0 ${offset}px`;
      }
    });
    ticking = false;
  }

  const scheduleRender = () => {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  };

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleItems.add(entry.target);
      else visibleItems.delete(entry.target);
    });
    scheduleRender();
  }, { rootMargin: "120px 0px" });

  items.forEach((item) => visibilityObserver.observe(item));
  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("resize", scheduleRender, { passive: true });
}

function setupActiveNavigation() {
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);
  let frame = 0;
  let activeId = "";

  const update = () => {
    frame = 0;
    const marker = window.scrollY + Math.max(header.offsetHeight + 28, window.innerHeight * .32);
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeSection = section;
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
      activeSection = sections[sections.length - 1];
    }

    if (!activeSection || activeSection.id === activeId) return;
    activeId = activeSection.id;
    navLinks.forEach((link) => {
      const active = link.hash === `#${activeId}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", update);
  update();
}

function setupCustomCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const cursor = document.querySelector(".custom-cursor");
  if (!finePointer || !cursor) {
    cursor?.remove();
    return;
  }

  body.classList.add("cursor-enhanced");

  let cursorFrame = 0;
  let lastPointerEvent;
  document.addEventListener("pointermove", (event) => {
    lastPointerEvent = event;
    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      cursorFrame = 0;
      cursor.style.transform = `translate3d(${lastPointerEvent.clientX - 2}px, ${lastPointerEvent.clientY - 2}px, 0)`;
      cursor.classList.add("is-visible");
      const interactive = lastPointerEvent.target.closest("a, button, .project-block, .project-metrics article, .flow-line span");
      cursor.classList.toggle("is-active", Boolean(interactive));
    });
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
  }, { capture: true });

}

function setupHeroVideo() {
  const video = document.querySelector(".hero-background-video");
  const source = video?.querySelector("source[data-src]");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!video || !source || reducedMotion || connection?.saveData || /2g/.test(connection?.effectiveType || "")) return;

  let heroVisible = true;

  const loadVideo = () => {
    source.src = source.dataset.src;
    video.load();
    if (heroVisible && !document.hidden) video.play().catch(() => {
      video.controls = false;
    });
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible && source.hasAttribute("src") && !document.hidden) video.play().catch(() => {});
    else video.pause();
  }, { threshold: .05 });
  visibilityObserver.observe(video);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else if (heroVisible && source.hasAttribute("src")) video.play().catch(() => {});
  });

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadVideo, { timeout: 1500 });
  } else {
    setTimeout(loadVideo, 700);
  }
}

function setupAmbientAnimations() {
  const items = [...document.querySelectorAll(".ticker-track, .footer-ticker")];
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in-view"));
    return;
  }

  const visibleItems = new Set();
  const sync = () => {
    items.forEach((item) => item.classList.toggle("is-in-view", visibleItems.has(item) && !document.hidden));
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleItems.add(entry.target);
      else visibleItems.delete(entry.target);
    });
    sync();
  });
  items.forEach((item) => observer.observe(item));
  document.addEventListener("visibilitychange", sync);
}

function setupWorkDataHighlights() {
  document.querySelectorAll(".work-data b").forEach((item) => {
    const match = item.textContent.trim().match(/^(.+?)\s+(播放|点赞|评论|收藏)$/);
    if (!match) return;
    item.textContent = "";
    const value = document.createElement("strong");
    const label = document.createElement("span");
    value.textContent = match[1];
    label.textContent = match[2];
    item.append(value, label);
  });
}

function setupMusic() {
  const music = document.getElementById("site-music");
  const toggle = document.querySelector(".music-toggle");
  if (!music || !toggle) return;

  let userPaused = false;
  let retryTimers = [];
  music.volume = .32;
  music.muted = false;
  music.defaultMuted = false;

  const updateMusicButton = (playing) => {
    toggle.classList.toggle("is-playing", playing);
    toggle.classList.toggle("is-blocked", !playing && !userPaused);
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    toggle.title = playing
      ? "暂停背景音乐"
      : userPaused
        ? "播放背景音乐"
        : "浏览器阻止了自动播放，点击开启背景音乐";
  };

  const playMusic = async () => {
    if (userPaused || !music.paused) return !music.paused;

    try {
      await music.play();
      if (!music.paused) updateMusicButton(true);
      return !music.paused;
    } catch {
      updateMusicButton(false);
      return false;
    }
  };

  const clearRetries = () => {
    retryTimers.forEach((timer) => window.clearTimeout(timer));
    retryTimers = [];
  };

  const scheduleAutoplayRetries = () => {
    clearRetries();
    [0, 120, 420, 1000, 2200].forEach((delay) => {
      retryTimers.push(window.setTimeout(() => {
        if (!userPaused && music.paused) playMusic();
      }, delay));
    });
  };

  const unlockOnFirstInteraction = (event) => {
    if (userPaused || !music.paused) return;
    if (event.target instanceof Element && event.target.closest(".music-toggle")) return;
    playMusic();
  };

  toggle.addEventListener("click", async () => {
    if (!music.paused) {
      userPaused = true;
      clearRetries();
      music.pause();
      updateMusicButton(false);
    } else {
      userPaused = false;
      await playMusic();
    }
  });

  music.addEventListener("playing", () => {
    userPaused = false;
    clearRetries();
    updateMusicButton(true);
  });
  music.addEventListener("pause", () => updateMusicButton(false));
  music.addEventListener("error", () => updateMusicButton(false));
  ["loadeddata", "canplay", "canplaythrough"].forEach((eventName) => {
    music.addEventListener(eventName, () => {
      if (!userPaused && music.paused) playMusic();
    }, { once: true });
  });

  window.addEventListener("pageshow", () => {
    if (!userPaused && music.paused) playMusic();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !userPaused && music.paused) playMusic();
  });
  document.addEventListener("pointerdown", unlockOnFirstInteraction, { capture: true });
  document.addEventListener("click", unlockOnFirstInteraction, { capture: true });
  document.addEventListener("keydown", unlockOnFirstInteraction, { capture: true });
  document.addEventListener("touchstart", unlockOnFirstInteraction, { capture: true, passive: true });
  document.addEventListener("touchend", unlockOnFirstInteraction, { capture: true, passive: true });

  updateMusicButton(!music.paused && !music.ended);
  scheduleAutoplayRetries();

  if (window.__musicAutoplayAttempt) {
    window.__musicAutoplayAttempt
      .then(() => updateMusicButton(!music.paused))
      .catch(() => updateMusicButton(false));
  }
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

let headerFrame = 0;
window.addEventListener("scroll", () => {
  if (headerFrame) return;
  headerFrame = requestAnimationFrame(() => {
    headerFrame = 0;
    updateHeader();
  });
}, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

setupMusic();
setupWorkDataHighlights();
document.getElementById("current-year").textContent = new Date().getFullYear();
updateHeader();
setupScrollAnimations();
setupParallax();
setupActiveNavigation();
setupCustomCursor();
setupHeroVideo();
setupAmbientAnimations();
openingAnimation();
