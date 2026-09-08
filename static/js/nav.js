/*
 * Mobile nav: leaf toggle + full-page drawer.
 *
 * The toggle is rendered `hidden` and unhidden here, so a page with broken or
 * blocked JS keeps the ordinary inline menu instead of showing a button that
 * does nothing.
 *
 * The drawer is only ever opened at mobile widths; if the viewport grows past
 * the breakpoint while it is open (rotation, desktop resize) it closes itself,
 * otherwise scroll would stay locked behind a drawer that CSS has hidden.
 */
(function () {
  "use strict";

  var MOBILE = "(max-width: 768px)";

  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("site-drawer");
  if (!toggle || !drawer) return;

  var mq = window.matchMedia(MOBILE);
  var open = false;

  toggle.hidden = false;

  function setOpen(next) {
    if (next === open) return;
    open = next;

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("drawer-open", open);
    toggle.classList.toggle("is-open", open);

    if (open) {
      drawer.hidden = false;
      // Force a reflow so the browser registers the hidden-to-visible change
      // before the class starts the transition; otherwise it jumps straight to
      // the end state. A reflow is synchronous, unlike rAF, which does not fire
      // at all in a tab that is not compositing.
      void drawer.offsetHeight;
      drawer.classList.add("is-open");
      document.addEventListener("keydown", onKey);
    } else {
      drawer.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      var done = function () {
        if (!open) drawer.hidden = true;
        drawer.removeEventListener("transitionend", done);
      };
      drawer.addEventListener("transitionend", done);
      // Belt and braces: if the transition is suppressed (reduced motion, a
      // background tab) transitionend never fires.
      setTimeout(done, 400);
    }
  }

  function onKey(e) {
    if (e.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!open);
  });

  // Following a link should not leave the drawer open behind the new page in
  // browsers that restore from bfcache.
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  function onChange(e) {
    if (!e.matches) setOpen(false);
  }
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) setOpen(false);
  });
})();
