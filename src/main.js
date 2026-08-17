import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as GaussianSplatJS from '@mkkellogg/gaussian-splat-nav';
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
          <div class="viewer-error" id="viewerError" hidden>
            <strong>3D viewer unavailable</strong>
            <span>Unable to load scene. Check file path or dependencies.</span>
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

  <div class="modal" id="modal" hidden>
    <div class="modal-card">
      <button class="modal-close" id="closeModal">×</button>
      <p class="eyebrow">HOMETOUR.AI</p>
      <h2>From space to experience.</h2>
      <p>
        This prototype uses your supplied Gaussian Splat scene as the interactive centerpiece.
      </p>
    </div>
  </div>
`;

const viewer = document.querySelector('#viewer');
const viewerWrap = document.querySelector('#viewerWrap');
const loader = document.querySelector('#loader');
const errorBox = document.querySelector('#viewerError');

let viewer3D;

async function init3D() {
  try {
    // Inizializza il Viewer Gaussian Splat nativo di Kellogg
    viewer3D = new GaussianSplatJS.Viewer({
      'rootElement': viewer,
      'cameraUp': [0, 1, 0],
      'initialCameraPosition': [0, 1.35, 3.2],
      'initialCameraLookAt': [0, 1.2, 0],
      'sphericalHarmonicsDegree': 0
    });

    // Carica la scena dal file .spz locale
    await viewer3D.addSplatScene('/assets/bedroom.spz', {
      'splatAlphaRemovalThreshold': 5,
      'showLoadingUI': false,
      'position': [0, 0, 0],
      'rotation': [0, 0, 0, 1],
      'scale': [1, 1, 1]
    });

    // Avvia il rendering
    viewer3D.start();

    // Nasconde lo spinner di caricamento
    setTimeout(() => loader.classList.add('hidden'), 500);

  } catch (err) {
    console.error("Errore nel caricamento del file SPZ:", err);
    loader.classList.add('hidden');
    errorBox.hidden = false;
  }
}

document.querySelector('#exploreBtn')?.addEventListener('click', () => {
  viewerWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#fullscreenBtn')?.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await viewerWrap.requestFullscreen?.();
  } else {
    await document.exitFullscreen?.();
  }
});

const modal = document.querySelector('#modal');
const openModal = () => { modal.hidden = false; };
const closeModal = () => { modal.hidden = true; };

document.querySelector('#aboutBtn')?.addEventListener('click', openModal);
document.querySelector('#infoBtn')?.addEventListener('click', openModal);
document.querySelector('#closeModal')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

init3D();
