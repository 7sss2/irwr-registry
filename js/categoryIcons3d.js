(function () {
  if (typeof THREE === 'undefined') return;
  const hosts = document.querySelectorAll('.cat-tile .cat-icon-host');
  if (!hosts.length) return;

  const geometryFor = {
    sport: () => new THREE.SphereGeometry(0.9, 16, 16),
    economy: () => new THREE.TorusGeometry(0.7, 0.25, 10, 24),
    culture: () => new THREE.ConeGeometry(0.8, 1.4, 6),
    education: () => new THREE.OctahedronGeometry(0.9, 0),
    transport: () => new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16),
    cooking: () => new THREE.TorusKnotGeometry(0.5, 0.16, 60, 8),
    architecture: () => new THREE.BoxGeometry(1.1, 1.1, 1.1),
    military: () => new THREE.TetrahedronGeometry(1, 0),
    humanbody: () => new THREE.DodecahedronGeometry(0.85, 0),
    extreme: () => new THREE.IcosahedronGeometry(0.9, 0),
  };

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setScissorTest(true);

  const entries = [];
  hosts.forEach((host) => {
    const tile = host.closest('.cat-tile');
    const category = tile.dataset.category;
    const geoFactory = geometryFor[category];
    if (!geoFactory) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 3;
    const mesh = new THREE.Mesh(geoFactory(), new THREE.MeshBasicMaterial({ color: 0xD9A73B, wireframe: true }));
    scene.add(mesh);

    const entry = { host, scene, camera, mesh, hovering: false };
    entries.push(entry);
    tile.addEventListener('mouseenter', () => { entry.hovering = true; });
    tile.addEventListener('mouseleave', () => { entry.hovering = false; });
  });

  // One shared WebGLRenderer stacked over the whole viewport; each tile's
  // patch is drawn via scissor/viewport during the render pass, so only
  // one WebGL context exists for all 10 tiles instead of one per tile.
  const rendererEl = renderer.domElement;
  rendererEl.style.position = 'fixed';
  rendererEl.style.top = '0';
  rendererEl.style.left = '0';
  rendererEl.style.width = '100vw';
  rendererEl.style.height = '100vh';
  rendererEl.style.pointerEvents = 'none';
  rendererEl.style.zIndex = '3';
  document.body.appendChild(rendererEl);
  renderer.setSize(window.innerWidth, window.innerHeight);

  function animate() {
    requestAnimationFrame(animate);
    renderer.clear();
    entries.forEach((entry) => {
      entry.mesh.rotation.y += entry.hovering ? 0.04 : 0.005;
      entry.mesh.rotation.x += entry.hovering ? 0.02 : 0.002;
      const rect = entry.host.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0 || rect.height === 0) return;
      const x = rect.left;
      const y = window.innerHeight - rect.bottom;
      renderer.setScissor(x, y, rect.width, rect.height);
      renderer.setViewport(x, y, rect.width, rect.height);
      renderer.render(entry.scene, entry.camera);
    });
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => renderer.setSize(window.innerWidth, window.innerHeight));
})();
