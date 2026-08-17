import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import './style.css';

// IMPORTA IL FILE SPZ DIRETTAMENTE QUI
import modelUrl from '/public/assets/bedroom.spz?url';

// ... (lascia invariata la parte app.innerHTML) ...

// Nella funzione init3D(), sostituisci il passaggio dell'url:
async function init3D() {
  try {
    // ... setup renderer, scene, camera ...

    spark = new SparkRenderer({ renderer });

    // Usa modelUrl importato sopra!
    const splat = new SplatMesh({
      url: modelUrl
    });

    splat.position.set(0, 0, 0);
    splat.scale.setScalar(1);
    scene.add(splat);

    // ... (resto del codice)
