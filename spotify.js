/* TBBSpotify — client-side helpers for pulling podcast data straight from
   Spotify with no backend or API key:
     • parse(url)      → { type, id }
     • canonical(url)  → clean open.spotify.com URL
     • embedSrc(url)   → player iframe URL
     • oembed(url)     → Promise<{title, thumb}>  (live title + artwork, cached)
     • openLightbox(url, label) → modal with the live player + subscribe link
*/
window.TBBSpotify = (function () {
  var CACHE_KEY = 'tbb-oembed';

  function parse(url) {
    var m = String(url || '').match(/open\.spotify\.com\/(?:embed\/)?(show|episode|track|playlist)\/([A-Za-z0-9]+)/);
    return m ? { type: m[1], id: m[2] } : null;
  }
  function canonical(url) {
    var p = parse(url);
    return p ? 'https://open.spotify.com/' + p.type + '/' + p.id : (url || '');
  }
  function embedSrc(url) {
    var p = parse(url);
    return p ? 'https://open.spotify.com/embed/' + p.type + '/' + p.id + '?utm_source=generator&theme=0' : '';
  }

  function readCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { return {}; } }
  function writeCache(c) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch (e) {} }

  // Cache-first; refreshes in the background so artwork stays current.
  function oembed(url) {
    var key = canonical(url);
    if (!key) return Promise.resolve(null);
    var cache = readCache();
    var hit = cache[key] || null;
    var net = fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(key))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return hit;
        var d = { title: j.title || '', thumb: j.thumbnail_url || '' };
        cache[key] = d; writeCache(cache);
        return d;
      })
      .catch(function () { return hit; });
    return hit ? Promise.resolve(hit) : net;
  }
  // Always hit the network (used by the editor's auto-fill).
  function fetchMeta(url) {
    var key = canonical(url);
    if (!key) return Promise.resolve(null);
    return fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(key))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return null;
        var d = { title: j.title || '', thumb: j.thumbnail_url || '' };
        var c = readCache(); c[key] = d; writeCache(c);
        return d;
      })
      .catch(function () { return null; });
  }

  // ── Lightbox player ──────────────────────────────────────────────────────
  var lb = null;
  function buildLightbox() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'pod-modal';
    lb.hidden = true;
    lb.innerHTML =
      '<div class="pod-modal-card" role="dialog" aria-label="Podcast player">' +
      '  <div class="pod-modal-head">' +
      '    <span class="pod-modal-spot"><svg><use href="#i-spotify"></use></svg></span>' +
      '    <span class="pod-modal-title">The TBB Podcast</span>' +
      '    <button class="adm-close pod-modal-x" type="button" aria-label="Close">' +
      '      <svg><use href="#i-x"></use></svg></button>' +
      '  </div>' +
      '  <div class="pod-modal-player"></div>' +
      '  <a class="btn btn-primary pod-modal-sub" target="_blank" rel="noopener">Open in Spotify' +
      '    <svg style="width:16px;height:16px"><use href="#i-arrow-up-right"></use></svg></a>' +
      '</div>';
    document.body.appendChild(lb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    lb.querySelector('.pod-modal-x').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });
    return lb;
  }
  function openLightbox(url, label) {
    var src = embedSrc(url);
    if (!src) { window.open(canonical(url), '_blank', 'noopener'); return; }
    buildLightbox();
    lb.querySelector('.pod-modal-title').textContent = label || 'The TBB Podcast';
    lb.querySelector('.pod-modal-sub').href = canonical(url);
    lb.querySelector('.pod-modal-player').innerHTML =
      '<iframe title="Spotify player" src="' + src + '" width="100%" height="352" frameborder="0" ' +
      'loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb) return;
    lb.hidden = true;
    lb.querySelector('.pod-modal-player').innerHTML = ''; // stop playback
    document.body.style.overflow = '';
  }

  return { parse: parse, canonical: canonical, embedSrc: embedSrc, oembed: oembed, fetchMeta: fetchMeta, openLightbox: openLightbox, closeLightbox: closeLightbox };
})();
