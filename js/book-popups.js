/* ═══ Book Popups — self-injecting, works on every page ═══ */
(function(){
  var FIRST_DELAY = 60 * 1000;
  var INTERVAL = 5 * 60 * 1000;
  var popupIndex = 0;

  /* ── Determine base path to images ── */
  var depth = (location.pathname.match(/\//g) || []).length - 1;
  var isSubpage = location.pathname !== '/' && location.pathname !== '/index.html' && depth > 0;
  var base = isSubpage ? '../' : '';

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '.bkpop{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .5s ease,visibility .5s ease;pointer-events:none}',
    '.bkpop.active{opacity:1;visibility:visible;pointer-events:auto}',
    '.bkpop-bg{position:absolute;inset:0;background:rgba(6,6,12,0.75);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}',
    '.bkpop-card{position:relative;max-width:520px;width:90%;border-radius:16px;overflow:hidden;border:1px solid rgba(201,169,110,0.2);box-shadow:0 0 60px rgba(201,169,110,0.08),0 20px 60px rgba(0,0,0,0.5);transform:translateY(20px) scale(0.96);transition:transform .5s cubic-bezier(.22,1,.36,1)}',
    '.bkpop.active .bkpop-card{transform:translateY(0) scale(1)}',
    '.bkpop-card--gold{background:linear-gradient(145deg,rgba(20,18,30,0.95),rgba(35,30,50,0.92))}',
    '.bkpop-card--green{background:linear-gradient(145deg,rgba(15,32,18,0.96),rgba(28,48,26,0.94));border-color:rgba(120,180,90,0.2);box-shadow:0 0 50px rgba(80,140,60,0.1),0 20px 60px rgba(0,0,0,0.5)}',
    '.bkpop-x{position:absolute;top:12px;right:14px;background:none;border:none;color:rgba(245,240,230,0.5);font-size:1.8rem;cursor:pointer;transition:opacity .3s;z-index:2;line-height:1}',
    '.bkpop-x:hover{opacity:1}',
    '.bkpop-in{display:flex;gap:1.5rem;padding:2rem;align-items:center}',
    '.bkpop-img{flex-shrink:0}',
    '.bkpop-img img{width:140px;height:auto;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,0.4),0 0 20px rgba(201,169,110,0.1)}',
    '.bkpop-ey{font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;opacity:0.7;margin-bottom:0.4rem}',
    '.bkpop-card--gold .bkpop-ey{color:#c9a96e}',
    '.bkpop-card--green .bkpop-ey{color:rgba(160,200,120,0.8)}',
    '.bkpop-h{font-size:clamp(1.4rem,3vw,1.8rem);letter-spacing:0.08em;margin-bottom:0.8rem;line-height:1.2}',
    '.bkpop-card--gold .bkpop-h{color:#c9a96e}',
    '.bkpop-card--green .bkpop-h{color:#a8d08d}',
    '.bkpop-p{font-size:0.85rem;line-height:1.6;margin-bottom:1.2rem}',
    '.bkpop-card--gold .bkpop-p{color:rgba(245,240,230,0.7)}',
    '.bkpop-card--green .bkpop-p{color:rgba(200,220,190,0.7)}',
    '.bkpop-p em{font-style:normal}',
    '.bkpop-card--gold .bkpop-p em{color:#c9a96e}',
    '.bkpop-card--green .bkpop-p em{color:#a8d08d}',
    '.bkpop-btn{display:inline-block;font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.6rem 1.8rem;border-radius:50px;text-decoration:none;transition:all .4s ease}',
    '.bkpop-card--gold .bkpop-btn{color:#f5f0e6;border:1px solid rgba(201,169,110,0.4)}',
    '.bkpop-card--gold .bkpop-btn:hover{background:rgba(201,169,110,0.15);border-color:#c9a96e;box-shadow:0 0 20px rgba(201,169,110,0.2)}',
    '.bkpop-card--green .bkpop-btn{color:rgba(180,220,160,0.9);border:1px solid rgba(120,180,90,0.35)}',
    '.bkpop-card--green .bkpop-btn:hover{background:rgba(80,140,60,0.15);border-color:rgba(120,180,90,0.6);box-shadow:0 0 20px rgba(80,140,60,0.2)}',
    '.bkpop-card--green .bkpop-x{color:rgba(180,220,160,0.5)}',
    '.bkpop-card--green .bkpop-bg{background:rgba(4,12,6,0.78)}',
    '@media(max-width:520px){',
    '  .bkpop-in{flex-direction:column;text-align:center;padding:1.5rem 1.2rem}',
    '  .bkpop-img img{width:120px}',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Popup HTML templates ── */
  function createPopup(id, theme, coverSrc, eyebrow, title, desc, btnText, btnHref) {
    var div = document.createElement('div');
    div.className = 'bkpop';
    div.id = id;
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML =
      '<div class="bkpop-bg" data-close></div>' +
      '<div class="bkpop-card bkpop-card--' + theme + '">' +
        '<button class="bkpop-x" data-close aria-label="Schließen">&times;</button>' +
        '<div class="bkpop-in">' +
          '<div class="bkpop-img"><img src="' + coverSrc + '" alt="' + title + '" width="140" loading="lazy" decoding="async"></div>' +
          '<div class="bkpop-txt">' +
            '<p class="bkpop-ey">' + eyebrow + '</p>' +
            '<h3 class="bkpop-h">' + title + '</h3>' +
            '<p class="bkpop-p">' + desc + '</p>' +
            '<a href="' + btnHref + '" class="bkpop-btn" target="_blank" rel="noopener">' + btnText + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    div.addEventListener('click', function(e) {
      if (e.target.hasAttribute('data-close')) closePopup(id);
    });
    document.body.appendChild(div);
  }

  createPopup(
    'bkpop1', 'gold',
    base + 'images/50woerter-cover.png',
    'Neues Buch von Mika Schöberl',
    '50 Wörter<br>für Liebe',
    'Fünfzig Wörter. Fünfzig Türen zu dem, was wir meinen, wenn wir <em>Liebe</em> sagen.',
    'Entdecken',
    'https://www.amazon.de/50-W%C3%B6rter-f%C3%BCr-Liebe-Inspirationen-ebook/dp/B0DP9T7X2T/'
  );

  createPopup(
    'bkpop2', 'green',
    base + 'images/gruene-seelen-cover.png',
    'Von Mika Schöberl',
    'Grüne<br>Seelen',
    'Über die Weisheit der Natur — ein Buch für alle, die spüren, dass die Erde mehr weiß als wir.',
    'Entdecken',
    'https://www.amazon.de/Gr%C3%BCne-Seelen-%C3%9Cber-Weisheit-Natur/dp/3863745981/'
  );

  /* ── Show / Close / Timer ── */
  function showPopup(id) {
    var p = document.getElementById(id);
    if (p) { p.classList.add('active'); p.setAttribute('aria-hidden', 'false'); }
  }
  function closePopup(id) {
    var p = document.getElementById(id);
    if (p) { p.classList.remove('active'); p.setAttribute('aria-hidden', 'true'); }
  }
  window.closeBookPopups = function() { closePopup('bkpop1'); closePopup('bkpop2'); };

  var ids = ['bkpop1', 'bkpop2'];
  function showNext() {
    showPopup(ids[popupIndex]);
    popupIndex = (popupIndex + 1) % ids.length;
  }

  setTimeout(function(){
    showNext();
    setInterval(showNext, INTERVAL);
  }, FIRST_DELAY);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeBookPopups();
  });
})();
