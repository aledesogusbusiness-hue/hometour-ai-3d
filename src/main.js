      import * as THREE from 'three';
// Importazione corretta dei controlli per Vite / Vercel
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import './style.css';

// ... (lascia invariata la parte app.innerHTML) ...

let renderer;
let spark;
let camera;
let controls;
let scene;

async function init3D() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    viewer.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f6f2);

    camera = new THREE.PerspectiveCamera(
      55,
      viewer.clientWidth / viewer.clientHeight,
      0.01,
      1000
    );
    camera.position.set(0, 1.35, 3.2);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.2, 0);
    controls.minDistance = 0.35;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI * 0.94;

    // Inizializzazione Spark Renderer
    spark = new SparkRenderer({ renderer, scene, camera });

    const splat = new SplatMesh({
      url: '/assets/bedroom.spz'
    });

    splat.position.set(0, 0, 0);
    splat.rotation.set(0, 0, 0);
    splat.scale.setScalar(1);
    
    // Aggiunta dello Splat a Spark
    spark.add(splat);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xd8d5ce, 0.8);
    scene.add(ambient);

    const resize = () => {
      const w = viewer.clientWidth;
      const h = viewer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', resize);

    // CICLO DI ANIMAZIONE CORRETTO
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Aggiorna il rendering del Gaussian Splatting
      if (spark) {
        spark.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    setTimeout(() => loader.classList.add('hidden'), 900);
  } catch (err) {
    console.error("Errore durante il caricamento 3D:", err);
    loader.classList.add('hidden');
    errorBox.hidden = false;
  }
}

// ... (lascia invariati gli Event Listener in fondo al file) ...
