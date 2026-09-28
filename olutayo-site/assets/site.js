import * as THREE from 'three';
import { RoomEnvironment } from './RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/* Portrait: fall back to a monogram until assets/portrait.jpg exists. */
const portrait = document.querySelector('.portrait');
const pImg = portrait?.querySelector('img');
if (pImg) {
  const miss = () => portrait.classList.add('no-photo');
  if (pImg.complete && pImg.naturalWidth === 0) miss();
  pImg.addEventListener('error', miss);
}

/* Draw the route lines in as each section enters the viewport. */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.line, .stop').forEach((el) => io.observe(el));

/* Copy email */
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied'; btn.classList.add('is-done');
    } catch {
      btn.textContent = 'Press Ctrl+C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
  });
});

/* ---------- 3D: fare card over a route network ---------- */
const canvas = document.getElementById('scene');
if (canvas) initScene(canvas).catch(() => canvas.remove());

function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function cardFront(photo, colors) {
  const W = 1712, H = 1080;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#15191d'; x.fillRect(0, 0, W, H);

  // Route lines across the card, 45-degree transit geometry
  const lw = 34;
  x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = lw;
  const routes = [
    [colors.pay,   [[-40, 640], [560, 640], [860, 340], [1780, 340]]],
    [colors.data,  [[-40, 720], [640, 720], [960, 420], [1780, 420]]],
    [colors.build, [[1180, -40], [1180, 180], [1460, 460], [1460, 1120]]],
  ];
  for (const [col, pts] of routes) {
    x.strokeStyle = col; x.beginPath();
    pts.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
    x.stroke();
  }
  const stations = [[560, 640], [640, 720], [1180, 340], [1260, 420], [1460, 700]];
  for (const [sx, sy] of stations) {
    x.beginPath(); x.arc(sx, sy, 26, 0, Math.PI * 2);
    x.fillStyle = '#f3f4f1'; x.fill();
    x.lineWidth = 12; x.strokeStyle = '#15191d'; x.stroke();
  }

  // Chip
  const cx = 130, cy = 330, cw = 210, ch = 160;
  const g = x.createLinearGradient(cx, cy, cx + cw, cy + ch);
  g.addColorStop(0, '#d9dde1'); g.addColorStop(.5, '#aeb4ba'); g.addColorStop(1, '#e6e9ec');
  roundRect(x, cx, cy, cw, ch, 26); x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(21,25,29,.45)'; x.lineWidth = 5;
  x.beginPath();
  x.moveTo(cx, cy + ch / 3); x.lineTo(cx + cw * .35, cy + ch / 3);
  x.moveTo(cx, cy + 2 * ch / 3); x.lineTo(cx + cw * .35, cy + 2 * ch / 3);
  x.moveTo(cx + cw, cy + ch / 3); x.lineTo(cx + cw * .65, cy + ch / 3);
  x.moveTo(cx + cw, cy + 2 * ch / 3); x.lineTo(cx + cw * .65, cy + 2 * ch / 3);
  x.rect(cx + cw * .35, cy + ch * .22, cw * .3, ch * .56);
  x.stroke();

  // Contactless waves
  x.strokeStyle = '#f3f4f1'; x.lineWidth = 12; x.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    x.beginPath(); x.arc(400, 410, 30 + i * 26, -Math.PI / 4.2, Math.PI / 4.2); x.stroke();
  }

  // Photo, printed like an ID card
  if (photo) {
    const pw = 330, ph = 400, px = W - pw - 110, py = 110;
    x.save();
    roundRect(x, px, py, pw, ph, 28); x.clip();
    const s = Math.max(pw / photo.width, ph / photo.height);
    const dw = photo.width * s, dh = photo.height * s;
    x.drawImage(photo, px + (pw - dw) / 2, py - (dh - ph) * 0.1, dw, dh);
    x.restore();
    roundRect(x, px, py, pw, ph, 28); x.lineWidth = 10; x.strokeStyle = '#f3f4f1'; x.stroke();
  }

  // Type
  x.fillStyle = '#f3f4f1';
  x.font = '800 60px Overpass, sans-serif';
  x.fillText('OS', 130, 200);
  x.font = '800 104px Overpass, sans-serif';
  x.fillText('OLUTAYO SOLANA', 130, H - 150);
  x.font = '700 44px Overpass, sans-serif';
  x.fillStyle = '#b7bdc3';
  x.fillText('PRODUCT MANAGER   DUBLIN', 134, H - 80);
  return c;
}

