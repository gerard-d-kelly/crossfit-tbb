/* Real comments with Google sign-in (SSO) — powered by Google Firebase.
   Free, no ads, no GitHub. Visitors click "Sign in with Google", leave a
   comment, and it's stored in your own Firebase (Firestore) database. You
   (and each commenter) can delete comments.

   ──────────────────────────────────────────────────────────────────────
   ONE-TIME SETUP (~15 min — full walkthrough in the launch guide):
     1. console.firebase.google.com → Add project (free, no card).
     2. Build → Authentication → Get started → enable "Google".
     3. Build → Firestore Database → Create database → Production mode.
     4. Firestore → Rules → paste the rules from the launch guide → Publish.
     5. Project settings (gear) → Your apps → Web (</>) → register an app →
        copy the four values into CONFIG below.
     6. Authentication → Settings → Authorized domains → Add domain →
        crossfit-tbb.co.uk
   Until you paste real keys, the Comments section stays hidden, so the live
   site never shows a broken box.
   ────────────────────────────────────────────────────────────────────── */

var TBB_FIREBASE = {
  apiKey:     "PASTE_API_KEY_HERE",
  authDomain: "PASTE_AUTH_DOMAIN_HERE",   // e.g. crossfit-tbb-xxxx.firebaseapp.com
  projectId:  "PASTE_PROJECT_ID_HERE",
  appId:      "PASTE_APP_ID_HERE"
};
/* Emails allowed to delete ANY comment (you). Commenters can always delete
   their own. Add more coach emails here if you like. */
var TBB_COMMENT_ADMINS = ["gerard.d.kelly@gmail.com"];

