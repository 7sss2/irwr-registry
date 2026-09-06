(function () {
  if (typeof THREE === 'undefined') return;
  const host = document.getElementById('hero3dHost');
  if (!host) return;

  const isMobile = window.innerWidth <= 414;
  const gold = 0xD9A73B;
  const goldDeep = 0xB98A26;
  const navy = 0x151B26;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0.6, 9);

  // lighting rig — warm key + cool fill + a low gold rim, tuned for a soft
  // premium look rather than flat wireframe (matches the awwwards-style
  // reference: matte-metal objects with soft grounded shadows, not photoreal PBR)
  const key = new THREE.DirectionalLight(0xfff1d6, 1.5);
  key.position.set(4, 6, 5);
  if (!isMobile) {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.camera.left = -6; key.shadow.camera.right = 6;
    key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
  }
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0x8fa3c9, 0x0a0d13, 0.55));
  const rim = new THREE.PointLight(gold, 0.9, 20);
  rim.position.set(-5, 2, -3);
  scene.add(rim);

  // shadow-catcher plane — invisible except where a shadow falls, so it
  // composites onto the hero photo behind the canvas instead of a visible ground
  if (!isMobile) {
    const catcher = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.28 }));
    catcher.rotation.x = -Math.PI / 2;
    catcher.position.y = -2.3;
    catcher.receiveShadow = true;
    scene.add(catcher);
  }

  function goldMaterial(color) {
    return new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.32, transparent: true });
  }

  // --- object 1: trophy cup, built as a lathe from a hand-tuned profile ---
  const trophyGroup = new THREE.Group();
  const seg = isMobile ? 20 : 48;
  const profile = [
    [0.58, 0], [0.62, 0.05], [0.6, 0.1], [0.16, 0.22], [0.14, 0.85], [0.18, 0.9],
    [0.32, 0.98], [0.22, 1.08], [0.16, 1.16], [0.34, 1.28], [0.5, 1.42], [0.98, 1.62],
    [1.0, 1.98], [0.85, 2.12], [0.9, 2.22], [1.0, 2.28], [0.86, 2.36], [0, 2.4],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, seg), goldMaterial(gold));
  cup.position.y = -1.4;
  cup.castShadow = !isMobile;
  trophyGroup.add(cup);

  if (!isMobile) {
    // two handles, each a half-torus arc mirrored to either side of the bowl
    const handleGeo = new THREE.TorusGeometry(0.4, 0.05, 10, 24, Math.PI * 1.2);
    [-1, 1].forEach((side) => {
      const handle = new THREE.Mesh(handleGeo, goldMaterial(goldDeep));
      handle.rotation.z = Math.PI / 2;
      handle.rotation.y = side > 0 ? 0.15 : Math.PI - 0.15;
      handle.position.set(side * 1.0, 0.45, 0);
      handle.castShadow = true;
      trophyGroup.add(handle);
    });
  }
  const trophyX = isMobile ? 0.55 : 2.5;
  const trophyBaseY = isMobile ? 0.55 : -0.65;
  trophyGroup.position.set(trophyX, trophyBaseY, -0.5);
  trophyGroup.scale.setScalar(isMobile ? 0.4 : 0.85);
  scene.add(trophyGroup);

  // --- object 2: medal on a ribbon, floating above and left of the trophy ---
  const medalGroup = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.14, isMobile ? 24 : 48), goldMaterial(gold));
  disc.rotation.x = Math.PI / 2;
  disc.castShadow = !isMobile;
  medalGroup.add(disc);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 8, isMobile ? 24 : 40), goldMaterial(goldDeep));
  bezel.castShadow = !isMobile;
  medalGroup.add(bezel);

  if (!isMobile) {
    // embossed 5-point star on the medal face
    const starShape = new THREE.Shape();
    const spikes = 5, outerR = 0.48, innerR = 0.19;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? starShape.moveTo(x, y) : starShape.lineTo(x, y);
    }
    starShape.closePath();
    const star = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }), goldMaterial(0xF3D68A));
    star.position.z = 0.075;
    star.castShadow = true;
    medalGroup.add(star);
  }

  // ribbon — two wide navy tails hanging above the medal, meeting where it clips on
  const ribbonMat = new THREE.MeshStandardMaterial({ color: navy, metalness: 0.05, roughness: 0.8, side: THREE.DoubleSide, transparent: true });
  [-1, 1].forEach((side) => {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.6, 1, 6), ribbonMat);
    strip.position.set(side * 0.32, 1.35, -0.3);
    strip.rotation.z = side * 0.16;
    strip.rotation.y = side * 0.25;
    if (!isMobile) strip.castShadow = true;
    medalGroup.add(strip);
  });
  const clasp = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 16), goldMaterial(goldDeep));
  clasp.position.set(0, 0.82, 0.02);
  medalGroup.add(clasp);

  const medalX = isMobile ? -0.8 : -2.6;
  medalGroup.rotation.x = 0.15;
  medalGroup.position.set(medalX, 1.5, 0.4);
  medalGroup.scale.setScalar(isMobile ? 0.4 : 0.55);
  scene.add(medalGroup);

  // --- scroll parallax: while the hero is in view, scrolling rotates/lifts
  // the objects and gently shrinks + fades them out toward the next section ---
  let scrollT = 0;
  function onScroll() {
    const heroH = host.parentElement ? host.parentElement.clientHeight : window.innerHeight;
    scrollT = Math.min(Math.max(window.scrollY / heroH, 0), 1);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  });

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    trophyGroup.rotation.y = t * 0.25 + scrollT * 2.2;
    trophyGroup.position.y = trophyBaseY - scrollT * 1.6;
    trophyGroup.rotation.x = mouseY * 0.08;

    medalGroup.rotation.y = -t * 0.3 + scrollT * -1.8;
    medalGroup.position.y = 1.5 + Math.sin(t * 0.6) * 0.06 + scrollT * 2.0;
    medalGroup.position.x = medalX + mouseX * 0.15;

    const fade = 1 - scrollT * 0.9;
    [trophyGroup, medalGroup].forEach((g) => g.traverse((obj) => { if (obj.material) obj.material.opacity = fade; }));

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
