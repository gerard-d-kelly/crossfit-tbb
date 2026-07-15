// @ds-adherence-ignore -- companion to image-slot.js (raw elements/px by design)
/* BEGIN USAGE */
/**
 * <video-slot> — user-fillable VIDEO placeholder. The motion sibling of
 * <image-slot>.
 *
 * Drop it wherever you want the user to supply a short looping clip (a hero
 * background, a recovery-suite showreel, etc). The user fills it by dragging a
 * video file onto it (or clicking to browse). It plays muted + looped +
 * autoplaying, like a background film, with an optional sound toggle.
 *
 * The dropped clip persists across reloads via a .video-slots.state.json
 * sidecar — same read-via-fetch / write-via-window.omelette pattern as
 * image-slot.js, so it shows on share links and downloaded zips. Outside the
 * omelette runtime the slot is read-only (it just plays whatever is stored).
 *
 * Because a video is far larger than an image, only clips under MAX_PERSIST_MB
 * are written to the sidecar; bigger files still play for the session but
 * can't survive a reload (the user is told). Keep source clips short and
 * compressed (a few seconds of 720p H.264/WebM is ideal).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload.
 *   radius       Corner radius in px.                       (default 12)
 *   fit          object-fit: cover | contain.              (default 'cover')
 *   placeholder  Empty-state caption.            (default 'Drop a video clip')
 *   poster       Optional poster image URL shown before play / as fallback.
 *   src          Optional initial/fallback video URL. A user drop overrides it.
 *   sound        Present → show an unmute toggle (clip still starts muted so
 *                autoplay is allowed).
 *
 * Size and layout come from ordinary CSS on the element (width/height inline
 * or from a parent), exactly like <image-slot>.
 *
 *   <video-slot id="recovery-vid" sound style="width:100%;height:520px"
 *               placeholder="Drop a recovery-suite clip"></video-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.video-slots.state.json';
  const ACCEPT = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  // Clips bigger than this play for the session but are NOT written to the
  // sidecar (base64 in JSON gets unwieldy fast). Tuned for short web loops.
  const MAX_PERSIST_MB = 12;

  // ── Shared sidecar store (one fetch + write-on-change for the whole page) ──
  const subs = new Set();
  let slots = {};
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;

  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && typeof j === 'object') {
          const merged = Object.assign({}, j, slots);
          for (const id of tombstones) delete merged[id];
          slots = merged;
        }
        tombstones.clear();
      })
      .catch(() => {})
      .then(() => { loaded = true; subs.forEach((fn) => fn()); });
    return loadP;
  }

  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) { saveDirty = true; return; }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots)))
      .catch(() => {})
      .then(() => { saving = false; if (saveDirty) { saveDirty = false; save(); } });
  }

  function getSlot(id) { return id ? (slots[id] || null) : null; }
  function setSlot(id, val) {
    if (!id) return;
    if (val) { slots[id] = val; tombstones.delete(id); }
    else { delete slots[id]; if (!loaded) tombstones.add(id); }
    subs.forEach((fn) => fn());
    if (loaded) save(); else load().then(save);
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(fr.error || new Error('read failed'));
      fr.readAsDataURL(file);
    });
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const ACCENT = 'var(--accent, #A855D1)';
  const stylesheet =
    ':host{display:inline-block;position:relative;vertical-align:top;box-sizing:border-box;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:var(--muted,rgba(220,220,220,.6));' +
    '  width:240px;height:160px}' +
    '.frame{position:absolute;inset:0;overflow:hidden;border-radius:inherit;' +
    '  background:var(--surface,#2a2a2a)}' +
    '.frame video{position:absolute;inset:0;width:100%;height:100%;display:none;' +
    '  background:#000;-webkit-user-select:none;user-select:none}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:7px;text-align:center;padding:12px;box-sizing:border-box;' +
    '  cursor:pointer;user-select:none}' +
    '.empty svg{opacity:.5}' +
    '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' +
    '.empty .sub{font-size:11px;opacity:.85}' +
    '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.25)}' +
    '.empty:hover .sub u{color:var(--ink,#dcdcdc);text-decoration-color:currentColor}' +
    '.ring{position:absolute;inset:0;pointer-events:none;border-radius:inherit;' +
    '  border:1.5px dashed var(--border,rgba(255,255,255,.18));transition:border-color .12s}' +
    ':host([data-over]) .ring{border-color:' + ACCENT + '}' +
    ':host([data-over]) .frame{outline:2px solid ' + ACCENT + ';outline-offset:-2px}' +
    ':host([data-filled]) .ring{display:none}' +
    // floating controls, bottom-right
    '.ctl{position:absolute;right:12px;bottom:12px;display:flex;gap:6px;z-index:3;' +
    '  opacity:0;pointer-events:none;transition:opacity .14s}' +
    ':host([data-filled][data-editable]:hover) .ctl,:host([data-filled]) .ctl.always' +
    '  {opacity:1;pointer-events:auto}' +
    '.ctl button{appearance:none;border:0;border-radius:7px;height:30px;min-width:30px;' +
    '  padding:0 10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;' +
    '  background:rgba(0,0,0,.62);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' +
    '  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '.ctl button:hover{background:rgba(0,0,0,.82)}' +
    '.ctl button svg{width:15px;height:15px;display:block}' +
    // standalone sound toggle (when [sound]) sits bottom-left, always visible
    '.sound{position:absolute;left:12px;bottom:12px;z-index:3}' +
    '.note{position:absolute;left:10px;top:10px;right:10px;z-index:4;font-size:11px;' +
    '  color:#fff;background:rgba(0,0,0,.7);padding:6px 9px;border-radius:7px;' +
    '  line-height:1.35;pointer-events:none}' +
    '.busy{position:absolute;inset:0;display:none;align-items:center;justify-content:center;' +
    '  background:rgba(0,0,0,.45);z-index:5;color:#fff;font-size:12px}' +
    ':host([data-busy]) .busy{display:flex}';

  const filmIcon =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M7 4v16M17 4v16"/>' +
    '<path d="M2.5 9h4.5M2.5 15h4.5M17 9h4.5M17 15h4.5"/>' +
    '<path d="M10.5 9.2v5.6l4.2-2.8z" fill="currentColor" stroke="none"/></svg>';
  const svgReplace =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>' +
    '<path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>';
  const svgRemove =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2"/>' +
    '<path d="M6 6l1 14h10l1-14"/></svg>';
  const svgMuted =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/>' +
    '<path d="M22 9l-6 6M16 9l6 6"/></svg>';
  const svgSound =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/>' +
    '<path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

  class VideoSlot extends HTMLElement {
    static get observedAttributes() {
      return ['radius', 'fit', 'placeholder', 'poster', 'src', 'sound', 'id'];
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + stylesheet + '</style>' +
        '<div class="frame" part="frame">' +
        '  <video part="video" muted loop playsinline preload="metadata"></video>' +
        '  <div class="empty" part="empty">' + filmIcon +
        '    <div class="cap"></div>' +
        '    <div class="sub">or <u>browse files</u></div></div>' +
        '  <div class="ring" part="ring"></div>' +
        '  <div class="busy">Loading clip…</div>' +
        '</div>' +
        '<button class="sound" hidden></button>' +
        '<div class="ctl"><button data-act="replace" title="Replace video">' + svgReplace +
        '  Replace</button>' +
        '  <button data-act="clear" title="Remove video">' + svgRemove + '</button></div>' +
        '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';

      this._frame = root.querySelector('.frame');
      this._video = root.querySelector('video');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._sound = root.querySelector('.sound');
      this._input = root.querySelector('input');
      this._note = null;
      this._gen = 0;
      this._depth = 0;
      this._subFn = () => this._render();

      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest && e.target.closest('[data-act]');
        if (!btn) return;
        const act = btn.getAttribute('data-act');
        if (act === 'replace') this._input.click();
        if (act === 'clear') {
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null); else this._render();
        }
      });
      this._sound.addEventListener('click', () => {
        this._video.muted = !this._video.muted;
        if (!this._video.muted) { this._video.play().catch(() => {}); }
        this._syncSound();
      });
      this._video.addEventListener('loadeddata', () => {
        this.removeAttribute('data-busy');
        this._video.play().catch(() => {});
      });
    }

    connectedCallback() {
      if (!this.id && !VideoSlot._warned) {
        VideoSlot._warned = true;
        console.warn('<video-slot> without an id will not persist its dropped clip.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      load();
      this._render();
    }

    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
    }

    attributeChangedCallback() { if (this.shadowRoot) this._render(); }

    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      this._setNote(null);
      const okType = ACCEPT.indexOf(file.type) >= 0 || /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(file.name || '');
      if (!file || !okType) {
        this._setNote('Drop an MP4, WebM, or MOV video file.', 3200);
        return;
      }
      const gen = ++this._gen;
      const mb = file.size / (1024 * 1024);

      // Always play immediately from an object URL — instant, no encode wait.
      const objUrl = URL.createObjectURL(file);
      this._playUrl(objUrl);

      if (mb > MAX_PERSIST_MB) {
        // Too big to stash in the JSON sidecar — keep it for the session only.
        this._local = { u: objUrl, session: true };
        this._setNote('Clip is ' + mb.toFixed(0) + ' MB — playing now, but only clips under ' +
          MAX_PERSIST_MB + ' MB are saved across reloads. Compress it to keep it.', 6000);
        return;
      }

      this.setAttribute('data-busy', '');
      try {
        const url = await readAsDataUrl(file);
        if (gen !== this._gen) { URL.revokeObjectURL(objUrl); return; }
        const val = { u: url, mime: file.type || 'video/mp4' };
        if (this.id) setSlot(this.id, val);
        else { this._local = val; this._render(); }
        URL.revokeObjectURL(objUrl);
      } catch (err) {
        if (gen !== this._gen) return;
        this.removeAttribute('data-busy');
        this._setNote('Could not read that video.', 3200);
        console.warn('<video-slot> ingest failed:', err);
      }
    }

    _setNote(msg, ms) {
      if (this._note) { this._note.remove(); this._note = null; }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'note'; d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._note = d;
      if (ms) setTimeout(() => { if (this._note === d) { d.remove(); this._note = null; } }, ms);
    }

    _playUrl(url) {
      if (this._video.getAttribute('src') !== url) this._video.src = url;
      this._video.style.display = 'block';
      this._empty.style.display = 'none';
      this.setAttribute('data-filled', '');
      this._video.muted = true;            // reset to muted so autoplay is allowed
      this._video.play().catch(() => {});
      this._syncSound();
    }

    _syncSound() {
      const show = this.hasAttribute('sound') && this.hasAttribute('data-filled');
      this._sound.hidden = !show;
      if (!show) return;
      const muted = this._video.muted;
      this._sound.innerHTML = muted ? svgMuted : svgSound;
      this._sound.title = muted ? 'Unmute' : 'Mute';
      this._sound.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
    }

    _render() {
      // shape
      const n = parseFloat(this.getAttribute('radius'));
      this.style.borderRadius = (Number.isFinite(n) ? n : 12) + 'px';
      this._video.style.objectFit = this.getAttribute('fit') || 'cover';
      const poster = this.getAttribute('poster');
      if (poster) this._video.setAttribute('poster', poster); else this._video.removeAttribute('poster');

      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      let stored = this.id ? getSlot(this.id) : this._local;
      // Only accept data:video/ URLs from the sidecar (it's agent-writable too);
      // object-URL session entries and the author src= pass through.
      if (stored && stored.u && !stored.session && !/^data:video\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      const url = (stored && stored.u) || srcAttr;
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop a video clip';

      if (url) {
        this._playUrl(url);
      } else {
        this._video.pause && this._video.pause();
        this._video.removeAttribute('src');
        this._video.load && this._video.load();
        this._video.style.display = 'none';
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
        this.removeAttribute('data-busy');
        this._sound.hidden = true;
      }
    }
  }

  if (!customElements.get('video-slot')) {
    customElements.define('video-slot', VideoSlot);
  }
})();