function cardBack(colors) {
  const W = 1712, H = 1080;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#15191d'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#050607'; x.fillRect(0, 110, W, 190);
  const bw = W / 3;
  [colors.pay, colors.data, colors.build].forEach((col, i) => { x.fillStyle = col; x.fillRect(i * bw, H - 34, bw, 34); });
  x.fillStyle = '#f3f4f1';
  x.font = '800 96px Overpass, sans-serif';
  x.fillText('Next stop: your team.', 110, 500);
  x.font = '700 58px Overpass, sans-serif';
  x.fillStyle = '#b7bdc3';
  x.fillText('solanatayo@gmail.com', 110, 640);
  x.fillText('+353 89 944 2812', 110, 730);
  x.fillText('linkedin.com/in/olutayosolana', 110, 820);
  return c;
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function faceGeometry(shape, w, h) {
  const geo = new THREE.ShapeGeometry(shape, 12);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  return geo;
}

async function initScene(canvas) {
  const colors = { pay: css('--pay') || '#00875a', data: css('--data') || '#1f5fd1', build: css('--build') || '#e0590f' };
  await Promise.race([document.fonts.load('800 60px Overpass'), new Promise((r) => setTimeout(r, 1200))]);
  const photo = await loadImage('assets/portrait.jpg');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 2.1, 9.2);
  camera.lookAt(0, -0.2, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 4); scene.add(key);

  /* Route network: three tubes on a tilted plane */
  const net = new THREE.Group();
  net.position.set(0, -1.55, 0);
  scene.add(net);
  const P = (x, z) => new THREE.Vector3(x, 0, z);
  const paths = [
    [colors.pay,   [P(-4.2, 1.2), P(-1.6, 1.2), P(0, -0.4), P(4.2, -0.4)]],
    [colors.data,  [P(-4.2, 1.7), P(-1.2, 1.7), P(0.5, 0), P(4.2, 0)]],
    [colors.build, [P(-0.6, 2.15), P(-0.6, 1.9), P(1.4, -0.1), P(1.4, -2.2)]],
  ];
  const trains = [];
  for (const [col, pts] of paths) {
    const path = new THREE.CurvePath();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const smooth = new THREE.CatmullRomCurve3(path.getSpacedPoints(80), false, 'centripetal', 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.45, metalness: 0.05 });
    net.add(new THREE.Mesh(new THREE.TubeGeometry(smooth, 220, 0.075, 16, false), mat));
    for (let t = 0.12; t < 0.95; t += 0.26) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), new THREE.MeshStandardMaterial({ color: 0xf3f4f1, roughness: 0.3 }));
      s.position.copy(smooth.getPointAt(t)); net.add(s);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 32), new THREE.MeshStandardMaterial({ color: 0x15191d }));
      ring.rotation.x = Math.PI / 2; ring.position.copy(s.position); net.add(ring);
    }
    const train = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.28, 6, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9 }));
    net.add(train);
    trains.push({ mesh: train, curve: smooth, t: Math.random() });
  }

  /* Fare card */
  const W = 3.4, H = 2.14, D = 0.05, R = 0.16;
  const shape = roundedShape(W, H, R);
  const card = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 12 }),
    new THREE.MeshPhysicalMaterial({ color: 0x15191d, roughness: 0.35, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 })
  );
  body.position.z = -D / 2;
  card.add(body);

  const tex = (cv) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
  const faceMat = (cv) => new THREE.MeshPhysicalMaterial({ map: tex(cv), roughness: 0.32, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08 });
  const front = new THREE.Mesh(faceGeometry(shape, W, H), faceMat(cardFront(photo, colors)));
  front.position.z = D / 2 + 0.014;
  const back = new THREE.Mesh(faceGeometry(shape, W, H), faceMat(cardBack(colors)));
  back.position.z = -D / 2 - 0.014; back.rotation.y = Math.PI;
  card.add(front, back);
  card.position.set(0, 0.35, 0);
  scene.add(card);

  /* Soft contact shadow */
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sx = sc.getContext('2d');
  const rg = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(18,21,24,.35)'); rg.addColorStop(1, 'rgba(18,21,24,0)');
  sx.fillStyle = rg; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.5;
  scene.add(shadow);

  /* Interaction: tilt to pointer, tap to flip */
  const target = { x: 0, y: 0 };
  let flip = 0, flipTarget = 0;
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
    target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.45;
  });
  canvas.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.intersectObject(card, true).length) { flipTarget += Math.PI; if (reduce) flip = flipTarget; render(); }
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the card framed on narrow screens
    camera.position.z = w / h < 1.1 ? 10.6 : 9.2;
    camera.updateProjectionMatrix();
    render();
  }
  new ResizeObserver(resize).observe(canvas);

  const clock = new THREE.Clock();
  let elapsed = 0;
  function render() { renderer.render(scene, camera); }
  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    flip += (flipTarget - flip) * (1 - Math.pow(0.001, dt));
    card.rotation.y += ((target.y + flip + Math.sin(elapsed * 0.4) * 0.12) - card.rotation.y) * (1 - Math.pow(0.02, dt));
    card.rotation.x += ((-0.12 + target.x) - card.rotation.x) * (1 - Math.pow(0.02, dt));
    card.position.y = 0.35 + Math.sin(elapsed * 0.9) * 0.08;
    net.rotation.y = Math.sin(elapsed * 0.15) * 0.25;
    for (const tr of trains) {
      tr.t = (tr.t + dt * 0.07) % 1;
      tr.mesh.position.copy(tr.curve.getPointAt(tr.t));
      tr.mesh.position.y += 0.02;
      const tan = tr.curve.getTangentAt(tr.t);
      tr.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    }
    render();
  }

  // Initial pose, then animate only while on screen
  card.rotation.set(-0.12, 0.25, 0);
  for (const tr of trains) tr.mesh.position.copy(tr.curve.getPointAt(tr.t));
  resize();
  if (reduce) { render(); return; }
  let running = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; clock.getDelta(); renderer.setAnimationLoop(tick); }
    else if (!e.isIntersecting && running) { running = false; renderer.setAnimationLoop(null); }
  }).observe(canvas);
}
