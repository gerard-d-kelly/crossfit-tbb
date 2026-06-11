/* Mobile nav menu — shared across all TBB pages.
   Reveals the existing .nav-links as a dropdown panel under the header when
   the hamburger is tapped. No-ops on desktop (the button is display:none ≥960px).
   Event-bound directly; closes on link click, outside click, Escape, or when
   the viewport grows back past the breakpoint. */
(function () {
  function init() {
    var nav = document.querySelector('.nav');
    var btn = nav && nav.querySelector('.nav-toggle');
    var links = nav && nav.querySelector('.nav-links');
    if (!nav || !btn || !links) return;

    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains('nav-open'));
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
