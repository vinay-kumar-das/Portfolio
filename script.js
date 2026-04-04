(function () {
  "use strict";

  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const yearEl = document.getElementById("year");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const scrollTopBtn = document.getElementById("scroll-top");

  function hideLoader() {
    document.body.classList.add("is-ready");
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header shadow on scroll */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Scroll-to-top visibility */
  function updateScrollTop() {
    if (!scrollTopBtn) return;
    var show = window.scrollY > 480;
    scrollTopBtn.classList.toggle("is-visible", show);
    scrollTopBtn.hidden = !show;
  }

  window.addEventListener("scroll", updateScrollTop, { passive: true });
  updateScrollTop();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Mobile menu */
  function setMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setMenuOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    });
  }

  /* Active nav link from scroll position */
  function updateActiveNav() {
    const scrollY = window.scrollY;
    const headerOffset = header ? header.offsetHeight + 40 : 100;
    const docEl = document.documentElement;
    const nearBottom =
      window.innerHeight + scrollY >= docEl.scrollHeight - 40;

    let current = "";
    if (nearBottom) {
      current = "contact";
    } else {
      sections.forEach(function (section) {
        const top = section.offsetTop;
        if (scrollY >= top - headerOffset) {
          current = section.getAttribute("id") || "";
        }
      });
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      const id = href.slice(1);
      link.classList.toggle("is-active", id === current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* Scroll reveal */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
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

  /* Contact form (demo: no backend) */
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.hidden = false;
      formStatus.classList.remove("is-error");
      formStatus.textContent =
        "Thanks for your message. Connect Formspree, Web3Forms, or EmailJS to deliver inquiries to your inbox.";
      contactForm.reset();
    });
  }
})();
