function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mapProjectsToStickers(projects) {
  const placements = [
    { pos: [0.5, 0.35, 0.62], rot: [0, 0, 0.15], size: [0.52, 0.38] },
    { pos: [-0.55, 0.3, 0.62], rot: [0, 0, -0.1], size: [0.46, 0.38] },
    { pos: [0.6, -0.25, 0.62], rot: [0, 0, 0.08], size: [0.48, 0.36] },
    { pos: [-0.5, -0.28, 0.62], rot: [0, 0, -0.12], size: [0.46, 0.36] },
    { pos: [1.42, 0.1, 0.1], rot: [0, Math.PI / 2, -0.1], size: [0.46, 0.36] },
  ];

  return projects.slice(0, placements.length).map((project, index) => ({
    label: project.title.length > 20 ? `${project.title.slice(0, 20)}...` : project.title,
    tag: project.tag ?? "Case Study",
    desc: project.subtitle,
    emoji: project.emoji ?? "📌",
    color: project.color ?? 0x5f976f,
    url: project.href ?? "#",
    ...placements[index],
  }));
}

function buildStickerTexture(s) {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 200;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  const r = (s.color >> 16) & 255;
  const g = (s.color >> 8) & 255;
  const b = s.color & 255;

  ctx.fillStyle = `rgb(${Math.min(r + 24, 255)},${Math.min(g + 24, 255)},${Math.min(b + 24, 255)})`;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(5, 5, 246, 190, 14);
  else ctx.rect(5, 5, 246, 190);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(5, 5, 246, 190, 14);
  else ctx.rect(5, 5, 246, 190);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 5]);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(14, 14, 228, 172, 8);
  else ctx.rect(14, 14, 228, 172);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = "68px serif";
  ctx.textAlign = "center";
  ctx.fillText(s.emoji, 128, 92);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "bold 20px Georgia, serif";
  ctx.fillText(s.label, 128, 160);

  return new window.THREE.CanvasTexture(cv);
}

