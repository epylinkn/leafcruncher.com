/*
 * Lightbox for work-page photos.
 *
 * Reads the images already on the page (every `figure.hero` inside the
 * article) rather than requiring a gallery shortcode, so existing pages and
 * anything written later are covered without touching content. A figure
 * wrapped in its own link is skipped — that link is the author's intent.
 *
 * Opens the image at `img.src`, which the hero shortcode sets to the full
 * resource; the srcset only ever serves smaller variants to the page itself.
 */
(function () {
  "use strict";

  var figures = [];
  var items = [];
  var index = 0;
  var overlay, imgEl, counterEl, captionEl, lastFocused;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function collect() {
    var article = document.querySelector(".article");
    if (!article) return;
    figures = Array.prototype.slice
      .call(article.querySelectorAll("figure.hero"))
      .filter(function (fig) {
        return fig.querySelector("img") && !fig.querySelector("a");
      });

    items = figures.map(function (fig) {
      var img = fig.querySelector("img");
      var credit = fig.querySelector(".credit");
      var caption = fig.querySelector("figcaption p");
      return {
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt") || "",
        credit: credit ? credit.textContent.trim() : "",
        caption: caption ? caption.textContent.trim() : ""
      };
    });
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo viewer");
    overlay.hidden = true;
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<button class="lightbox-next" type="button" aria-label="Next photo">&#8250;</button>' +
      '<div class="lightbox-stage"><img class="lightbox-image" alt="" /></div>' +
      '<div class="lightbox-bar">' +
      '<span class="lightbox-counter"></span>' +
      '<span class="lightbox-caption"></span>' +
      "</div>";
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector(".lightbox-image");
    counterEl = overlay.querySelector(".lightbox-counter");
    captionEl = overlay.querySelector(".lightbox-caption");

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.querySelector(".lightbox-prev").addEventListener("click", function (e) {
      e.stopPropagation();
      go(-1);
    });
    overlay.querySelector(".lightbox-next").addEventListener("click", function (e) {
      e.stopPropagation();
      go(1);
    });
    // A tap on the backdrop closes; a tap on the photo itself does not.
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("lightbox-stage")) close();
    });

    addSwipe();
  }

  function preload(i) {
    if (i < 0 || i >= items.length) return;
    var p = new Image();
    p.src = items[i].src;
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    counterEl.textContent = items.length > 1 ? index + 1 + " / " + items.length : "";
    captionEl.textContent = item.credit || item.caption || "";
    preload(index + 1);
    preload(index - 1);
  }

  function go(delta) {
    if (items.length < 2) return;
    show(index + delta);
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    overlay.hidden = false;
    document.documentElement.classList.add("lightbox-open");
    if (reduceMotion) overlay.classList.add("no-motion");
    overlay.querySelector(".lightbox-close").focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    overlay.hidden = true;
    document.documentElement.classList.remove("lightbox-open");
    document.removeEventListener("keydown", onKey);
    imgEl.removeAttribute("src");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  }

  function addSwipe() {
    var startX = 0;
    var startY = 0;
    var tracking = false;

    overlay.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1) return;
        tracking = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    overlay.addEventListener(
      "touchend",
      function (e) {
        if (!tracking) return;
        tracking = false;
        var touch = e.changedTouches[0];
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        // Horizontal intent only, so a vertical flick doesn't change photo.
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );
  }

  function init() {
    collect();
    if (!items.length) return;
    build();
    figures.forEach(function (fig, i) {
      var img = fig.querySelector("img");
      fig.classList.add("is-zoomable");
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", function () {
        open(i);
      });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
