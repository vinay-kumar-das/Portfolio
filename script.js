(function (global) {
  "use strict";

  function isHeaderScrolled(scrollY) {
    return scrollY > 24;
  }

  function shouldShowScrollTop(scrollY) {
    return scrollY > 480;
  }

  function getActiveSectionId({
    scrollY,
    viewportHeight,
    documentHeight,
    headerHeight = 60,
    sections,
  }) {
    if (viewportHeight + scrollY >= documentHeight - 40) {
      return "contact";
    }

    const headerOffset = headerHeight + 40;
    let current = "";

    sections.forEach(function ({ id, offsetTop }) {
      if (scrollY >= offsetTop - headerOffset) {
        current = id;
      }
    });

    return current;
  }

  global.PortfolioUI = {
    getActiveSectionId,
    isHeaderScrolled,
    shouldShowScrollTop,
  };

  if (!global.document) {
    return;
  }

  const documentRef = global.document;
  const header = documentRef.querySelector(".header");
  const navToggle = documentRef.querySelector(".nav-toggle");
  const navMenu = documentRef.querySelector(".nav-menu");
  const navLinks = documentRef.querySelectorAll(".nav-link");
  const sections = documentRef.querySelectorAll("section[id]");
  const yearEl = documentRef.getElementById("year");
  const contactForm = documentRef.getElementById("contact-form");
  const formStatus = documentRef.getElementById("form-status");
  const scrollTopBtn = documentRef.getElementById("scroll-top");

  function hideLoader() {
    documentRef.body.classList.add("is-ready");
  }

  if (documentRef.readyState === "complete") {
    hideLoader();
  } else {
    global.addEventListener("load", hideLoader);
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", isHeaderScrolled(global.scrollY));
  }

  global.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function updateScrollTop() {
    if (!scrollTopBtn) return;
    const show = shouldShowScrollTop(global.scrollY);
    scrollTopBtn.classList.toggle("is-visible", show);
    scrollTopBtn.hidden = !show;
  }

  global.addEventListener("scroll", updateScrollTop, { passive: true });
  updateScrollTop();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      global.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navMenu.classList.toggle("is-open", open);
    documentRef.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (global.matchMedia("(max-width: 768px)").matches) {
          setMenuOpen(false);
        }
      });
    });

    global.addEventListener("resize", function () {
      if (global.innerWidth > 768) {
        setMenuOpen(false);
      }
    });
  }

  function updateActiveNav() {
    const current = getActiveSectionId({
      scrollY: global.scrollY,
      viewportHeight: global.innerHeight,
      documentHeight: documentRef.documentElement.scrollHeight,
      headerHeight: header ? header.offsetHeight : 60,
      sections: Array.from(sections, function (section) {
        return {
          id: section.getAttribute("id") || "",
          offsetTop: section.offsetTop,
        };
      }),
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      link.classList.toggle("is-active", href.slice(1) === current);
    });
  }

  global.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  const reduceMotion = global.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const revealEls = documentRef.querySelectorAll("[data-reveal]");

  if (!reduceMotion && revealEls.length && "IntersectionObserver" in global) {
    const observer = new global.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.hidden = false;
      formStatus.classList.remove("is-error");
      formStatus.textContent =
        "Thanks for your message. Connect Formspree, Web3Forms, or EmailJS to deliver inquiries to your inbox.";
      contactForm.reset();
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
