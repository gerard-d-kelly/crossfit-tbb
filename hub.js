/* Resource Hub grid: featured + article cards from TBBStore, with working
   search / category / tag filters. Articles are managed in the CMS; podcasts
   are pulled live from Spotify lower on the page. */
(function () {
  var S = window.TBBStore;
  var SP = window.TBBSpotify;
  var fmt = window.TBB_fmtDate || function (s) { return s; };

  var grid = document.getElementById('hub-grid');
  var empty = document.getElementById('hub-empty');
  var resultLine = document.getElementById('result-line');
  var catWrap = document.getElementById('cat-filter');
  var tagRow = document.getElementById('tag-row');
  var searchEl = document.getElementById('hub-search');
  var featSlot = document.getElementById('featured-slot');
  if (!grid) return;

  var state = { q: '', cat: 'All', tag: null };

  // ---- Featured ----
  function renderFeatured() {
    if (!featSlot) return;
    var p = S.featured();
    featSlot.innerHTML = '';
    if (!p) return;
    var a = document.createElement('a');
    a.className = 'featured';
    a.href = 'article.html?slug=' + encodeURIComponent(p.slug);
    a.innerHTML =
      '<div class="ft-media">' +
        '<span class="ft-flag">Featured</span>' +
        '<image-slot id="' + window.TBB_coverId(p) + '" src="' + window.TBB_coverSrc(p) + '" shape="rect" placeholder="Drop a featured cover photo"></image-slot>' +
      '</div>' +
      '<div class="ft-body">' +
        '<span class="ft-cat">' + esc(p.category) + '</span>' +
        '<h2>' + esc(p.title) + '</h2>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<div class="ft-meta">' +
          '<span>' + esc(p.author) + '</span><span class="dotsep"></span>' +
          '<span>' + fmt(p.date) + '</span><span class="dotsep"></span>' +
          '<span>' + esc(p.read) + '</span>' +
        '</div>' +
      '</div>';
    featSlot.appendChild(a);
  }

  // ---- Filters ----
  function renderFilters() {
    // categories
    catWrap.innerHTML = '';
    S.categories().forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'cat-chip' + (c === state.cat ? ' active' : '');
      b.type = 'button';
      b.textContent = c;
      b.addEventListener('click', function () { state.cat = c; render(); });
      catWrap.appendChild(b);
    });
    // popular tags
    tagRow.innerHTML = '<span class="tag-lead"><svg><use href="#i-hash"></use></svg> Popular</span>';
    var freq = {};
    S.all().forEach(function (p) { (p.tags || []).forEach(function (t) { freq[t] = (freq[t] || 0) + 1; }); });
    Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 8).forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'tag-chip' + (state.tag === t ? ' active' : '');
      b.type = 'button';
      b.textContent = t;
      b.addEventListener('click', function () { state.tag = (state.tag === t) ? null : t; render(); });
      tagRow.appendChild(b);
    });
  }

  // ---- Card ----
  function card(p) {
    if (p.type === 'podcast') return podcastCard(p);
    var a = document.createElement('a');
    a.className = 'hub-card';
    a.href = 'article.html?slug=' + encodeURIComponent(p.slug);
    a.innerHTML =
      '<div class="hc-media">' +
        '<span class="hc-cat">' + esc(p.category) + '</span>' +
        '<image-slot id="' + window.TBB_coverId(p) + '" src="' + window.TBB_coverSrc(p) + '" shape="rect" placeholder="Cover"></image-slot>' +
      '</div>' +
      '<div class="hc-body">' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<div class="hc-meta">' +
          '<span>' + esc(p.author) + '</span><span class="dotsep"></span>' +
          '<span>' + fmt(p.date) + '</span><span class="dotsep"></span>' +
          '<span>' + esc(p.read) + '</span>' +
        '</div>' +
      '</div>';
    return a;
  }

  // ---- Podcast card (artwork + live title pulled from Spotify) ----
  function podcastCard(p) {
    var a = document.createElement('a');
    a.className = 'hub-card podcast-card';
    a.href = SP ? SP.canonical(p.spotifyUrl) : p.spotifyUrl;
    a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML =
      '<div class="hc-media">' +
        '<span class="hc-cat hc-cat-pod"><svg><use href="#i-spotify"></use></svg> Podcast</span>' +
        '<div class="hc-cover" data-cover style="background-image:url(\'assets/covers/podcast.png\')"></div>' +
        '<span class="hc-play"><svg><use href="#i-play"></use></svg></span>' +
      '</div>' +
      '<div class="hc-body">' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="hc-latest" data-latest></p>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<div class="hc-meta"><span>Listen on Spotify</span><span class="dotsep"></span><span>' + fmt(p.date) + '</span></div>' +
      '</div>';
    // open the live player instead of navigating
    a.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-edit]')) return;
      e.preventDefault();
      if (SP) SP.openLightbox(p.spotifyUrl, p.title); else window.open(a.href, '_blank', 'noopener');
    });
    // live artwork + latest-episode title
    if (SP) SP.oembed(p.spotifyUrl).then(function (d) {
      if (!d) return;
      if (d.thumb) { var c = a.querySelector('[data-cover]'); if (c) c.style.backgroundImage = 'url("' + d.thumb + '")'; }
      var lt = a.querySelector('[data-latest]');
      if (lt && d.title) { lt.textContent = 'Latest: ' + d.title; lt.style.display = 'block'; }
    });
    return a;
  }

  // ---- Filtering ----
  function matches(p) {
    if (state.cat !== 'All' && p.category !== state.cat) return false;
    if (state.tag && (p.tags || []).indexOf(state.tag) === -1) return false;
    if (state.q) {
      var hay = (p.title + ' ' + p.excerpt + ' ' + p.category + ' ' + (p.tags || []).join(' ')).toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) { if (hay.indexOf(terms[i]) === -1) return false; }
    }
    return true;
  }

  function render() {
    renderFeatured();
    renderFilters();
    var list = S.grid().filter(matches);
    grid.innerHTML = '';
    list.forEach(function (p) { grid.appendChild(card(p)); });

    var filtered = state.q || state.cat !== 'All' || state.tag;
    empty.style.display = list.length ? 'none' : 'block';
    grid.style.display = list.length ? 'grid' : 'none';

    var label = '<b>' + list.length + '</b> article' + (list.length === 1 ? '' : 's');
    if (state.cat !== 'All') label += ' in <b>' + esc(state.cat) + '</b>';
    if (state.tag) label += ' tagged <b>#' + esc(state.tag) + '</b>';
    if (state.q) label += ' for &ldquo;<b>' + esc(state.q) + '</b>&rdquo;';
    if (filtered) label += '<span class="clearf" id="clearf">Clear filters</span>';
    resultLine.innerHTML = label;
    var clear = document.getElementById('clearf');
    if (clear) clear.addEventListener('click', function () {
      state = { q: '', cat: 'All', tag: null };
      if (searchEl) searchEl.value = '';
      render();
    });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  if (searchEl) {
    var t;
    searchEl.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = searchEl.value.trim(); render(); }, 120);
    });
  }

  S.ready(render);
})();