(function () {
  var FB_VER = "10.12.2";
  var section = document.getElementById('comments');
  if (!section) return;

  var cfg = TBB_FIREBASE;
  var unset = !cfg.apiKey || cfg.apiKey.indexOf('PASTE_') === 0 ||
              !cfg.projectId || cfg.projectId.indexOf('PASTE_') === 0;
  if (unset) { section.hidden = true; return; }

  var slug = new URLSearchParams(location.search).get('slug') || 'home';

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmtWhen(ts) {
    if (!ts || !ts.toDate) return 'just now';
    return ts.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  var GOOGLE_G =
    '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">' +
    '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.6 24 4.6 13.3 4.6 4.6 13.3 4.6 24S13.3 43.4 24 43.4 43.4 34.7 43.4 24c0-1.2-.1-2.3-.4-3.5z"/>' +
    '<path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.6 24 4.6 16.3 4.6 9.7 8.9 6.3 14.7z"/>' +
    '<path fill="#4CAF50" d="M24 43.4c5.2 0 9.9-1.8 13.5-4.9l-6.2-5.2c-2 1.5-4.6 2.3-7.3 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39 16.2 43.4 24 43.4z"/>' +
    '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.2 5.2c-.4.4 6.7-4.9 6.7-14.6 0-1.2-.1-2.3-.4-3.5z"/></svg>';

  var base = 'https://www.gstatic.com/firebasejs/' + FB_VER + '/';
  loadScript(base + 'firebase-app-compat.js')
    .then(function () { return loadScript(base + 'firebase-auth-compat.js'); })
    .then(function () { return loadScript(base + 'firebase-firestore-compat.js'); })
    .then(init)
    .catch(function () { section.hidden = true; });

  function init() {
    firebase.initializeApp(cfg);
    var auth = firebase.auth();
    var db = firebase.firestore();
    var provider = new firebase.auth.GoogleAuthProvider();

    section.hidden = false;
    var authBar = document.getElementById('comment-auth');
    var list = document.getElementById('comment-list');
    var countEl = document.getElementById('cc-count');
    var me = null;

    function isAdmin(u) { return u && u.email && TBB_COMMENT_ADMINS.indexOf(u.email) !== -1; }

    auth.onAuthStateChanged(function (user) { me = user; renderAuth(); renderList(lastDocs); });

    function renderAuth() {
      if (!authBar) return;
      if (me) {
        authBar.innerHTML =
          '<form class="comment-form" id="comment-form">' +
            '<textarea id="cf-text" placeholder="Add to the discussion…" aria-label="Your comment" required></textarea>' +
            '<div class="cf-actions">' +
              '<span class="cf-who">Commenting as ' + esc(me.displayName || 'you') +
                ' · <button type="button" class="cf-signout" id="cf-signout">Sign out</button></span>' +
              '<button class="btn btn-primary" type="submit">Post comment<svg><use href="#i-send"></use></svg></button>' +
            '</div>' +
          '</form>';
        document.getElementById('cf-signout').addEventListener('click', function () { auth.signOut(); });
        document.getElementById('comment-form').addEventListener('submit', onPost);
      } else {
        authBar.innerHTML =
          '<div class="comment-signin">' +
            '<p>Join the conversation — sign in to comment.</p>' +
            '<button class="btn btn-outline cf-google" type="button" id="cf-google">' + GOOGLE_G + 'Sign in with Google</button>' +
          '</div>';
        document.getElementById('cf-google').addEventListener('click', function () {
          auth.signInWithPopup(provider).catch(function () {});
        });
      }
    }

    function onPost(e) {
      e.preventDefault();
      var ta = document.getElementById('cf-text');
      var text = (ta.value || '').trim();
      if (!text || !me) return;
      var btn = e.target.querySelector('button[type=submit]');
      if (btn) btn.disabled = true;
      db.collection('comments').add({
        articleSlug: slug,
        text: text.slice(0, 2000),
        name: me.displayName || 'Anonymous',
        photo: me.photoURL || '',
        uid: me.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function () { ta.value = ''; })
        .catch(function () { alert('Sorry — your comment could not be posted.'); })
        .then(function () { if (btn) btn.disabled = false; });
    }

    var lastDocs = [];
    function renderList(docs) {
      lastDocs = docs;
      if (!list) return;
      if (countEl) countEl.textContent = docs.length ? '(' + docs.length + ')' : '';
      if (!docs.length) { list.innerHTML = '<p class="comment-empty">No comments yet — be the first.</p>'; return; }
      list.innerHTML = docs.map(function (c) {
        var d = c.data;
        var canDelete = me && (me.uid === d.uid || isAdmin(me));
        var initial = (d.name || '?').charAt(0).toUpperCase();
        var av = d.photo
          ? '<img class="av" src="' + esc(d.photo) + '" alt="" referrerpolicy="no-referrer">'
          : '<div class="av">' + esc(initial) + '</div>';
        return '<div class="comment">' + av +
          '<div class="cbody"><div class="chead"><span class="nm">' + esc(d.name) + '</span>' +
          '<span class="when">' + fmtWhen(d.createdAt) + '</span>' +
          (canDelete ? '<button class="cf-del" data-id="' + c.id + '" title="Delete comment">Delete</button>' : '') +
          '</div><p class="ctext">' + esc(d.text) + '</p></div></div>';
      }).join('');
      [].forEach.call(list.querySelectorAll('.cf-del'), function (b) {
        b.addEventListener('click', function () {
          if (confirm('Delete this comment?')) db.collection('comments').doc(b.getAttribute('data-id')).delete();
        });
      });
    }

    // Realtime, newest-aware. Query by article only (no composite index needed)
    // and sort client-side by timestamp.
    db.collection('comments').where('articleSlug', '==', slug)
      .onSnapshot(function (snap) {
        var docs = [];
        snap.forEach(function (doc) { docs.push({ id: doc.id, data: doc.data() }); });
        docs.sort(function (a, b) {
          var ta = a.data.createdAt && a.data.createdAt.toMillis ? a.data.createdAt.toMillis() : Infinity;
          var tb = b.data.createdAt && b.data.createdAt.toMillis ? b.data.createdAt.toMillis() : Infinity;
          return ta - tb;
        });
        renderList(docs);
      }, function () {
        if (list) list.innerHTML = '<p class="comment-empty">Comments are unavailable right now.</p>';
      });
  }
})();
