(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg3d-canvas');
  if (!canvas) return;

  const isSmall = window.innerWidth <= 414;
  const objectCount = isSmall ? 2 : 4;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // no WebGL — leave the static background from CSS
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  const gold = 0xD9A73B;
  const navy = 0x2A3550;
  const shapes = [];
  const geometries = [
    new THREE.TorusGeometry(1.2, 0.08, 8, 40),
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.06, 8, 32),
  ];

  for (let i = 0; i < objectCount; i++) {
    const geo = geometries[i % geometries.length];
    const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? gold : navy, wireframe: true, transparent: true, opacity: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6);
    scene.add(mesh);
    shapes.push(mesh);
  }

  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    shapes.forEach((s, i) => {
      s.rotation.x += 0.001 + i * 0.0002;
      s.rotation.y += 0.0015;
      s.position.y += Math.sin((Date.now() / 2000) + i) * 0.0008 - scrollY * 0.00002;
    });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
