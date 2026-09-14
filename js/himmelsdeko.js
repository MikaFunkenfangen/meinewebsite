/* Himmelsdeko — sanfte Scroll-Choreografie für Wolken, Flieger, Bücher, Blüte.
   Jedes Element mit class="deko" wird über data-Attribute bewegt:
     data-dx      horizontale Wanderung in vw über die volle Scrollstrecke
     data-dy      vertikale Wanderung in vh über die volle Scrollstrecke
     data-bob     Auf-und-ab-Wippen in vh (zwei sanfte Wellen pro Seite)
     data-schwenk Hin-und-her-Neigen in Grad (drei sanfte Wellen pro Seite)
   Regeln aus der Bug-Merkliste: nur transform (nie top/left animieren),
   kein drop-shadow, still bei Low-End und reduzierter Bewegung. */
(function () {
  var deko = [].slice.call(document.querySelectorAll('.deko'));
  if (!deko.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var tick = false;
  function anwenden() {
    if (document.body.classList.contains('low-end')) return;
    var scrollH = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    /* Math.max fängt negatives scrollY beim iOS-Überscrollen ab */
    var pct = Math.min(Math.max(window.scrollY, 0) / scrollH, 1);
    for (var i = 0; i < deko.length; i++) {
      var d = deko[i].dataset;
      var tx = (parseFloat(d.dx) || 0) * pct;
      var ty = (parseFloat(d.dy) || 0) * pct
             + (parseFloat(d.bob) || 0) * Math.sin(pct * Math.PI * 4);
      var rot = (parseFloat(d.schwenk) || 0) * Math.sin(pct * Math.PI * 3);
      deko[i].style.transform =
        'translate3d(' + tx.toFixed(2) + 'vw,' + ty.toFixed(2) + 'vh,0)' +
        (rot ? ' rotate(' + rot.toFixed(2) + 'deg)' : '');
    }
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(function () { anwenden(); tick = false; }); }
  }, { passive: true });
  anwenden();
})();
