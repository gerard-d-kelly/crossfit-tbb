/* TBBStore — content layer for the Resource Hub.

   Articles are managed in the CMS and live in content/articles.json. This
   store fetches that file once at page load, merges in the podcast episodes
   from posts.js (which are pulled live from Spotify), and exposes a small,
   synchronous read API once data is ready.

   Consumers call TBBStore.ready(fn) and render inside the callback, so the
   page paints as soon as the content is in. If the JSON can't be fetched
   (e.g. opening the files directly off disk with file://), the store falls
   back to the seed articles baked into posts.js, so the site still renders.

   There is no client-side admin / auth anymore — publishing happens through
   the CMS, which commits to the repo and triggers a fresh deploy. */

window.TBBStore = (function () {
  var DATA = [];          // normalized articles (from JSON or seed fallback)
  var loaded = false;
  var waiters = [];

  function normalize(p) {
    p = Object.assign({}, p);
    p.tags = p.tags || [];
    if (!p.read) p.read = window.TBB_readTime ? window.TBB_readTime(p.body || '') : '';
    return p;
  }

  function episodes() { return (window.TBB_EPISODES || []).map(normalize); }

  function setArticles(arr) {
    DATA = (arr || []).map(normalize);
    loaded = true;
    var fns = waiters.slice(); waiters.length = 0;
    fns.forEach(function (fn) { try { fn(); } catch (e) {} });
    try { window.dispatchEvent(new CustomEvent('tbb:loaded')); } catch (e) {}
  }

  /* Run fn once article data is ready (immediately if already loaded). */
  function ready(fn) { if (typeof fn !== 'function') return; if (loaded) fn(); else waiters.push(fn); }

  /* ── Load content/articles.json, fall back to the seed in posts.js ─────── */
  (function load() {
    try {
      fetch('content/articles.json', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) { setArticles((j && j.articles) || []); })
        .catch(function () { setArticles(window.TBB_POSTS || []); });
    } catch (e) {
      setArticles(window.TBB_POSTS || []);
    }
  })();

  /* All articles + episodes, newest first. */
  function all() {
    var list = DATA.concat(episodes());
    list.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    return list;
  }

  function get(slug) {
    var hit = all().filter(function (p) { return p.slug === slug; })[0];
    return hit || null;
  }

  /* The featured hero article (explicit flag, else newest). Podcasts never
     take the hero slot. */
  function featured() {
    var arts = all().filter(function (p) { return p.type !== 'podcast'; });
    return arts.filter(function (p) { return p.featured; })[0] || arts[0] || null;
  }

  /* Every non-featured item (the grid). */
  function grid() {
    var feat = featured();
    return all().filter(function (p) { return !feat || p.slug !== feat.slug; });
  }

  function categories() {
    var cats = ['All'];
    all().forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
    return cats;
  }

  function slugify(t) {
    return String(t || '').toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60) || 'article';
  }

  return {
    ready: ready,
    all: all, get: get, featured: featured, grid: grid, categories: categories,
    slugify: slugify,
    /* kept so older callers don't throw; the live site is read-only */
    isAdmin: function () { return false; }
  };
})();
