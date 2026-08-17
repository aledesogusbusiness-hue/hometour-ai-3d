import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div class="brand"><img src="/assets/logo.jpg" alt="HomeTour.ai" /></div>
    </header>
    <main>
      <section class="hero">
        <div class="viewer-wrap" id="viewerWrap" style="position:relative; min-height: 400px; background: #222;">
          <div id="viewer" style="width:100%; height:400px;"></div>
          <div id="debugConsole" style="position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.9); color:#00ff00; font-family:monospace; font-size:11px; padding:15px; overflow:auto; z-index:9999;">
            > Avvio diagnostica HomeTour 3D...<br>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const log = (msg) => {
  const consoleEl = document.querySelector('#debugConsole');
  if (consoleEl) consoleEl.innerHTML += `> ${msg}<br>`;
};

async function runDiagnosticAndInit() {
  log("1. Controllo supporto WebGL2...");
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    log("ERRORE: WebGL2 non supportato su questo browser.");
    return;
  }
  log("WebGL2 OK.");

  log("2. Verifica scaricamento asset statico (/assets/bedroom.spz)...");
  try {
    const res = await fetch('/assets/bedroom.spz');
    log(`HTTP Status: ${res.status} ${res.statusText}`);
    log(`Content-Type: ${res.headers.get('content-type')}`);
    
    if (!res.ok) {
      log("ERRORE: Impossibile trovare il file sul server (404/500).");
      return;
    }

    const blob = await res.blob();
    log(`Dimensione file scaricato: ${(blob.size / (1024 * 1024)).toFixed(2)} MB`);

    if (blob.size < 1000) {
      log("ERRORE CRITICO: Il file scaricato è un puntatore Git LFS o un testo HTML, non il modello 3D reale.");
      return;
    }

    log("File .spz valido e scaricato correttamente. Inizializzazione Three.js/Spark...");
    initWebGLScene();

  } catch (err) {
    log(`ERRORE FETCH: ${err.message}`);
  }
}

function initWebGLScene() {
  try {
    const container = document.querySelector('#viewer');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.35, 3.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const spark = new SparkRenderer({ renderer });
    const splat = new SplatMesh({ url: '/assets/bedroom.spz' });
    scene.add(splat);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (spark && spark.update) spark.update();
      renderer.render(scene, camera);
    };
    animate();

    // Se l'inizializzazione ha successo, nascondi la console di debug dopo 2 secondi
    setTimeout(() => {
      const consoleEl = document.querySelector('#debugConsole');
      if (consoleEl) consoleEl.style.display = 'none';
    }, 2000);

  } catch (e) {
    log(`ERRORE INIZIALIZZAZIONE SPARK: ${e.message}`);
  }
}

runDiagnosticAndInit();
