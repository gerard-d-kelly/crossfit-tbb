/* Shared content model for the Resource Hub + article pages.

   Articles are managed entirely through the CMS (content/articles.json),
   which store.js fetches at runtime. This seed array is intentionally empty:
   it is only a last-resort fallback if that file ever fails to load, so the
   site degrades to "no articles yet" rather than showing stale demo content.

   Podcast + helper functions live below and ARE used in production. */

window.TBB_POSTS = [];

/* Podcast tiles that sit in the Resource Hub grid alongside articles —
   searchable + filterable like everything else. Each entry's artwork and
   live title are pulled from Spotify via oEmbed; tapping a tile opens the
   real Spotify player (30s preview). Add more episodes by pasting a
   Spotify episode link. To list a specific episode, set spotifyUrl to that
   episode's link instead of the show. */
window.TBB_EPISODES = [
  {
    slug: "the-tbb-podcast",
    type: "podcast",
    title: "The TBB Podcast",
    excerpt: "Coaches, members and guests on training, nutrition and life in the box. Tap to play the latest episode and browse the full back catalogue.",
    category: "Podcast",
    tags: ["podcast", "community", "training"],
    date: "2026-05-20",
    spotifyUrl: "https://open.spotify.com/show/7jnRQ30E4Yz9mEwXxY8f49"
  }
];

/* Format an ISO date as e.g. "28 May 2026" */
window.TBB_fmtDate = function (iso) {
  var d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/* Estimate read time from body HTML (≈200 wpm, 1 min floor). */
window.TBB_readTime = function (html) {
  var text = (html || "").replace(/<[^>]+>/g, " ");
  var words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)) + " min read";
};

/* Cover image for an article/episode. A CMS-uploaded cover wins; otherwise
   fall back to a tasteful dark placeholder chosen by category. */
window.TBB_coverSrc = function (p) {
  if (p && p.cover) return p.cover;
  var map = { training: "training", nutrition: "nutrition", beginners: "beginners",
              competition: "competition", community: "community", podcast: "podcast" };
  var c = (p && p.category) ? String(p.category).toLowerCase() : "";
  return "assets/covers/" + (map[c] || "default") + ".png";
};

/* Author photo. A CMS-uploaded avatar wins; otherwise a neutral placeholder. */
window.TBB_avatarSrc = function (p) {
  return (p && p.avatar) ? p.avatar : "assets/ph-avatar.png";
};

/* Stable <image-slot> ids for an article's cover + author photo. */
window.TBB_coverId = function (p) { return p.coverImg || ("cover-" + p.slug); };
window.TBB_avatarId = function (p) {
  var slugify = (window.TBBStore && window.TBBStore.slugify) ||
    function (t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"); };
  return p.avatarImg || ("avatar-" + slugify(p.author || "tbb"));
};
