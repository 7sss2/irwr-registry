(function () {
  if (typeof THREE === 'undefined') return;
  const host = document.getElementById('globeHost');
  if (!host) return;

  const isMobile = window.innerWidth <= 414;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0.4, 6.2);

  scene.add(new THREE.HemisphereLight(0x8fa3c9, 0x05070b, 0.65));
  const key = new THREE.DirectionalLight(0xfff1d6, 1.1);
  key.position.set(4, 4, 4);
  if (!isMobile) {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 5;
  }
  scene.add(key);
  const rim = new THREE.PointLight(0xD9A73B, 0.7, 15);
  rim.position.set(-4, 1, -3);
  scene.add(rim);

  // solid globe — dark navy sphere with a faint gold graticule overlay,
  // replacing the old flat wireframe with a shaded, premium-feeling object
  const globeGroup = new THREE.Group();
  const seg = isMobile ? 40 : 48;
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(2, seg, seg),
    new THREE.MeshStandardMaterial({ color: 0x151B26, metalness: 0.35, roughness: 0.55 })
  );
  globe.castShadow = !isMobile;
  globeGroup.add(globe);

  if (!isMobile) {
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(2.01, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xD9A73B, wireframe: true, transparent: true, opacity: 0.12 })
    );
    globeGroup.add(wire);

    const catcher = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.25 }));
    catcher.rotation.x = -Math.PI / 2;
    catcher.position.y = -2.4;
    catcher.receiveShadow = true;
    scene.add(catcher);
  }
  scene.add(globeGroup);

  // Approximate country centroids for every single-country value in the
  // real GBR-sourced dataset (js/data.js). Combo values ("Japan / USA")
  // and non-country values ("International", "") intentionally have no
  // entry here and simply get no marker. USSR/Yugoslavia are historical —
  // placed at their modern-day successor states' rough centroids.
  const coords = {
    USA: [38, -97], China: [35, 105], Kazakhstan: [48, 68], 'United Kingdom': [54, -2],
    Germany: [51, 10], Japan: [36, 138], France: [46, 2], Russia: [61, 105],
    India: [21, 78], Portugal: [39.5, -8], UAE: [24, 54], Australia: [-25, 133],
    Italy: [42.8, 12.8], 'South Korea': [36, 128], Canada: [56, -106], Spain: [40, -4],
    Singapore: [1.35, 103.8], 'Saudi Arabia': [24, 45], Norway: [61, 8], Netherlands: [52, 5],
    Finland: [64, 26], Turkey: [39, 35], Croatia: [45, 16], USSR: [61, 105],
    Kenya: [1, 38], Jamaica: [18, -77], Brazil: [-14, -51], Taiwan: [23.7, 121],
    Indonesia: [-5, 120], Argentina: [-38, -63], Israel: [31, 35], Greece: [39, 22],
    Latvia: [57, 25], Estonia: [59, 26], 'South Africa': [-30, 25], Nigeria: [9, 8],
    Belarus: [53, 28], Switzerland: [47, 8], Guatemala: [15.5, -90], Colombia: [4, -72],
    Sweden: [62, 15], Mexico: [23, -102], Denmark: [56, 10], Yugoslavia: [44, 21],
    Iceland: [65, -19], Ukraine: [49, 32], Hungary: [47, 20],
  };

  function toVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  const byCountry = IRWR.groupBy('country');
  const markers = [];
  const markerGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const markerMat = new THREE.MeshStandardMaterial({ color: 0xD9A73B, emissive: 0x6b4d15, metalness: 0.4, roughness: 0.4 });
  Object.keys(coords).forEach((country) => {
    if (!byCountry[country]) return;
    const [lat, lng] = coords[country];
    const pos = toVector3(lat, lng, 2.05);
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(pos);
    marker.userData.country = country;
    globe.add(marker);
    markers.push(marker);
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let autoRotate = true;
  let dragging = false;
  let lastX = 0;

  function setPointer(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  renderer.domElement.addEventListener('mousemove', (e) => {
    setPointer(e);
    if (dragging) {
      globeGroup.rotation.y += (e.clientX - lastX) * 0.005;
      lastX = e.clientX;
      return;
    }
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(markers)[0];
    IRWR.highlightCountryRow(hit ? hit.object.userData.country : null);
  });
  renderer.domElement.addEventListener('mousedown', (e) => { dragging = true; autoRotate = false; lastX = e.clientX; });
  window.addEventListener('mouseup', () => { dragging = false; });
  renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(markers)[0];
    if (hit) {
      const row = document.querySelector(`.country-row[data-country="${hit.object.userData.country}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  });

  // gentle scroll parallax — a slow tilt as the section scrolls through view,
  // on top of the existing auto-rotate/drag behavior
  let scrollTilt = 0;
  function onScroll() {
    const rect = host.getBoundingClientRect();
    const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
    scrollTilt = (progress - 0.5) * 0.5;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) globeGroup.rotation.y += 0.0015;
    globeGroup.rotation.x += (scrollTilt - globeGroup.rotation.x) * 0.03;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
