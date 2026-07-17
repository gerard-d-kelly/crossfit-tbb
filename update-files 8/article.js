/* Article page: hydrate everything from TBBStore by ?slug=, render the stored
   body, wire share + comments, and (for admins) an Edit button. */
(function () {
  var S = window.TBBStore;
  var fmt = window.TBB_fmtDate || function (s) { return s; };

  function param(name) { return new URLSearchParams(window.location.search).get(name); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  S.ready(function () {
  var slug = param('slug');
  var post = (slug && S.get(slug)) || S.featured();

  // Podcasts live on the hub, not as standalone article pages.
  if (post && post.type === 'podcast') { location.replace('resource-hub.html#podcast'); return; }

  if (!post) {
    document.title = 'Article not found — CrossFit TBB';
    var nf;
    nf = document.getElementById('art-cat'); if (nf) nf.textContent = '';
    nf = document.getElementById('art-title'); if (nf) nf.textContent = 'Article not found';
    nf = document.querySelector('.art-byline'); if (nf) nf.style.display = 'none';
    nf = document.querySelector('.art-hero'); if (nf) nf.style.display = 'none';
    var body = document.getElementById('art-body');
    if (body) body.innerHTML = '<p>This article could not be found, or hasn\'t been published yet. <a href="resource-hub.html">Back to the Resource Hub</a>.</p>';
    return;
  }

  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  document.title = post.title + ' — CrossFit TBB';
  setText('art-cat', post.category);
  setText('art-title', post.title);
  setText('art-author', post.author);
  setText('art-meta', post.role + ' · ' + fmt(post.date) + ' · ' + post.read);

  // Body (Markdown from the CMS, or HTML from the seed fallback)
  var bodyEl = document.getElementById('art-body');
  if (bodyEl) bodyEl.innerHTML = post.body
    ? (window.TBB_md ? window.TBB_md(post.body) : post.body)
    : '<p>' + esc(post.excerpt) + '</p>';

  // Images — cover doubles as the article hero; avatar is shared per author.
  var hero = document.getElementById('art-hero');
  if (hero) { hero.id = window.TBB_coverId(post); hero.setAttribute('src', window.TBB_coverSrc(post)); }
  var av = document.getElementById('art-author-av');
  if (av) { av.id = window.TBB_avatarId(post); av.setAttribute('src', window.TBB_avatarSrc(post)); }

  // Tags
  var tagWrap = document.getElementById('art-tags');
  if (tagWrap) {
    tagWrap.innerHTML = '';
    (post.tags || []).forEach(function (t) {
      var a = document.createElement('a');
      a.href = 'resource-hub.html';
      a.textContent = t;
      tagWrap.appendChild(a);
    });
  }

  // Related: same category first, then others; exclude self.
  var related = document.getElementById('related-grid');
  if (related) {
    related.innerHTML = '';
    var pool = S.all().filter(function (p) { return p.slug !== post.slug && p.type !== 'podcast'; });
    pool.sort(function (a, b) {
      return ((a.category === post.category) ? 0 : 1) - ((b.category === post.category) ? 0 : 1);
    });
    pool.slice(0, 3).forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'hub-card';
      a.href = 'article.html?slug=' + encodeURIComponent(p.slug);
      a.innerHTML =
        '<div class="hc-media">' +
          '<span class="hc-cat">' + esc(p.category) + '</span>' +
          '<image-slot id="' + window.TBB_coverId(p) + '" src="' + window.TBB_coverSrc(p) + '" placeholder="Cover"></image-slot>' +
        '</div>' +
        '<div class="hc-body">' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.excerpt) + '</p>' +
          '<div class="hc-meta"><span>' + esc(p.author) + '</span><span class="dotsep"></span><span>' + fmt(p.date) + '</span></div>' +
        '</div>';
      related.appendChild(a);
    });
  }

  // ---- Share buttons ----
  var url = window.location.href;
  var title = post.title;
  var enc = encodeURIComponent;
  function setHref(id, href) { var el = document.getElementById(id); if (el) el.href = href; }
  setHref('sh-x-top', 'https://twitter.com/intent/tweet?url=' + enc(url) + '&text=' + enc(title));
  setHref('sh-x-foot', 'https://twitter.com/intent/tweet?url=' + enc(url) + '&text=' + enc(title));
  setHref('sh-ig-top', 'https://www.instagram.com/crossfit_tbb');
  setHref('sh-ig-foot', 'https://www.instagram.com/crossfit_tbb');
  setHref('sh-li-foot', 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url));

  function wireCopy(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var done = function () {
        var old = btn.innerHTML;
        btn.innerHTML = '<svg><use href="#i-check"></use></svg>';
        btn.style.color = 'var(--accent)';
        setTimeout(function () { btn.innerHTML = old; btn.style.color = ''; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else done();
    });
  }
  wireCopy('sh-copy-top');
  wireCopy('sh-copy-foot');

  // Comments are handled by Giscus (comments.js) — real, persistent threads
  // backed by GitHub Discussions. No client-side comment code lives here.
  });
})();
