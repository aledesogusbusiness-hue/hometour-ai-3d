import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <img src="/assets/logo.jpg" alt="HomeTour.ai" />
      </div>
      <div class="top-actions">
        <button class="ghost-btn" id="aboutBtn">How it works</button>
        <button class="solid-btn" id="fullscreenBtn">Fullscreen</button>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">IMMERSIVE PROPERTY EXPERIENCES</p>
          <h1>Walk through a space.<br><em>Before you visit it.</em></h1>
          <p class="lede">
            HomeTour.ai turns real spaces into interactive 3D experiences,
            accessible directly from the browser.
          </p>
          <div class="hero-actions">
            <button class="solid-btn large" id="exploreBtn">Explore the space <span>↗</span></button>
            <button class="ghost-btn large" id="infoBtn">Discover HomeTour.ai</button>
          </div>
        </div>

        <div class="viewer-wrap" id="viewerWrap">
          <div id="viewer"></div>
          <div class="viewer-overlay">
            <div class="viewer-status"><span class="status-dot"></span> LIVE 3D VIEW</div>
            <div class="viewer-hint">Drag to orbit · Scroll to zoom</div>
          </div>
          <div class="loader" id="loader">
            <div class="spinner"></div>
            <span>Loading 3D space…</span>
          </div>
          <div class="viewer-error" id="viewerError" hidden style="background: rgba(180,0,0,0.95); color: #fff; padding: 12px; font-size: 11px; font-family: monospace; word-break: break-all; z-index: 999; text-align: left;">
            <strong style="display:block; margin-bottom: 4px; font-size: 12px;">3D Viewer Debug Error:</strong>
            <span id="errorMessage">Unable to load scene file.</span>
          </div>
        </div>
      </section>

      <section class="feature-grid" id="about">
        <article>
          <span>01</span>
          <h2>Capture</h2>
          <p>Transform photos or spatial captures into a detailed digital representation.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Reconstruct</h2>
          <p>Build an explorable 3D environment while preserving the character of the original space.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Experience</h2>
          <p>Give clients a browser-based tour they can explore from desktop or mobile.</p>
        </article>
      </section>

      <section class="closing">
        <p class="eyebrow">HOMETOUR.AI</p>
        <h2>Real spaces.<br>Digital experiences.</h2>
      </section>
    </main>

    <footer>
      <span>© HomeTour.ai</span>
      <span>Immersive 3D property technology</span>
    </footer>
  </div>
`;

const viewer = document.querySelector('#viewer');
const loader = document.querySelector('#loader');
const errorBox = document.querySelector('#viewerError');
const errorMessage = document.querySelector('#errorMessage');

function showError(msg) {
  if (loader) loader.classList.add('hidden');
  if (errorBox) errorBox.hidden = false;
  if (errorMessage) errorMessage.innerText = msg;
}

async function init3D() {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    viewer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f6f2);

    const camera = new THREE.PerspectiveCamera(55, viewer.clientWidth / viewer.clientHeight, 0.01, 1000);
    camera.position.set(0, 1.35, 3.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.2, 0);

    const spark = new SparkRenderer({ renderer });

    // Caricamento diretto del file statico servito dalla cartella public/assets
    const splat = new SplatMesh({
      url: '/assets/bedroom.spz'
    });

    splat.position.set(0, 0, 0);
    splat.scale.setScalar(1);
    scene.add(splat);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xd8d5ce, 0.8);
    scene.add(ambient);

    window.addEventListener('resize', () => {
      camera.aspect = viewer.clientWidth / viewer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (spark && spark.update) spark.update();
      renderer.render(scene, camera);
    };
    animate();

    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 1000);

  } catch (err) {
    console.error(err);
    showError(err.stack || err.message || String(err));
  }
}

init3D();
