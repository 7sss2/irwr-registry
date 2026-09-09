(function () {
  // Lightweight CSS-driven replacement for the old three.js hero scene: two
  // SVG shapes spin ambiently via CSS keyframes (see .hero3d-knot/.hero3d-ico),
  // and this just adds a subtle mouse-follow tilt on the wrapper via CSS custom
  // properties — no WebGL, no per-frame render loop.
  const host = document.getElementById('hero3dHost');
  if (!host || window.matchMedia('(max-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf = null;
  window.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const tx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ty = (e.clientY / window.innerHeight - 0.5) * 14;
      host.style.setProperty('--tx', tx.toFixed(2));
      host.style.setProperty('--ty', ty.toFixed(2));
      raf = null;
    });
  });
})();
