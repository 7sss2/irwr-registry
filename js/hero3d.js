(function () {
  if (typeof THREE === 'undefined') return;
  const host = document.getElementById('hero3dHost');
  if (!host || window.innerWidth <= 414) return;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.z = 6;

  const group = new THREE.Group();
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.1, 0.32, 120, 16),
    new THREE.MeshBasicMaterial({ color: 0xD9A73B, wireframe: true, transparent: true, opacity: 0.55 })
  );
  group.add(knot);
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 })
  );
  ico.position.set(2, 1, -1);
  group.add(ico);
  scene.add(group);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });
  window.addEventListener('resize', () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.003;
    group.rotation.x += (mouseY * 0.4 - group.rotation.x) * 0.02;
    group.rotation.z += (mouseX * 0.2 - group.rotation.z) * 0.02;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
