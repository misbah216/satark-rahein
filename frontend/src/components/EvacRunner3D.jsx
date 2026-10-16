import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function EvacRunner3D({ onGameOver, onExit }) {
  const mountRef = useRef(null);
  const [gameState, setGameState] = useState('PLAYING'); // 'PLAYING', 'WON', 'LOST'
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeAdvisory, setActiveAdvisory] = useState('EVACUATION IN PROGRESS: Dodge debris & fire!');

  // Mutable refs for 60fps game loop
  const gameRef = useRef({
    lane: 0, // -1: Left, 0: Center, 1: Right
    targetX: 0,
    playerY: 0,
    playerZ: 0,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
    duckTimer: 0,
    speed: 0.65,
    distanceCovered: 0,
    targetDistance: 450, // 450 meters to safe open ground
    livesLeft: 3,
    scorePts: 0,
    obstacles: [],
    collectibles: [],
    corridorTiles: [],
    clock: new THREE.Clock(),
    isOver: false,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.025);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, 1.2, -5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 12, 5);
    scene.add(dirLight);

    const emergencyLight = new THREE.PointLight(0xef4444, 2.5, 30);
    emergencyLight.position.set(0, 5, -10);
    scene.add(emergencyLight);

    // --- PROCEDURAL PLAYER MESH ---
    const playerGroup = new THREE.Group();
    
    // Body (Hazmat / Safety Vest style)
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.2, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    playerGroup.add(body);

    // Head / Safety Helmet
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 }); // Yellow Helmet
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.75;
    playerGroup.add(head);

    // Neon Glow aura under player
    const auraGeo = new THREE.RingGeometry(0.4, 0.7, 32);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.05;
    playerGroup.add(aura);

    scene.add(playerGroup);

    // --- PROCEDURAL CORRIDOR TILES ---
    const tileGeo = new THREE.BoxGeometry(7, 0.2, 10);
    const tileMat1 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const tileMat2 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    const tileCount = 10;
    const tiles = [];
    for (let i = 0; i < tileCount; i++) {
      const tile = new THREE.Mesh(tileGeo, i % 2 === 0 ? tileMat1 : tileMat2);
      tile.position.set(0, -0.1, -i * 10);
      scene.add(tile);

      // Side Corridor Rails
      const railGeo = new THREE.BoxGeometry(0.3, 1.2, 10);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const leftRail = new THREE.Mesh(railGeo, railMat);
      leftRail.position.set(-3.4, 0.6, 0);
      tile.add(leftRail);

      const rightRail = new THREE.Mesh(railGeo, railMat);
      rightRail.position.set(3.4, 0.6, 0);
      tile.add(rightRail);

      tiles.push(tile);
    }
    gameRef.current.corridorTiles = tiles;

    // --- OBSTACLE FACTORY ---
    const LANE_X = [-2, 0, 2];

    const spawnObstacle = (zPos) => {
      const lane = LANE_X[Math.floor(Math.random() * LANE_X.length)];
      const typeRand = Math.random();

      let mesh;
      let type; // 'FIRE' (must jump), 'DEBRIS_HIGH' (must duck), 'BARREL'

      if (typeRand < 0.4) {
        // Chemical Fire patch (Floor level -> JUMP)
        type = 'FIRE';
        const fireGeo = new THREE.ConeGeometry(0.65, 1.2, 8);
        const fireMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        mesh = new THREE.Mesh(fireGeo, fireMat);
        mesh.position.set(lane, 0.6, zPos);
      } else if (typeRand < 0.7) {
        // High Falling Duct / Beam (Overhead -> DUCK)
        type = 'DEBRIS_HIGH';
        const ductGeo = new THREE.BoxGeometry(1.8, 0.6, 0.6);
        const ductMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        mesh = new THREE.Mesh(ductGeo, ductMat);
        mesh.position.set(lane, 1.65, zPos); // Suspended at head height
      } else {
        // Fallen Concrete Block
        type = 'BARREL';
        const blockGeo = new THREE.BoxGeometry(1.1, 0.8, 1.1);
        const blockMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        mesh = new THREE.Mesh(blockGeo, blockMat);
        mesh.position.set(lane, 0.4, zPos);
      }

      mesh.userData = { type, laneX: lane, hit: false };
      scene.add(mesh);
      gameRef.current.obstacles.push(mesh);
    };

    const spawnCollectible = (zPos) => {
      const lane = LANE_X[Math.floor(Math.random() * LANE_X.length)];
      const kitGeo = new THREE.BoxGeometry(0.6, 0.6, 0.3);
      const kitMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669 });
      const kit = new THREE.Mesh(kitGeo, kitMat);
      kit.position.set(lane, 1.0, zPos);
      kit.userData = { collected: false };
      scene.add(kit);
      gameRef.current.collectibles.push(kit);
    };

    // Pre-populate obstacles ahead
    for (let i = 1; i < 8; i++) {
      spawnObstacle(-i * 14);
      if (i % 2 === 0) spawnCollectible(-i * 14 - 7);
    }

    // --- CONTROLS DISPATCHER ---
    const handleKeyDown = (e) => {
      if (gameRef.current.isOver) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (gameRef.current.lane > -1) gameRef.current.lane -= 1;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (gameRef.current.lane < 1) gameRef.current.lane += 1;
      } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !gameRef.current.isJumping) {
        gameRef.current.isJumping = true;
        gameRef.current.velocityY = 0.28;
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && !gameRef.current.isDucking) {
        gameRef.current.isDucking = true;
        gameRef.current.duckTimer = 35; // Frames
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // --- ANIMATION & PHYSICS LOOP ---
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const state = gameRef.current;
      if (state.isOver) {
        renderer.render(scene, camera);
        return;
      }

      // 1. Move Tiles & Distance
      state.distanceCovered += state.speed * 0.4;
      const distInt = Math.floor(state.distanceCovered);
      setDistance(distInt);

      // Check WIN CONDITION (Safe Assembly Area reached)
      if (distInt >= state.targetDistance) {
        state.isOver = true;
        setGameState('WON');
        onGameOver && onGameOver(state.scorePts + 100, true);
        return;
      }

      // Recycle corridor infinite scroll
      state.corridorTiles.forEach((tile) => {
        tile.position.z += state.speed;
        if (tile.position.z > 8) {
          tile.position.z -= tileCount * 10;
        }
      });

      // 2. Smooth Lane Interpolation
      state.targetX = LANE_X[state.lane + 1];
      playerGroup.position.x += (state.targetX - playerGroup.position.x) * 0.22;

      // 3. Jump Physics
      if (state.isJumping) {
        playerGroup.position.y += state.velocityY;
        state.velocityY -= 0.016; // Gravity
        if (playerGroup.position.y <= 0) {
          playerGroup.position.y = 0;
          state.isJumping = false;
        }
      }

      // 4. Duck / Slide Logic
      if (state.isDucking) {
        body.scale.set(1, 0.45, 1);
        head.position.y = 0.9;
        state.duckTimer--;
        if (state.duckTimer <= 0) {
          state.isDucking = false;
          body.scale.set(1, 1, 1);
          head.position.y = 1.75;
        }
      }

      // 5. Emergency Siren Light Oscillation
      emergencyLight.intensity = 2.0 + Math.sin(Date.now() * 0.008) * 1.5;

      // 6. Obstacles Updates & Collision
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.position.z += state.speed;

        // Collision Check with Player Box
        const pX = playerGroup.position.x;
        const pY = playerGroup.position.y;
        const isCloseZ = obs.position.z > -0.8 && obs.position.z < 0.8;
        const isSameLane = Math.abs(obs.position.x - pX) < 0.8;

        if (isCloseZ && isSameLane && !obs.userData.hit) {
          let hitPlayer = false;

          if (obs.userData.type === 'FIRE') {
            // If not jumping high enough -> Hit
            if (pY < 0.8) hitPlayer = true;
          } else if (obs.userData.type === 'DEBRIS_HIGH') {
            // If standing upright and not ducking -> Hit
            if (!state.isDucking) hitPlayer = true;
          } else {
            // General barricade -> Hit
            if (pY < 0.9) hitPlayer = true;
          }

          if (hitPlayer) {
            obs.userData.hit = true;
            state.livesLeft -= 1;
            setLives(state.livesLeft);
            setActiveAdvisory(`HIT BY HAZARD! ${obs.userData.type === 'FIRE' ? 'Jump over fires!' : 'Duck low under falling debris!'}`);

            // Visual hit flash
            bodyMat.color.setHex(0xef4444);
            setTimeout(() => bodyMat.color.setHex(0x10b981), 250);

            if (state.livesLeft <= 0) {
              state.isOver = true;
              setGameState('LOST');
              onGameOver && onGameOver(state.scorePts, false);
              return;
            }
          }
        }

        // Recycle passed obstacle
        if (obs.position.z > 6) {
          scene.remove(obs);
          state.obstacles.splice(i, 1);
          spawnObstacle(-70 - Math.random() * 15);
        }
      }

      // 7. Collectibles Updates
      for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const col = state.collectibles[i];
        col.position.z += state.speed;
        col.rotation.y += 0.04;

        const pX = playerGroup.position.x;
        const isCloseZ = col.position.z > -0.8 && col.position.z < 0.8;
        const isSameLane = Math.abs(col.position.x - pX) < 0.9;

        if (isCloseZ && isSameLane && !col.userData.collected) {
          col.userData.collected = true;
          state.scorePts += 20;
          setScore(state.scorePts);
          setActiveAdvisory('FIRST-AID KIT SECURED! (+20 Readiness Points)');
          scene.remove(col);
          state.collectibles.splice(i, 1);
          spawnCollectible(-80 - Math.random() * 20);
        }

        if (col.position.z > 6) {
          scene.remove(col);
          state.collectibles.splice(i, 1);
          spawnCollectible(-80 - Math.random() * 20);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Mobile / Onscreen Controls
  const triggerLeft = () => {
    if (gameRef.current.lane > -1) gameRef.current.lane -= 1;
  };
  const triggerRight = () => {
    if (gameRef.current.lane < 1) gameRef.current.lane += 1;
  };
  const triggerJump = () => {
    if (!gameRef.current.isJumping) {
      gameRef.current.isJumping = true;
      gameRef.current.velocityY = 0.28;
    }
  };
  const triggerDuck = () => {
    if (!gameRef.current.isDucking) {
      gameRef.current.isDucking = true;
      gameRef.current.duckTimer = 35;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '620px', borderRadius: '24px', overflow: 'hidden', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
      {/* 3D Canvas Mounting Point */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', background: '#060913' }} />

      {/* Top HUD Bar */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(13, 20, 38, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '8px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '800' }}>
            🏃 DISTANCE: {distance}m / 450m
          </span>
          <span style={{ fontSize: '13px', color: '#facc15', fontWeight: '800' }}>
            ⭐ POINTS: {score}
          </span>
          <span style={{ fontSize: '13px' }}>
            {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}
          </span>
        </div>

        <button
          onClick={onExit}
          style={{ pointerEvents: 'auto', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          Exit Simulation ✕
        </button>
      </div>

      {/* Real-time Protocol Advisory Banner */}
      <div style={{ position: 'absolute', bottom: 85, left: '50%', transform: 'translateX(-50%)', background: 'rgba(10, 16, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '30px', padding: '8px 24px', color: '#e2e8f0', fontSize: '13px', fontWeight: '600', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        📢 {activeAdvisory}
      </div>

      {/* Mobile / Screen Touch Arrow Controls */}
      <div style={{ position: 'absolute', bottom: 18, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={triggerLeft} style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}>◀</button>
          <button onClick={triggerRight} style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}>▶</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={triggerJump} style={{ padding: '0 18px', height: '48px', borderRadius: '12px', background: '#10b981', border: 'none', color: '#060913', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>JUMP (W) ⬆</button>
          <button onClick={triggerDuck} style={{ padding: '0 18px', height: '48px', borderRadius: '12px', background: '#3b82f6', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>DUCK (S) ⬇</button>
        </div>
      </div>

      {/* WIN / LOSS OVERLAY */}
      {gameState !== 'PLAYING' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6, 9, 19, 0.92)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '54px', marginBottom: '12px' }}>
            {gameState === 'WON' ? '🏆' : '🚨'}
          </div>
          <h2 style={{ fontSize: '28px', color: '#fff', margin: 0, fontWeight: '800' }}>
            {gameState === 'WON' ? 'Assembly Ground Reached!' : 'Evacuation Route Blocked!'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', maxWidth: '420px', margin: '10px 0 24px 0' }}>
            {gameState === 'WON'
              ? 'You successfully navigated through the seismic corridor hazard zones and reached the open assembly point.'
              : 'You collided with falling debris. Remember: Jump over flames and duck underneath fallen structural cables.'}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 26px', background: '#10b981', color: '#060913', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
            >
              Replay Simulation ↻
            </button>
            <button
              onClick={onExit}
              style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
            >
              Return to Modules
            </button>
          </div>
        </div>
      )}
    </div>
  );
}