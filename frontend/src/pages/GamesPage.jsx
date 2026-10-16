import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const THEME = {
  primary: '#10b981',
  glow: 'rgba(16, 185, 129, 0.45)',
  bgGlass: 'rgba(13, 20, 38, 0.88)',
  border: 'rgba(16, 185, 129, 0.35)',
};

// -------------------------------------------------------------
// EDUCATIONAL 3D RUNNER ENGINE WITH REAL FIRST-AID MEDICAL KIT
// -------------------------------------------------------------
const RUNNER_3D_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campus Evacuation Runner 3D</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #060913; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; height: 100vh; }
    #canvas-container { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; }
    
    .hud-top {
      position: absolute; top: 16px; left: 16px; right: 16px;
      display: flex; justify-content: space-between; align-items: center;
      pointer-events: none; z-index: 10;
    }
    .hud-pill {
      background: rgba(13, 20, 38, 0.88); backdrop-filter: blur(12px);
      border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px;
      padding: 10px 18px; display: flex; gap: 18px; align-items: center;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
    }
    .hud-val { font-size: 13.5px; font-weight: 800; letter-spacing: 0.04em; }
    .val-dist { color: #10b981; }
    .val-score { color: #fbbf24; }
    .val-lives { color: #f43f5e; }

    .protocol-tip {
      position: absolute; top: 78px; left: 50%; transform: translateX(-50%);
      background: rgba(16, 185, 129, 0.18); border: 1.5px solid #10b981;
      color: #34d399; padding: 8px 22px; border-radius: 20px; font-size: 13px;
      font-weight: 800; letter-spacing: 0.04em; text-align: center;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); pointer-events: none;
      z-index: 10; transition: all 0.3s ease;
    }

    .touch-controls {
      position: absolute; bottom: 16px; left: 16px; right: 16px;
      display: flex; justify-content: space-between; align-items: center; z-index: 10;
    }
    .touch-btn {
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff; width: 50px; height: 50px; border-radius: 12px; font-size: 18px;
      font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .action-btn {
      height: 50px; padding: 0 20px; border-radius: 12px; font-size: 13px;
      font-weight: 800; cursor: pointer; border: none;
    }
    .btn-jump { background: #10b981; color: #060913; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
    .btn-duck { background: #3b82f6; color: #fff; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }

    /* Checkpoint Quiz Modal */
    .checkpoint-modal {
      position: absolute; inset: 0; background: rgba(6, 9, 19, 0.94);
      backdrop-filter: blur(12px); display: none; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 24px; z-index: 30;
    }
    .checkpoint-box {
      background: rgba(13, 20, 38, 0.95); border: 2px solid #f59e0b;
      box-shadow: 0 0 35px rgba(245, 158, 11, 0.35); border-radius: 20px;
      padding: 28px; max-width: 520px; width: 100%; text-align: left;
    }

    /* Game Over & Learning Debrief Modal */
    .game-modal {
      position: absolute; inset: 0; background: rgba(6, 9, 19, 0.96);
      backdrop-filter: blur(12px); display: none; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 24px; z-index: 40; overflow-y: auto;
    }
    .learning-card {
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px; padding: 16px; margin: 18px 0; text-align: left;
      font-size: 13px; line-height: 1.6; color: #cbd5e1; max-width: 500px;
    }
    .replay-btn {
      padding: 12px 28px; background: #10b981; color: #060913; border: none;
      border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }
  </style>
</head>
<body>

  <div id="canvas-container"></div>

  <div class="hud-top">
    <div class="hud-pill">
      <span class="hud-val val-dist" id="hud-dist">🏃 DIST: 0m / 400m</span>
      <span class="hud-val val-score" id="hud-score">⭐ PTS: 0</span>
      <span class="hud-val val-lives" id="hud-lives">❤️❤️❤️</span>
    </div>
  </div>

  <div class="protocol-tip" id="protocol-tip">
    💡 SAFETY PROTOCOL: W to Jump Fire • S to Duck Falling Cables & Beams
  </div>

  <div class="touch-controls">
    <div style="display: flex; gap: 8px;">
      <button class="touch-btn" id="btn-left">◀</button>
      <button class="touch-btn" id="btn-right">▶</button>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="action-btn btn-jump" id="btn-jump">JUMP ⬆</button>
      <button class="action-btn btn-duck" id="btn-duck">DUCK ⬇</button>
    </div>
  </div>

  <!-- CHECKPOINT DECISION MODAL -->
  <div class="checkpoint-modal" id="checkpoint-modal">
    <div class="checkpoint-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.08em;">
          🚨 EVACUATION DECISION GATE
        </span>
        <span style="font-size: 12px; color: #94a3b8;">Checkpoint</span>
      </div>
      <h3 style="font-size: 18px; color: #fff; margin: 0 0 16px 0;" id="cp-question">
        Corridor me dense smoke bhari hai aur alarm baj raha hai. Aapka safe action kya hoga?
      </h3>
      <div id="cp-options" style="display: flex; flex-direction: column; gap: 10px;"></div>
    </div>
  </div>

  <!-- END GAME & NDMA LEARNING SUMMARY -->
  <div class="game-modal" id="game-modal">
    <div style="font-size: 52px;" id="modal-icon">🏆</div>
    <h2 id="modal-title" style="font-size: 26px; color: #fff; margin: 8px 0 4px 0;">Assembly Ground Reached!</h2>
    <p id="modal-desc" style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;"></p>

    <div class="learning-card">
      <strong style="color: #10b981; display: block; margin-bottom: 6px; font-size: 14px;">
        📚 Key Disaster Safety Lessons:
      </strong>
      • <strong>Fire Evacuation:</strong> Always stay below 2 feet during smoke (smoke rises). Never use passenger elevators during a fire.<br/>
      • <strong>Earthquake Rule:</strong> Drop, Cover, and Hold On! Protect head under reinforced furniture.<br/>
      • <strong>First-Aid Gear:</strong> Sterile gauze, antiseptic, bandages, and burn dressings are essential survival kit components.<br/>
      • <strong>Extinguisher PASS Rule:</strong> Pull, Aim at base, Squeeze, Sweep side to side.<br/>
      • <strong>Emergency Helpline:</strong> Dial <strong>112</strong> (National Emergency Service).
    </div>

    <button class="replay-btn" onclick="location.reload()">Replay Simulation ↻</button>
  </div>

  <script>
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function playTone(freq, type, duration, gainVal = 0.1) {
      try {
        if (!audioCtx) audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }
    const sfxJump = () => playTone(440, 'triangle', 0.2, 0.12);
    const sfxDuck = () => playTone(220, 'sine', 0.18, 0.12);
    const sfxCollect = () => playTone(880, 'sine', 0.25, 0.18);
    const sfxHit = () => playTone(120, 'sawtooth', 0.35, 0.22);

    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.018);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 140);
    camera.position.set(0, 3.6, 6.2);
    camera.lookAt(0, 1.4, -6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    dirLight.position.set(6, 14, 6);
    scene.add(dirLight);

    const emergencySiren = new THREE.PointLight(0xef4444, 2.2, 35);
    emergencySiren.position.set(0, 5, -8);
    scene.add(emergencySiren);

    // ==========================================
    // PROPER HUMAN RUNNER BOY CHARACTER
    // ==========================================
    const boyRunner = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a110b, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const pantMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });

    const hips = new THREE.Group();
    hips.position.y = 1.0;
    boyRunner.add(hips);

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.32), shirtMat);
    torsoMesh.position.y = 0.38;
    hips.add(torsoMesh);

    const vestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.57, 0.22, 0.34), vestMat);
    vestStripe.position.y = 0.36;
    hips.add(vestStripe);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.22), bagMat);
    backpack.position.set(0, 0.38, 0.24);
    hips.add(backpack);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.85, 0);
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), skinMat);
    headGroup.add(headMesh);

    const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), hairMat);
    hairMesh.position.set(0, 0.05, -0.02);
    headGroup.add(hairMesh);
    hips.add(headGroup);

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.36, 0.68, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.14), shirtMat);
    leftArmMesh.position.y = -0.3;
    leftArmPivot.add(leftArmMesh);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
    leftHand.position.y = -0.62;
    leftArmPivot.add(leftHand);
    hips.add(leftArmPivot);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.36, 0.68, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.14), shirtMat);
    rightArmMesh.position.y = -0.3;
    rightArmPivot.add(rightArmMesh);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
    rightHand.position.y = -0.62;
    rightArmPivot.add(rightHand);
    hips.add(rightArmPivot);

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.16, 0, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), pantMat);
    leftLegMesh.position.y = -0.32;
    leftLegPivot.add(leftLegMesh);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.28), shoeMat);
    leftShoe.position.set(0, -0.65, -0.05);
    leftLegPivot.add(leftShoe);
    hips.add(leftLegPivot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.16, 0, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), pantMat);
    rightLegMesh.position.y = -0.32;
    rightLegPivot.add(rightLegMesh);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.28), shoeMat);
    rightShoe.position.set(0, -0.65, -0.05);
    rightLegPivot.add(rightShoe);
    hips.add(rightLegPivot);

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.03;
    boyRunner.add(aura);

    scene.add(boyRunner);

    // Corridor
    const tileGeo = new THREE.BoxGeometry(7.2, 0.2, 10);
    const tileMat1 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const tileMat2 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const tiles = [];
    const tileCount = 10;

    for (let i = 0; i < tileCount; i++) {
      const tile = new THREE.Mesh(tileGeo, i % 2 === 0 ? tileMat1 : tileMat2);
      tile.position.set(0, -0.1, -i * 10);
      scene.add(tile);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const lRail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.5, 10), railMat);
      lRail.position.set(-3.5, 0.75, 0);
      tile.add(lRail);
      const rRail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.5, 10), railMat);
      rRail.position.set(3.5, 0.75, 0);
      tile.add(rRail);
      tiles.push(tile);
    }

    const LANES = [-2.1, 0, 2.1];
    let targetLane = 1;
    let isJumping = false;
    let jumpVel = 0;
    let isDucking = false;
    let duckTimer = 0;
    let lives = 3;
    let score = 0;
    let distance = 0;
    let gameOver = false;
    let isPausedForCheckpoint = false;
    let checkpoint1Done = false;
    let checkpoint2Done = false;

    const TARGET_DIST = 400;
    const baseSpeed = 0.38;

    const obstacles = [];
    const collectibles = [];

    // Obstacle Generator
    function createObstacle(z) {
      const lane = LANES[Math.floor(Math.random() * LANES.length)];
      const rand = Math.random();
      let mesh, type;

      if (rand < 0.45) {
        type = 'FIRE';
        mesh = new THREE.Mesh(
          new THREE.ConeGeometry(0.65, 1.3, 8),
          new THREE.MeshBasicMaterial({ color: 0xf97316 })
        );
        mesh.position.set(lane, 0.65, z);
      } else if (rand < 0.75) {
        type = 'BEAM';
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.55, 0.55),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
        );
        mesh.position.set(lane, 1.68, z);
      } else {
        type = 'BLOCK';
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.85, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x64748b })
        );
        mesh.position.set(lane, 0.42, z);
      }

      mesh.userData = { type, hit: false };
      scene.add(mesh);
      obstacles.push(mesh);
    }

    // ==========================================
    // REAL 3D FIRST-AID MEDICAL KIT GENERATOR
    // ==========================================
    function createCollectible(z) {
      const lane = LANES[Math.floor(Math.random() * LANES.length)];
      
      const kitGroup = new THREE.Group();

      // 1. Clean White Medical Box Casing
      const caseMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.25, 
        metalness: 0.1 
      });
      const caseBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.54, 0.32), 
        caseMat
      );
      kitGroup.add(caseBody);

      // 2. Red Emergency Safety Cross ➕
      const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      
      // Front Cross
      const crossVFront = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.32, 0.02), crossMat);
      crossVFront.position.set(0, 0, 0.165);
      kitGroup.add(crossVFront);

      const crossHFront = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.02), crossMat);
      crossHFront.position.set(0, 0, 0.165);
      kitGroup.add(crossHFront);

      // Back Cross
      const crossVBack = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.32, 0.02), crossMat);
      crossVBack.position.set(0, 0, -0.165);
      kitGroup.add(crossVBack);

      const crossHBack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.02), crossMat);
      crossHBack.position.set(0, 0, -0.165);
      kitGroup.add(crossHBack);

      // 3. Top Carrying Handle
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
      const handleTop = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.04, 0.06), handleMat);
      handleTop.position.set(0, 0.32, 0);
      kitGroup.add(handleTop);

      const handleLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.06), handleMat);
      handleLeft.position.set(-0.13, 0.29, 0);
      kitGroup.add(handleLeft);

      const handleRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.06), handleMat);
      handleRight.position.set(0.13, 0.29, 0);
      kitGroup.add(handleRight);

      // Floating position in corridor
      kitGroup.position.set(lane, 1.05, z);
      kitGroup.userData = { collected: false };

      scene.add(kitGroup);
      collectibles.push(kitGroup);
    }

    for (let i = 1; i < 7; i++) {
      createObstacle(-24 - i * 22);
      if (i % 2 === 0) createCollectible(-24 - i * 22 - 11);
    }

    function shiftLeft() { if (targetLane > 0) { targetLane--; playTone(300, 'sine', 0.08); } }
    function shiftRight() { if (targetLane < 2) { targetLane++; playTone(300, 'sine', 0.08); } }
    function jump() { 
      if (!isJumping) { 
        isJumping = true; 
        jumpVel = 0.26; 
        sfxJump();
        showTip("🦘 HIGH LEAP: Leaping over hot fire hazard!");
      } 
    }
    function duck() { 
      if (!isDucking) { 
        isDucking = true; 
        duckTimer = 38; 
        sfxDuck();
        showTip("🛡️ DROP & CRAWL: Crawling under falling debris & smoke!");
      } 
    }

    window.addEventListener('keydown', (e) => {
      if (gameOver || isPausedForCheckpoint) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') shiftLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') shiftRight();
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !isJumping) jump();
      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && !isDucking) duck();
    });

    document.getElementById('btn-left').onclick = shiftLeft;
    document.getElementById('btn-right').onclick = shiftRight;
    document.getElementById('btn-jump').onclick = jump;
    document.getElementById('btn-duck').onclick = duck;

    const elDist = document.getElementById('hud-dist');
    const elScore = document.getElementById('hud-score');
    const elLives = document.getElementById('hud-lives');
    const elTip = document.getElementById('protocol-tip');
    const cpModal = document.getElementById('checkpoint-modal');
    const cpQuestion = document.getElementById('cp-question');
    const cpOptions = document.getElementById('cp-options');
    const modal = document.getElementById('game-modal');

    function showTip(msg) {
      elTip.textContent = msg;
    }

    // CHECKPOINT QUIZ
    const CHECKPOINTS = [
      {
        question: "Corridor me dense smoke bhari hai aur alarm baj raha hai. Aapka safe action kya hoga?",
        options: [
          { text: "Bina jhuke lift (elevator) se jaldi nikalne ki koshish karein", isCorrect: false },
          { text: "Drop ho kar zameen ke paas crawl karein aur exit stairs use karein", isCorrect: true },
          { text: "Bag aur laptop pack karne ke liye ruk jayein", isCorrect: false }
        ]
      },
      {
        question: "Active fire extinguisher chalane ke liye NDMA ka 'PASS' rule kya kehta hai?",
        options: [
          { text: "Pull pin, Aim at base, Squeeze lever, Sweep side to side", isCorrect: true },
          { text: "Push button, Air spray, Shoot top flame, Stop water", isCorrect: false },
          { text: "Pour water, Alert guard, Scream loud, Stand back", isCorrect: false }
        ]
      }
    ];

    function triggerCheckpoint(index) {
      isPausedForCheckpoint = true;
      const cp = CHECKPOINTS[index];
      cpQuestion.textContent = cp.question;
      cpOptions.innerHTML = '';

      cp.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.style.cssText = 'padding: 12px 16px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #fff; font-size: 13.5px; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.2s;';
        
        btn.onclick = () => {
          if (opt.isCorrect) {
            btn.style.background = 'rgba(16, 185, 129, 0.3)';
            btn.style.borderColor = '#10b981';
            score += 30;
            elScore.textContent = '⭐ PTS: ' + score;
            showTip("✅ PROTOCOL VERIFIED: +30 Points! Great emergency judgment.");
          } else {
            btn.style.background = 'rgba(239, 68, 68, 0.3)';
            btn.style.borderColor = '#ef4444';
            lives--;
            elLives.textContent = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));
            showTip("❌ WRONG PROTOCOL: -1 Life! Review safety guidelines.");
          }

          setTimeout(() => {
            cpModal.style.display = 'none';
            isPausedForCheckpoint = false;
            if (lives <= 0) {
              gameOver = true;
              modal.style.display = 'flex';
              document.getElementById('modal-icon').textContent = '🚨';
              document.getElementById('modal-title').textContent = 'Evacuation Aborted!';
              document.getElementById('modal-desc').textContent = 'Zero lives left. Practice standard drill routes.';
            }
          }, 1100);
        };

        cpOptions.appendChild(btn);
      });

      cpModal.style.display = 'flex';
    }

    let runTime = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (gameOver || isPausedForCheckpoint) { 
        renderer.render(scene, camera); 
        return; 
      }

      runTime += 0.08;
      distance += baseSpeed * 0.35;
      const dInt = Math.floor(distance);
      elDist.textContent = '🏃 DIST: ' + dInt + 'm / ' + TARGET_DIST + 'm';

      if (dInt >= 120 && !checkpoint1Done) {
        checkpoint1Done = true;
        triggerCheckpoint(0);
        return;
      }
      if (dInt >= 260 && !checkpoint2Done) {
        checkpoint2Done = true;
        triggerCheckpoint(1);
        return;
      }

      if (dInt >= TARGET_DIST) {
        gameOver = true;
        modal.style.display = 'flex';
        document.getElementById('modal-icon').textContent = '🏆';
        document.getElementById('modal-title').textContent = 'Assembly Ground Reached!';
        document.getElementById('modal-desc').textContent = 'Safe evacuation completed with accurate life-safety protocols. Points: ' + (score + 100);
        return;
      }

      tiles.forEach((t) => {
        t.position.z += baseSpeed;
        if (t.position.z > 8) t.position.z -= tileCount * 10;
      });

      boyRunner.position.x += (LANES[targetLane] - boyRunner.position.x) * 0.18;

      const legAngle = Math.sin(runTime * 2.5) * 0.75;
      const armAngle = Math.sin(runTime * 2.5) * 0.65;
      leftLegPivot.rotation.x = legAngle;
      rightLegPivot.rotation.x = -legAngle;
      leftArmPivot.rotation.x = -armAngle;
      rightArmPivot.rotation.x = armAngle;

      hips.rotation.x = 0.12;
      hips.position.y = 1.0 + Math.abs(Math.sin(runTime * 2.5)) * 0.08;

      if (isJumping) {
        boyRunner.position.y += jumpVel;
        jumpVel -= 0.015;
        if (boyRunner.position.y <= 0) { boyRunner.position.y = 0; isJumping = false; }
      }

      if (isDucking) {
        hips.scale.set(1, 0.5, 1);
        hips.position.y = 0.5;
        duckTimer--;
        if (duckTimer <= 0) {
          isDucking = false;
          hips.scale.set(1, 1, 1);
          hips.position.y = 1.0;
        }
      }

      emergencySiren.intensity = 2.0 + Math.sin(runTime) * 1.4;

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += baseSpeed;
        const isCloseZ = obs.position.z > -0.7 && obs.position.z < 0.7;
        const isSameLane = Math.abs(obs.position.x - boyRunner.position.x) < 0.75;

        if (isCloseZ && isSameLane && !obs.userData.hit) {
          let hit = false;
          if (obs.userData.type === 'FIRE') {
            if (boyRunner.position.y < 0.8) hit = true;
          } else if (obs.userData.type === 'BEAM') {
            if (!isDucking) hit = true;
          } else {
            if (boyRunner.position.y < 0.85) hit = true;
          }

          if (hit) {
            obs.userData.hit = true;
            lives--;
            sfxHit();
            elLives.textContent = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));
            showTip('⚠️ HAZARD IMPACT: ' + (obs.userData.type === 'FIRE' ? 'Jump above hot flame layer!' : 'Duck underneath dangling beams!'));
            torsoMesh.material.color.setHex(0xef4444);
            setTimeout(() => torsoMesh.material.color.setHex(0x0284c7), 260);

            if (lives <= 0) {
              gameOver = true;
              modal.style.display = 'flex';
              document.getElementById('modal-icon').textContent = '🚨';
              document.getElementById('modal-title').textContent = 'Evacuation Path Blocked!';
              document.getElementById('modal-desc').textContent = 'Critical hazard hit. Remember: Duck under smoke and never use elevators.';
              return;
            }
          }
        }

        if (obs.position.z > 6) {
          scene.remove(obs);
          obstacles.splice(i, 1);
          createObstacle(-80 - Math.random() * 20);
        }
      }

      // Collectible First-Aid Kits Rotation & Hover Effect
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const kit = collectibles[i];
        kit.position.z += baseSpeed;
        
        // Gentle rotation and floating bob
        kit.rotation.y += 0.035;
        kit.position.y = 1.05 + Math.sin(runTime * 2 + i) * 0.08;

        const isCloseZ = kit.position.z > -0.8 && kit.position.z < 0.8;
        const isSameLane = Math.abs(kit.position.x - boyRunner.position.x) < 0.85;

        if (isCloseZ && isSameLane && !kit.userData.collected) {
          kit.userData.collected = true;
          score += 20;
          sfxCollect();
          elScore.textContent = '⭐ PTS: ' + score;
          showTip('🩹 FIRST-AID SECURED: Sterile Bandages & Burn Dressing Picked (+20 Pts)');
          scene.remove(kit);
          collectibles.splice(i, 1);
          createCollectible(-90 - Math.random() * 20);
        }

        if (kit.position.z > 6) {
          scene.remove(kit);
          collectibles.splice(i, 1);
          createCollectible(-90 - Math.random() * 20);
        }
      }

      renderer.render(scene, camera);
    }

    animate();
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
`;

// -------------------------------------------------------------
// 2D RAPID REFLEX QUESTIONS DATA
// -------------------------------------------------------------
const REFLEX_CARDS = [
  {
    id: 1,
    scenario: 'Earthquake tremors hit while inside a high-rise classroom. Take the passenger elevator immediately to reach the ground.',
    isSafe: false,
    reason: 'Power failure can instantly trap you in a falling or locked elevator during seismic waves.'
  },
  {
    id: 2,
    scenario: 'Fire alarm rings and corridor is smoky. Drop on hands and knees to crawl under the smoke layer toward the exit stairs.',
    isSafe: true,
    reason: 'Hot toxic gases rise toward the ceiling; cooler, breathable air is within 2 feet of the floor.'
  },
  {
    id: 3,
    scenario: 'Flash flood water on the road is flowing at knee level. Walk through it slowly to cross the campus gate.',
    isSafe: false,
    reason: 'Just 6 inches of rapid current can sweep an adult off their feet; submerged manholes pose fatal risk.'
  },
  {
    id: 4,
    scenario: 'A cyclone warning is sounded. Stand close to structural glass windows to watch wind direction and storm progress.',
    isSafe: false,
    reason: 'High wind velocity shatters glass inwards into sharp flying projectiles.'
  },
  {
    id: 5,
    scenario: 'A chemical solvent catches fire on a lab counter. Pull the fire extinguisher pin, aim low at the base of the fire, and sweep side to side.',
    isSafe: true,
    reason: 'Following the PASS protocol targets the fuel base effectively.'
  }
];

export default function GamesPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('DIRECTORY');

  // Reflex 2D states
  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [score2D, setScore2D] = useState(0);
  const [lives2D, setLives2D] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [gameOver2D, setGameOver2D] = useState(false);

  const startReflexGame = () => {
    setDeck([...REFLEX_CARDS].sort(() => Math.random() - 0.5));
    setCardIndex(0);
    setScore2D(0);
    setLives2D(3);
    setFeedback(null);
    setGameOver2D(false);
    setActiveView('REFLEX_2D');
  };

  const handleDecision2D = (userSelectedSafe) => {
    if (feedback) return;
    const currentCard = deck[cardIndex];
    const isCorrect = userSelectedSafe === currentCard.isSafe;

    if (isCorrect) {
      setScore2D((prev) => prev + 10);
      setFeedback({ isCorrect: true, reason: currentCard.reason });
    } else {
      const rem = lives2D - 1;
      setLives2D(rem);
      setFeedback({ isCorrect: false, reason: currentCard.reason });
      if (rem <= 0) {
        setTimeout(() => setGameOver2D(true), 1200);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (cardIndex < deck.length - 1) {
        setCardIndex((prev) => prev + 1);
      } else {
        setGameOver2D(true);
      }
    }, 1400);
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '24px auto', padding: '0 20px', fontFamily: 'inherit', color: '#f3f4f6' }}>
      
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <button
          onClick={() => (activeView !== 'DIRECTORY' ? setActiveView('DIRECTORY') : navigate('/dashboard'))}
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: `1.5px solid ${THEME.border}`,
            color: THEME.primary,
            padding: '8px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            boxShadow: `0 0 12px -2px ${THEME.glow}`,
          }}
        >
          {activeView !== 'DIRECTORY' ? '← Back to Games Arcade' : '← Back to Dashboard'}
        </button>

        <span style={{ fontSize: '13px', color: THEME.primary, fontWeight: '800', letterSpacing: '0.06em' }}>
          🎮 SATARK GAMES ARCADE
        </span>
      </div>

      {/* VIEW 1: GAMES DIRECTORY / CARDS LISTING */}
      {activeView === 'DIRECTORY' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>
              Disaster Preparedness Games
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
              Select an interactive survival simulation to sharpen your reflexes and learn life-saving protocols.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Card 1: 3D Evacuation Runner */}
            <div style={{
              backgroundColor: THEME.bgGlass,
              border: `2px solid ${THEME.primary}`,
              boxShadow: `0 0 25px -3px ${THEME.glow}`,
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: THEME.primary,
                    fontSize: '11px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '800',
                    border: `1px solid ${THEME.border}`,
                  }}>
                    FULL 3D SIMULATION + QUIZ
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Interactive Drills</span>
                </div>

                <div style={{ fontSize: '42px', marginBottom: '14px' }}>🏃‍♂️</div>

                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0' }}>
                  Campus Evacuation Runner 3D
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                  Run through seismic hazard corridors, collect 3D First-Aid Medical Kits, duck under hanging cables, and clear mid-drill safety checkpoint gates to safely evacuate.
                </p>
              </div>

              <button
                onClick={() => setActiveView('RUNNER_3D')}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: THEME.primary,
                  color: '#060913',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: `0 0 18px ${THEME.glow}`,
                }}
              >
                Launch 3D Runner →
              </button>
            </div>

            {/* Card 2: 2D Rapid Reflex */}
            <div style={{
              backgroundColor: THEME.bgGlass,
              border: '2px solid rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 25px -3px rgba(59, 130, 246, 0.35)',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    fontSize: '11px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '800',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}>
                    FAST PROTOCOL CHECK
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Flash Decision</span>
                </div>

                <div style={{ fontSize: '42px', marginBottom: '14px' }}>⚡</div>

                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0' }}>
                  Rapid Reflex: Safe vs Hazard
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                  Emergency situations require split-second judgment. Distinguish life-saving actions from lethal hazard traps across earthquake, fire, and flood scenarios within seconds.
                </p>
              </div>

              <button
                onClick={startReflexGame}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 0 18px rgba(59, 130, 246, 0.4)',
                }}
              >
                Play Rapid Reflex →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: 3D RUNNER LAUNCHED */}
      {activeView === 'RUNNER_3D' && (
        <div style={{
          width: '100%',
          height: '660px',
          borderRadius: '24px',
          overflow: 'hidden',
          border: `2px solid ${THEME.primary}`,
          boxShadow: `0 0 35px ${THEME.glow}`,
          backgroundColor: '#060913',
        }}>
          <iframe
            title="3D Campus Runner"
            srcDoc={RUNNER_3D_HTML}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      )}

      {/* VIEW 3: 2D RAPID REFLEX LAUNCHED */}
      {activeView === 'REFLEX_2D' && (
        <div>
          {!gameOver2D && deck.length > 0 ? (
            <div style={{ backgroundColor: THEME.bgGlass, border: '2px solid #3b82f6', boxShadow: '0 0 30px rgba(59, 130, 246, 0.35)', borderRadius: '20px', padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', color: '#94a3b8', fontSize: '13px' }}>
                <span>Scenario {cardIndex + 1} of {deck.length}</span>
                <span>Lives: {'❤️'.repeat(lives2D)}{'🖤'.repeat(Math.max(0, 3 - lives2D))} • Score: <strong>{score2D} pts</strong></span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px 24px', borderRadius: '16px', textAlign: 'center', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontSize: '20px', color: '#fff', margin: 0, lineHeight: '1.5' }}>"{deck[cardIndex]?.scenario}"</h3>
              </div>
              {feedback && (
                <div style={{ textAlign: 'center', marginBottom: '20px', padding: '12px', borderRadius: '10px', backgroundColor: feedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: feedback.isCorrect ? '#34d399' : '#f87171', fontWeight: '700', fontSize: '14px', border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}` }}>
                  {feedback.isCorrect ? '✓ Correct Choice!' : '✗ Dangerous Action!'} {feedback.reason}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button disabled={!!feedback} onClick={() => handleDecision2D(true)} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#10b981', color: '#060913', fontWeight: '800', cursor: 'pointer', fontSize: '15px' }}>
                  🛡️ SAFE ACTION
                </button>
                <button disabled={!!feedback} onClick={() => handleDecision2D(false)} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '800', cursor: 'pointer', fontSize: '15px' }}>
                  ⚠️ DANGEROUS HAZARD
                </button>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: THEME.bgGlass, border: '2px solid #3b82f6', borderRadius: '20px', padding: '44px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{lives2D > 0 ? '🎖️' : '🚨'}</div>
              <h2 style={{ fontSize: '28px', color: '#fff', margin: 0, fontWeight: '800' }}>Reflex Drill Finished!</h2>
              <p style={{ color: '#94a3b8', fontSize: '14.5px', margin: '8px 0 20px 0' }}>Final Score: <strong>{score2D} pts</strong></p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={startReflexGame} style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                  Play Again
                </button>
                <button onClick={() => setActiveView('DIRECTORY')} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  Back to Arcade Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}