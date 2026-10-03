(function () {
  "use strict";

  /* Nav mobile */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("primary-nav");
  var navClose = document.getElementById("nav-close");
  var scrim = document.getElementById("nav-scrim");

  function openNav() {
    nav.setAttribute("data-open", "true");
    scrim.setAttribute("data-open", "true");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    nav.setAttribute("data-open", "false");
    scrim.setAttribute("data-open", "false");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger) burger.addEventListener("click", openNav);
  if (navClose) navClose.addEventListener("click", closeNav);
  if (scrim) scrim.addEventListener("click", closeNav);

  /* Reveal on scroll (avec filet de sécurité anti-blocage) */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px 0px 0px" }
      );
      reveals.forEach(function (el) { io.observe(el); });
    }

    /* Filet de sécurité : un scroll rapide/synthétique peut sauter la
       fenêtre d'intersection sans déclencher l'observer. On force donc
       la révélation de tout élément déjà entré (ou dépassé) dans le viewport. */
    var pending = true;
    function sweepReveals() {
      pending = false;
      var vh = window.innerHeight;
      reveals.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < vh) {
          el.classList.add("is-visible");
        }
      });
    }
    function scheduleSweep() {
      if (!pending) {
        pending = true;
        requestAnimationFrame(sweepReveals);
      }
    }
    window.addEventListener("scroll", scheduleSweep, { passive: true });
    window.addEventListener("resize", scheduleSweep, { passive: true });
    scheduleSweep();
  }

  /* Menu tabs (carte.html) */
  var tabs = document.querySelectorAll(".menu-tab");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = document.getElementById(tab.getAttribute("data-target"));
        if (target) {
          var offset = target.getBoundingClientRect().top + window.scrollY - (78 + 20);
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      });
    });

    var sections = document.querySelectorAll(".menu-section");
    if ("IntersectionObserver" in window && sections.length) {
      var tabIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              tabs.forEach(function (t) {
                t.setAttribute("aria-selected", t.getAttribute("data-target") === entry.target.id ? "true" : "false");
              });
            }
          });
        },
        { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" }
      );
      sections.forEach(function (s) { tabIo.observe(s); });
    }
  }

  /* Sticky order bar (mobile) */
  var stickyBar = document.getElementById("order-sticky");
  if (stickyBar) {
    var heroEl = document.querySelector(".hero, .page-hero");
    var shown = false;
    window.addEventListener("scroll", function () {
      var shouldShow = window.scrollY > 420;
      if (shouldShow !== shown) {
        shown = shouldShow;
        stickyBar.setAttribute("data-show", shown ? "true" : "false");
      }
    }, { passive: true });
  }

  /* Année footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
