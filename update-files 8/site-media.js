/* TBB site media — applies the homepage media managed in the CMS
   (content/site.json) at runtime, so photos and the hero video can be
   swapped through /admin with no code changes.

   Every field is optional. When a field is empty the page keeps the
   tasteful placeholder it ships with, so the site always looks complete.

   Fields (all paths relative to the site root, e.g. "assets/uploads/hero.mp4"):
     hero_kicker     → small line above the homepage headline
     hero_headline   → the big homepage headline
     hero_lede       → the supporting sentence under the headline
     hero_video      → plays as the cinematic homepage background (muted, looped)
     hero_image      → still hero photo (also the video's poster / fallback)
     recovery_image  → photo in the "Premium recovery" section
     recovery_video  → plays in the "Premium recovery" section (muted, looped)
     member1_photo   → avatar for the first member story
     member2_photo   → avatar for the second member story
     member3_photo   → avatar for the third member story */

(function () {
  function setSlot(id, url) {
    if (!url) return;
    var el = document.getElementById(id);
    if (el) el.setAttribute('src', url);
  }

  function setText(id, text) {
    if (!text || !String(text).trim()) return;
    var el = document.getElementById(id);
    if (el) el.textContent = String(text).trim();
  }

  function applyHeroVideo(url, poster) {
    var vid = document.getElementById('hero-video');
    if (!vid || !url) return;
    // Tolerate a path saved with or without a leading slash.
    if (!/^https?:|^\//.test(url)) url = '/' + url.replace(/^\.?\//, '');
    if (poster) vid.setAttribute('poster', poster);
    // Set the source directly so the browser sniffs the real format
    // (handles .mp4 / .webm / .mov without us guessing a MIME type).
    vid.setAttribute('src', url);
    vid.load();
    // Reveal the video layer over the still image and start it.
    vid.hidden = false;
    var p = vid.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked — poster shows */ });
    document.documentElement.setAttribute('data-hero-video', 'on');
  }

  function applyVideo(videoId, url, posterEl) {
    var vid = document.getElementById(videoId);
    if (!vid || !url) return;
    if (!/^https?:|^\//.test(url)) url = '/' + url.replace(/^\.?\//, '');
    vid.setAttribute('src', url);
    vid.load();
    vid.hidden = false;
    var p = vid.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked — photo shows */ });
  }

  function apply(data) {
    data = data || {};
    // Hero copy (kicker / headline / supporting line).
    setText('hero-kicker', data.hero_kicker);
    setText('hero-headline', data.hero_headline);
    setText('hero-lede', data.hero_lede);
    setSlot('hero-a-img', data.hero_image);
    setSlot('hero-b-img', data.hero_image);
    // Recovery + member photos.
    setSlot('recovery-img', data.recovery_image);
    setSlot('story-1-av', data.member1_photo);
    setSlot('story-2-av', data.member2_photo);
    setSlot('story-3-av', data.member3_photo);
    // Cinematic hero video (uses hero_image as poster if present).
    applyHeroVideo(data.hero_video, data.hero_image || 'assets/ph-hero.png');
    // Recovery showreel video (sits over the recovery photo when set).
    applyVideo('recovery-video', data.recovery_video);
  }

  /* ── Section copy (content/copy.json) ─────────────────────────────────
     Every element tagged data-copy="a.b.c" gets its text from the matching
     nested key. Empty/missing keys leave the built-in copy untouched. */
  function applyCopy(data, prefix) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(function (k) {
      var key = prefix ? prefix + '.' + k : k;
      var v = data[k];
      if (v && typeof v === 'object') { applyCopy(v, key); return; }
      if (v == null || !String(v).trim()) return;
      var el = document.querySelector('[data-copy="' + key + '"]');
      if (el) el.textContent = String(v).trim();
    });
  }

  function load() {
    try {
      fetch('content/site.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(apply)
        .catch(function () { /* keep placeholders */ });
      fetch('content/copy.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (j) { applyCopy(j, ''); })
        .catch(function () { /* keep built-in copy */ });
    } catch (e) { /* keep placeholders */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
