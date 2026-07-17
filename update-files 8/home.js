/* Homepage "Latest from the box" — renders the newest articles from the same
   content the Resource Hub uses (content/articles.json, via TBBStore), so the
   homepage updates automatically whenever you publish in the CMS.

   Podcasts live on the Resource Hub, not here. If there are no articles yet,
   the whole section hides itself and a short "coming soon" line shows instead,
   so the homepage never displays an empty grid. */

(function () {
  var S = window.TBBStore;
  var fmt = window.TBB_fmtDate || function (s) { return s; };
  var LIMIT = 4;

  var section = document.getElementById('content');
  var list = document.getElementById('home-latest');
  var empty = document.getElementById('home-latest-empty');
  if (!S || !section || !list) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    var arts = S.all().filter(function (p) { return p.type !== 'podcast'; }).slice(0, LIMIT);

    if (!arts.length) {
      list.innerHTML = '';
      list.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    list.hidden = false;
    list.innerHTML = arts.map(function (p) {
      return '<a class="post" href="article.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<image-slot id="' + window.TBB_coverId(p) + '" src="' + window.TBB_coverSrc(p) + '" placeholder="Cover"></image-slot>' +
        '<div><span class="cat">' + esc(p.category) + '</span><h3>' + esc(p.title) + '</h3></div>' +
        '<span class="date">' + esc(fmt(p.date)) + '</span>' +
      '</a>';
    }).join('');
  }

  S.ready(render);
})();
