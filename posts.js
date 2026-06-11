/* Shared content model for the Resource Hub + article pages.
   This is the SEED content. Articles created or edited through the in-page
   admin tools are stored separately (localStorage) and merged on top of this
   by store.js — so editing a seed article never mutates this file.

   Each post: slug, title, excerpt, category, tags[], author, role, date,
   read (auto-derived when omitted), featured?, body (HTML for the .prose area).

   Podcasts are NOT listed here — they're pulled live from the Spotify show
   embed on the Resource Hub (see TBB_SPOTIFY below). */

window.TBB_POSTS = [
  {
    slug: "scale-workout",
    title: "How to scale a workout without losing the stimulus",
    excerpt: "Scaling isn't 'doing less' — it's keeping the intended training effect while meeting your body where it is today. Here's how our coaches think about it.",
    category: "Training",
    tags: ["scaling", "technique", "wod"],
    author: "Coach Jamie",
    role: "Head Coach",
    date: "2026-05-28",
    read: "6 min read",
    featured: true,
    body: `
<p>Walk into any class at CrossFit TBB and you'll see the same workout written on the board for everyone — and almost no two people doing it exactly the same way. That's not a compromise. That's the point. <strong>Scaling is how a single workout becomes the right workout for thirty different bodies.</strong></p>
<p>The mistake most people make is treating scaling as "doing less." You drop the weight, cut the reps, swap the movement, and quietly feel like you took the easy option. But a well-scaled session should leave you feeling exactly like the prescribed version was designed to — just without the parts your body isn't ready for yet.</p>
<h2>Start with the intent, not the numbers</h2>
<p>Every workout has an intended stimulus: a target time domain, an energy system, a feeling. Before you change a single number, ask what the workout is <em>trying to do to you</em>. A fast, light couplet that should take six to eight minutes is a completely different animal from a heavy grind — and they scale in opposite directions.</p>
<blockquote>If a workout is meant to be a sprint, scaling that keeps you moving fast is right. Scaling that turns it into a twenty-minute slog has missed the point entirely.</blockquote>
<h2>The three levers</h2>
<p>Once you know the intent, you have three levers to pull — usually in this order:</p>
<ul>
<li><strong>Load.</strong> The fastest, lowest-risk adjustment. Pick a weight you can move with good positions for the whole workout, not just the first round.</li>
<li><strong>Volume.</strong> Trim reps or rounds so your work-to-rest ratio matches the intent. Fewer reps done well beats more reps done badly.</li>
<li><strong>Movement.</strong> Swap a movement you don't yet own for one that trains the same pattern — ring rows for pull-ups, box step-ups for box jumps.</li>
</ul>
<div class="callout"><span class="ct-label">Coach's note</span>If you're new, you don't have to make these calls alone. Tell your coach how the warm-up felt and they'll help you set the right targets before the clock starts.</div>
<h2>A simple test</h2>
<p>Here's the gut-check we teach: if you can't keep moving at roughly the pace the workout intends — if you're resting twice as long as you're working, or grinding single reps when it should be smooth — it's scaled wrong. Adjust next time. Scaling is a skill you get better at, the same as a clean or a kip.</p>
<p>Do it well and you get the best of both worlds: the training effect the coach designed, and a body that's still healthy enough to show up tomorrow. That's the whole game.</p>`
  },
  {
    slug: "fuelling-busy-weeks",
    title: "Fuelling for CrossFit: a simple framework for busy weeks",
    excerpt: "You don't need a complicated meal plan. You need a repeatable framework for protein, carbs and timing that survives a chaotic schedule.",
    category: "Nutrition",
    tags: ["nutrition", "protein", "recovery"],
    author: "Coach Niamh",
    role: "Nutrition Coach",
    date: "2026-05-14",
    body: `
<p>The best nutrition plan is the one you'll actually follow on your worst week, not your best one. When work is busy and sleep is short, the elaborate prep falls apart — so we build around a framework simple enough to run on autopilot.</p>
<h2>Anchor every meal with protein</h2>
<p>If you get one thing right, make it protein at every meal. A palm-sized portion three or four times a day covers most people and does the heavy lifting for recovery, hunger and body composition without you weighing a thing.</p>
<blockquote>Hit your protein, train hard, sleep enough. Everything else in nutrition is a rounding error by comparison.</blockquote>
<h2>Carbs are fuel, not the enemy</h2>
<p>You're training hard — you've earned your carbs. Keep the bulk of them around your sessions, when your body uses them best, and you'll feel the difference in the last few rounds.</p>
<div class="callout"><span class="ct-label">Coach's note</span>Busy day ahead? Sort your protein source the night before. A solved breakfast and a packed lunch removes the two decisions most likely to derail you.</div>
<p>None of this is exciting, and that's the point. Boring and repeatable beats perfect and fragile every single week.</p>`
  },
  {
    slug: "first-month",
    title: "Your first month at TBB: what to expect, week by week",
    excerpt: "Nervous about starting? Here's exactly how your first four weeks unfold — from your trial week to your first proper benchmark WOD.",
    category: "Beginners",
    tags: ["beginners", "onboarding", "community"],
    author: "Coach Jamie",
    role: "Head Coach",
    date: "2026-04-30",
    body: `
<p>Almost everyone walks in for their first session a little nervous. Within a month, most of those same people are checking the timetable on a Sunday night, planning their week around classes. Here's how the first four weeks tend to go.</p>
<h2>Week 1 — find your feet</h2>
<p>Your trial week is about getting comfortable: where things are, how a class flows, what the movements feel like. A coach scales everything for you. Your only job is to show up and move.</p>
<h2>Weeks 2–3 — build the habit</h2>
<p>This is where consistency beats intensity. Two or three classes a week, movements starting to feel familiar, a few names you recognise. The community piece quietly does most of the work here.</p>
<blockquote>The members who stick aren't the fittest in week one. They're the ones who booked their next class before they left.</blockquote>
<h2>Week 4 — your first benchmark</h2>
<p>By now you'll likely hit a named benchmark WOD. Write the score down. It's not about the number — it's the line in the sand you'll beat in a few months and barely believe was ever hard.</p>
<div class="callout"><span class="ct-label">Coach's note</span>Sore is normal in week one, especially the day after. Hydrate, sleep, and come back — moving gently the next day beats sitting still.</div>`
  },
  {
    slug: "offseason-base",
    title: "Off-season programming: building a base that lasts",
    excerpt: "The competition floor is won in the quiet months. A look at how we structure aerobic base, strength and skill work in the off-season.",
    category: "Competition",
    tags: ["competition", "programming", "strength"],
    author: "Coach Ryan",
    role: "Competition Coach",
    date: "2026-04-18",
    body: `
<p>Competitions are won in February, not in the season. The off-season is when you do the unglamorous work that makes the flashy stuff possible later — and it's the part most athletes rush.</p>
<h2>Build the engine first</h2>
<p>Aerobic base is the foundation everything else sits on. Long, controlled, low-intensity work feels too easy to be useful, which is exactly why people skip it. Don't. A bigger engine makes every future session more productive.</p>
<h2>Strength you can express</h2>
<p>Raw strength matters, but only the strength you can express under fatigue counts on the floor. We pair heavy work with positions and tempos that hold up when your heart rate is high.</p>
<blockquote>Anyone can lift heavy when they're fresh. The athlete who keeps their positions in round seven is the one who trained for it in the off-season.</blockquote>
<div class="callout"><span class="ct-label">Coach's note</span>Pick one or two genuine weaknesses and attack them now. The off-season is the only time you can afford to be bad at something while you fix it.</div>`
  },
  {
    slug: "sauna-cold",
    title: "Sauna and cold plunge: how to actually use them",
    excerpt: "Contrast therapy is everywhere, but the order, timing and dose matter. A practical guide to getting real recovery from our recovery box.",
    category: "Training",
    tags: ["recovery", "sauna", "cold"],
    author: "Coach Niamh",
    role: "Nutrition Coach",
    date: "2026-04-05",
    body: `
<p>The recovery box is one of the best tools we have — and one of the easiest to use badly. A bit of structure turns "nice but pointless" into something that genuinely helps you train more.</p>
<h2>Heat to unwind, cold to reset</h2>
<p>Use the sauna to down-regulate: longer, relaxed sessions, ideally away from training. Use the cold plunge as a sharp reset — short and deliberate, not a test of how long you can suffer.</p>
<blockquote>Cold isn't about being hard. Two to three honest minutes does the job; ten minutes of misery just makes you dread coming back.</blockquote>
<h2>Mind the timing around lifting</h2>
<p>A long cold plunge straight after a heavy strength session can blunt some of the adaptation you just worked for. If a session was about getting stronger, leave a gap before the cold — or save it for a different day.</p>
<div class="callout"><span class="ct-label">Coach's note</span>Consistency beats intensity here too. Two relaxed sessions a week you actually enjoy will do far more than one heroic effort you never repeat.</div>`
  },
  {
    slug: "grip-strength",
    title: "Grip giving out? Build it without frying your forearms",
    excerpt: "If your grip fails before your lungs do, you're leaving reps on the table. Simple accessory work you can bolt onto any session.",
    category: "Training",
    tags: ["strength", "accessory", "technique"],
    author: "Coach Ryan",
    role: "Competition Coach",
    date: "2026-03-22",
    body: `
<p>Few things are as frustrating as dropping off the bar with plenty left in the tank, beaten only by your hands. The good news: grip responds quickly to a little focused work.</p>
<h2>Fix your technique first</h2>
<p>Before you add accessory work, check you're not wasting grip. A relaxed hook on the bar, a hanging position that lets your shoulders do the work, and smart breaks all save more grip than any exercise.</p>
<h2>Then add a small dose</h2>
<ul>
<li><strong>Dead hangs.</strong> Accumulate a couple of minutes total, broken into sets. Brilliant for the hands and the shoulders.</li>
<li><strong>Farmer carries.</strong> Heavy, tall, controlled. The most transferable grip work there is.</li>
<li><strong>Barbell holds.</strong> Hold your deadlift at the top for time after your last working set.</li>
</ul>
<div class="callout"><span class="ct-label">Coach's note</span>Grip recovers slower than you'd think. Two short sessions a week is plenty — more than that and you'll fry your forearms and feel it in everything else.</div>`
  },
  {
    slug: "member-spotlight-sarah",
    title: "Member spotlight: Sarah's first year on the rig",
    excerpt: "From 'I'll never do a pull-up' to stringing together five strict. Sarah on consistency, community and trusting the process.",
    category: "Community",
    tags: ["community", "beginners", "stories"],
    author: "TBB Team",
    role: "CrossFit TBB",
    date: "2026-03-10",
    body: `
<p>A year ago, Sarah told her on-ramp coach she'd "never be a pull-up person." Last week she strung together five strict reps in a workout and barely noticed she'd done them. We sat down with her to talk about how that happened.</p>
<h2>It started with just showing up</h2>
<p>"I didn't have a grand plan," she says. "I booked three classes a week and treated them like appointments I couldn't cancel. The fitness sort of snuck up on me."</p>
<blockquote>I stopped chasing big jumps and just tried to be a tiny bit better than last time. A year of that adds up to something you can't quite believe.</blockquote>
<h2>The community did the rest</h2>
<p>"The first time someone shouted my name across the gym in a workout, I was hooked. You don't want to let those people down — so you keep coming back, and the results take care of themselves."</p>
<div class="callout"><span class="ct-label">Coach's note</span>Sarah's progress isn't unusual — it's what consistency looks like. The hard part was never the pull-ups. It was booking the next class, every week, for a year.</div>`
  },
  {
    slug: "protein-myths",
    title: "Five protein myths that won't die",
    excerpt: "How much is too much? Does timing matter? We cut through the noise with what the evidence actually says for everyday athletes.",
    category: "Nutrition",
    tags: ["nutrition", "protein"],
    author: "Coach Niamh",
    role: "Nutrition Coach",
    date: "2026-02-26",
    body: `
<p>Protein attracts more myths than any other part of nutrition. Here are the five we hear most on the gym floor — and what's actually true.</p>
<h2>"Your body can only use 30g at a time"</h2>
<p>It can't store unlimited amounts in one sitting, but it absolutely uses more than 30g — it just takes a little longer. Spreading protein across the day is sensible, but a big serving isn't "wasted."</p>
<h2>"You have to eat right after training"</h2>
<p>The anabolic window is far wider than the supplement industry would like you to believe. Hit your daily total and the exact minute barely matters.</p>
<blockquote>Total daily protein is the thing that moves the needle. Timing is the fine-tuning you worry about only once the basics are locked in.</blockquote>
<h2>"High protein wrecks your kidneys"</h2>
<p>For healthy people, higher-protein diets have a strong safety record. If you have an existing kidney condition, that's a conversation for your doctor — for everyone else, eat up.</p>
<div class="callout"><span class="ct-label">Coach's note</span>Most members we work with are under-eating protein, not over-eating it. Track it honestly for three days — the number usually surprises people.</div>`
  },
  {
    slug: "comp-prep-checklist",
    title: "Competition day: the checklist our athletes swear by",
    excerpt: "Warm-up timing, fuelling, kit, mindset. Everything you should sort the night before so competition day runs itself.",
    category: "Competition",
    tags: ["competition", "mindset", "recovery"],
    author: "Coach Ryan",
    role: "Competition Coach",
    date: "2026-02-12",
    body: `
<p>Competition day is won by the athlete who has nothing left to decide. The more you sort the night before, the more attention you keep for the only thing that matters — competing.</p>
<h2>Pack it the night before</h2>
<ul>
<li><strong>Kit:</strong> two of everything that matters, plus your shoes, belt and any grips.</li>
<li><strong>Food:</strong> familiar meals and snacks for the whole day. Competition day is not the day to try new things.</li>
<li><strong>Admin:</strong> heat times screenshotted, water bottle filled, alarm double-checked.</li>
</ul>
<h2>Warm up to the clock, not the nerves</h2>
<p>Know your heat time and back-time your warm-up so you peak right as you're called, not twenty minutes early. A written warm-up beats improvising on adrenaline every time.</p>
<blockquote>You won't rise to the occasion — you'll fall to your level of preparation. Make that level high and boring.</blockquote>
<div class="callout"><span class="ct-label">Coach's note</span>Between events: eat a little, move a little, and get off your feet. The athletes who fade late are usually the ones who stood around chatting all day.</div>`
  }
];

/* Podcast — pulled live from this Spotify show (episodes, artwork and 30s
   previews render directly from the embed on the Resource Hub). */
window.TBB_SPOTIFY = "https://open.spotify.com/show/7jnRQ30E4Yz9mEwXxY8f49?si=79e448d635ac4957";
window.TBB_SPOTIFY_SHOW_ID = "7jnRQ30E4Yz9mEwXxY8f49";

/* Podcast tiles that sit in the Resource Hub grid alongside articles —
   searchable + filterable like everything else. Each entry's artwork and
   live title are pulled from Spotify via oEmbed; tapping a tile opens the
   real Spotify player (30s preview). Admins add more episodes by pasting a
   Spotify episode link (title + artwork auto-fill). To list a specific
   episode, set spotifyUrl to that episode's link instead of the show. */
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