export function initSuitcaseScene(projects) {
  if (!window.THREE) return;

  const wrapper = document.getElementById("canvas-wrapper");
  const canvas = document.getElementById("scene-canvas");
  if (!wrapper || !canvas) return;

  const panel = document.getElementById("panel");
  const cursorEl = document.getElementById("cursor");
  const loader = document.getElementById("loader");
  const stickers = mapProjectsToStickers(projects);

  const renderer = new window.THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;

  const scene = new window.THREE.Scene();
  scene.fog = new window.THREE.FogExp2(0xe4d6bf, 0.05);

  const camera = new window.THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.18, 5.15);

  function onResize() {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  onResize();
  window.addEventListener("resize", onResize);

  scene.add(new window.THREE.AmbientLight(0xffe8b0, 0.34));

  const keyLight = new window.THREE.DirectionalLight(0xfff2d5, 1.3);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const fillLight = new window.THREE.DirectionalLight(0x7aa06d, 0.22);
  fillLight.position.set(-3, 2, 2);
  scene.add(fillLight);

  const rimLight = new window.THREE.DirectionalLight(0xffe090, 0.42);
  rimLight.position.set(0, -3, -4);
  scene.add(rimLight);

  const ground = new window.THREE.Mesh(
    new window.THREE.PlaneGeometry(12, 12),
    new window.THREE.ShadowMaterial({ opacity: 0.25 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.35;
  ground.receiveShadow = true;
  scene.add(ground);

  const suitcaseGroup = new window.THREE.Group();
  scene.add(suitcaseGroup);

  function mat(color, rough = 0.85, metal = 0.05) {
    return new window.THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  }
  function box(w, h, d, color, rough, metal) {
    const mesh = new window.THREE.Mesh(new window.THREE.BoxGeometry(w, h, d), mat(color, rough, metal));
    mesh.castShadow = true;
    return mesh;
  }

  suitcaseGroup.add(box(2.8, 1.9, 1.2, 0x7a4a1e));
  const lid = box(2.8, 0.86, 1.22, 0x8a5420);
  lid.position.y = 0.02;
  suitcaseGroup.add(lid);

  function trim(w, h, d, x, y, z) {
    const mesh = box(w, h, d, 0xc8a040, 0.35, 0.75);
    mesh.position.set(x, y, z);
    suitcaseGroup.add(mesh);
  }
  trim(2.88, 0.055, 1.3, 0, 0.02, 0);
  trim(0.055, 1.96, 1.3, 1.42, 0, 0);
  trim(0.055, 1.96, 1.3, -1.42, 0, 0);
  trim(2.88, 0.055, 0.055, 0, 0, 0.625);
  trim(2.88, 0.055, 0.055, 0, 0, -0.625);

  [-1.35, 1.35].forEach((x) => [-0.88, 0.88].forEach((y) => {
    const stud = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.055, 8, 8), mat(0xd4b040, 0.25, 0.85));
    stud.position.set(x, y, 0.625);
    stud.castShadow = true;
    suitcaseGroup.add(stud);
  }));

  const hMat = mat(0xc8a040, 0.28, 0.85);
  [-0.3, 0.3].forEach((x) => {
    const base = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.11, 0.2, 0.1), hMat);
    base.position.set(x, 0.99, 0);
    suitcaseGroup.add(base);
  });
  const arc = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.3, 0.042, 10, 24, Math.PI), hMat);
  arc.position.set(0, 1.05, 0);
  suitcaseGroup.add(arc);

  [-0.5, 0.5].forEach((x) => {
    const latch = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.24, 0.13, 0.06), mat(0xd4aa30, 0.18, 0.92));
    latch.position.set(x, 0.02, 0.635);
    suitcaseGroup.add(latch);
  });

  const labelHolder = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.6, 0.38, 0.025), mat(0xc8a040, 0.4, 0.7));
  labelHolder.position.set(-1.0, -0.5, 0.628);
  suitcaseGroup.add(labelHolder);

  const stickerMeshes = stickers.map((s) => {
    const texture = buildStickerTexture(s);
    const mesh = new window.THREE.Mesh(
      new window.THREE.PlaneGeometry(s.size[0], s.size[1]),
      new window.THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0 })
    );
    mesh.position.set(...s.pos);
    mesh.rotation.set(...s.rot);
    mesh.userData.sticker = s;
    suitcaseGroup.add(mesh);
    return mesh;
  });

  const raycaster = new window.THREE.Raycaster();
  const mouseNDC = new window.THREE.Vector2();
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let hovered = null;

  document.addEventListener("mousemove", (event) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    mouse.tx = (cx / rect.width - 0.5) * 2;
    mouse.ty = (cy / rect.height - 0.5) * 2;
    mouseNDC.set(mouse.tx, -mouse.ty);

    if (cursorEl) {
      cursorEl.style.left = `${event.clientX}px`;
      cursorEl.style.top = `${event.clientY}px`;
    }

    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObjects(stickerMeshes);
    if (hits.length) {
      hovered = hits[0].object;
      cursorEl?.classList.add("hovering");
      document.body.style.cursor = "none";
    } else {
      hovered = null;
      cursorEl?.classList.remove("hovering");
      document.body.style.cursor = "";
    }
  });

  function openPanel(sticker) {
    if (!panel) return;
    document.getElementById("panel-emoji").textContent = sticker.emoji;
    document.getElementById("panel-title").textContent = sticker.label;
    document.getElementById("panel-tag").textContent = sticker.tag;
    document.getElementById("panel-desc").textContent = sticker.desc;
    const link = document.getElementById("panel-link");
    link.href = sticker.url;
    link.style.display = sticker.url ? "inline-block" : "none";
    panel.classList.add("visible");
  }

  document.addEventListener("click", () => {
    if (!hovered) return;
    openPanel(hovered.userData.sticker);
  });

  document.getElementById("panel-close")?.addEventListener("click", () => {
    panel?.classList.remove("visible");
  });

  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.013;

    mouse.x = lerp(mouse.x, mouse.tx, 0.055);
    mouse.y = lerp(mouse.y, mouse.ty, 0.055);
    suitcaseGroup.rotation.y = mouse.x * 0.38;
    suitcaseGroup.rotation.x = -mouse.y * 0.22;
    suitcaseGroup.rotation.z = Math.sin(clock * 0.4) * 0.014;
    suitcaseGroup.position.y = Math.sin(clock * 0.7) * 0.045;

    stickerMeshes.forEach((mesh) => {
      const target = mesh === hovered ? 1.07 : 1;
      mesh.scale.setScalar(lerp(mesh.scale.x, target, 0.1));
    });

    renderer.render(scene, camera);
  }
  animate();

  setTimeout(() => {
    loader?.classList.add("fade");
    setTimeout(() => loader?.remove(), 700);
  }, 900);
}
