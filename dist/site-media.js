/* TBB site media — applies the homepage media managed in the CMS
   (content/site.json) at runtime, so photos and the hero video can be
   swapped through /admin with no code changes.

   Every field is optional. When a field is empty the page keeps the
   tasteful placeholder it ships with, so the site always looks complete.

   Fields (all paths relative to the site root, e.g. "assets/uploads/hero.mp4"):
     hero_video      → plays as the cinematic homepage background (muted, looped)
     hero_image      → still hero photo (also the video's poster / fallback)
     recovery_image  → photo in the "Premium recovery" section
     member1_photo   → avatar for the first member story
     member2_photo   → avatar for the second member story
     member3_photo   → avatar for the third member story */

(function () {
  function setSlot(id, url) {
    if (!url) return;
    var el = document.getElementById(id);
    if (el) el.setAttribute('src', url);
  }

  function applyHeroVideo(url, poster) {
    var vid = document.getElementById('hero-video');
    if (!vid || !url) return;
    if (poster) vid.setAttribute('poster', poster);
    // Build a <source> so the browser can pick the format.
    var src = document.createElement('source');
    src.src = url;
    src.type = url.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
    vid.appendChild(src);
    vid.load();
    // Reveal the video layer over the still image and start it.
    vid.hidden = false;
    var p = vid.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked — poster shows */ });
    document.documentElement.setAttribute('data-hero-video', 'on');
  }

  function apply(data) {
    data = data || {};
    // Hero stills (both layout variants share the same photo).
    setSlot('hero-a-img', data.hero_image);
    setSlot('hero-b-img', data.hero_image);
    // Recovery + member photos.
    setSlot('recovery-img', data.recovery_image);
    setSlot('story-1-av', data.member1_photo);
    setSlot('story-2-av', data.member2_photo);
    setSlot('story-3-av', data.member3_photo);
    // Cinematic hero video (uses hero_image as poster if present).
    applyHeroVideo(data.hero_video, data.hero_image || 'assets/ph-hero.png');
  }

  function load() {
    try {
      fetch('content/site.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(apply)
        .catch(function () { /* keep placeholders */ });
    } catch (e) { /* keep placeholders */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
