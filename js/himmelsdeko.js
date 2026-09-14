/* Himmelsdeko — sanfte Scroll-Choreografie für Wolken, Flieger, Bücher.
   Die Bewegung ist an die SICHTBARKEIT des Elements gekoppelt: Während es
   von unten nach oben durchs Bild zieht (rel: +1 → −1), durchläuft es seine
   volle Bewegung — dadurch spürbar, egal wie lang die Seite ist.
     data-dx      horizontale Wanderung: ±dx vw über die Sichtbarkeitsspanne
     data-dy      vertikale Wanderung: ±dy vh über die Spanne
     data-bob     Wippen in vh, Maximum in Bildschirmmitte
     data-schwenk Neigen in Grad über die Spanne
   Regeln aus der Bug-Merkliste: nur transform, kein drop-shadow.
   Laeuft auf ALLEN Geraeten (transform ist GPU-billig); nur bei
   prefers-reduced-motion bleibt alles still. */
(function () {
  var deko = [].slice.call(document.querySelectorAll('.deko'));
  if (!deko.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var tick = false;
  function anwenden() {
    var vh = window.innerHeight;
    for (var i = 0; i < deko.length; i++) {
      var el = deko[i], d = el.dataset;
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      /* rel: +1 = Element betritt das Bild unten, 0 = Mitte, −1 = verlässt es oben */
      var rel = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      var tx = (parseFloat(d.dx) || 0) * -rel;
      /* Wippen als echte Wellen über die Sichtspanne (2,5 Zyklen) — die
         frühere cos-Kuppel war in Bildschirmmitte fast flach */
      var ty = (parseFloat(d.dy) || 0) * -rel
             + (parseFloat(d.bob) || 0) * Math.sin(rel * Math.PI * 2.5);
      var rot = (parseFloat(d.schwenk) || 0) * -rel;
      el.style.transform =
        'translate3d(' + tx.toFixed(2) + 'vw,' + ty.toFixed(2) + 'vh,0)' +
        (rot ? ' rotate(' + rot.toFixed(2) + 'deg)' : '');
    }
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(function () { anwenden(); tick = false; }); }
  }, { passive: true });
  window.addEventListener('resize', anwenden);
  anwenden();
})();
