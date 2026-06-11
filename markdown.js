/* TBB_md — a small, dependency-free Markdown → HTML renderer for article
   bodies coming out of the CMS. Supports the subset a blog actually uses:
   headings, bold/italic, inline code, links, images, ordered/unordered
   lists, blockquotes, horizontal rules and paragraphs.

   Plus one house convention: a blockquote whose first line starts with a
   bold label and an em dash —
       > **Coach's note** — keep the chest up …
   renders as the site's highlighted .callout box (matching the design used
   throughout the Resource Hub).

   If the input already contains block-level HTML (the offline seed fallback
   in posts.js stores HTML, not Markdown), it's passed straight through. */

window.TBB_md = (function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Inline: code, bold, italic, links, images. (Operates on escaped text.)
  function inline(s) {
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      function (m, alt, src, title) { return '<img src="' + src + '" alt="' + alt + '"' + (title ? ' title="' + title + '"' : '') + '>'; });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      function (m, txt, href, title) {
        var ext = /^https?:/.test(href);
        return '<a href="' + href + '"' + (title ? ' title="' + title + '"' : '') +
          (ext ? ' target="_blank" rel="noopener"' : '') + '>' + txt + '</a>';
      });
    s = s.replace(/`([^`]+)`/g, function (m, c) { return '<code>' + c + '</code>'; });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/_([^_\n]+)_/g, '<em>$1</em>');
    return s;
  }

  function calloutFrom(lines) {
    // lines: array of blockquote content lines (already stripped of "> ")
    var joined = lines.join('\n').trim();
    var m = joined.match(/^\*\*([^*]+)\*\*\s*(?:—|--|-)?\s*([\s\S]*)$/);
    if (m) {
      return '<div class="callout"><span class="ct-label">' + inline(esc(m[1].trim())) +
        '</span>' + inline(esc(m[2].trim())) + '</div>';
    }
    return '<blockquote>' + inline(esc(joined)) + '</blockquote>';
  }

  function render(src) {
    if (src == null) return '';
    var text = String(src);

    // HTML passthrough (seed fallback stores HTML bodies).
    if (/<(p|h2|h3|ul|ol|blockquote|div|img)\b/i.test(text)) return text;

    var lines = text.replace(/\r\n/g, '\n').split('\n');
    var out = [];
    var i = 0;

    function flushPara(buf) {
      var t = buf.join(' ').trim();
      if (t) out.push('<p>' + inline(esc(t)) + '</p>');
    }

    var para = [];
    while (i < lines.length) {
      var line = lines[i];

      // blank line → paragraph break
      if (!line.trim()) { flushPara(para); para = []; i++; continue; }

      // headings
      var h = line.match(/^(#{2,4})\s+(.*)$/);
      if (h) { flushPara(para); para = [];
        var lvl = h[1].length; out.push('<h' + lvl + '>' + inline(esc(h[2].trim())) + '</h' + lvl + '>'); i++; continue; }

      // horizontal rule
      if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) { flushPara(para); para = []; out.push('<hr>'); i++; continue; }

      // blockquote / callout (consume consecutive "> " lines)
      if (/^>\s?/.test(line)) { flushPara(para); para = [];
        var bq = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { bq.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push(calloutFrom(bq)); continue; }

      // unordered list
      if (/^\s*[-*+]\s+/.test(line)) { flushPara(para); para = [];
        var ul = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { ul.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++; }
        out.push('<ul>' + ul.map(function (it) { return '<li>' + inline(esc(it.trim())) + '</li>'; }).join('') + '</ul>');
        continue; }

      // ordered list
      if (/^\s*\d+\.\s+/.test(line)) { flushPara(para); para = [];
        var ol = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { ol.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
        out.push('<ol>' + ol.map(function (it) { return '<li>' + inline(esc(it.trim())) + '</li>'; }).join('') + '</ol>');
        continue; }

      // otherwise accumulate into paragraph
      para.push(line);
      i++;
    }
    flushPara(para);
    return out.join('\n');
  }

  return render;
})();
