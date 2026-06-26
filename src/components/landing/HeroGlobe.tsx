// 3D wireframe globe with animated flight arcs, traveling dots, and pulsing airports.
// All Three.js objects use refs + useFrame; no React state inside the render loop.

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const GLOBE_RADIUS = 2.2;
const ARC_COUNT = 12;
const AIRPORT_COUNT = 18;
const ARC_DRAW_DURATION_MS = 2500;
const ARC_FADE_DURATION_MS = 500;
const ARC_MAX_INITIAL_DELAY_MS = 4000;

const COLOR_SAGE = "#B8C6B1";
const COLOR_IVORY = "#F8F3E8";

function randomUnitVector(): THREE.Vector3 {
  // Uniformly distributed point on unit sphere.
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
  );
}

interface Arc {
  curve: THREE.QuadraticBezierCurve3;
  geometry: THREE.TubeGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  dot: THREE.Mesh;
  dotMaterial: THREE.MeshBasicMaterial;
  totalCount: number;
  startTime: number;
}

function buildArc(): Arc {
  const a = randomUnitVector().multiplyScalar(GLOBE_RADIUS);
  const b = randomUnitVector().multiplyScalar(GLOBE_RADIUS);
  const midpoint = new THREE.Vector3()
    .addVectors(a, b)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(GLOBE_RADIUS * 1.6);

  const curve = new THREE.QuadraticBezierCurve3(a, midpoint, b);
  const geometry = new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color: COLOR_IVORY,
    transparent: true,
    opacity: 0.6,
  });
  const mesh = new THREE.Mesh(geometry, material);

  // Each tube segment ring has 8 vertices; indices group into triangles.
  // Use drawRange on the index buffer to progressively reveal the tube.
  const totalCount = geometry.index ? geometry.index.count : 0;
  geometry.setDrawRange(0, 0);

  const dotMaterial = new THREE.MeshBasicMaterial({
    color: COLOR_IVORY,
    transparent: true,
    opacity: 0.9,
  });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), dotMaterial);
  dot.visible = false;

  return {
    curve,
    geometry,
    material,
    mesh,
    dot,
    dotMaterial,
    totalCount,
    startTime: Date.now() + Math.random() * ARC_MAX_INITIAL_DELAY_MS,
  };
}

interface Airport {
  mesh: THREE.Mesh;
  phase: number;
}

function GlobeScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  // Set pixel ratio once.
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  // Wireframe sphere geometry + material (memoised, disposed on unmount).
  const wireframe = useMemo(() => {
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    sphereGeo.dispose();
    const mat = new THREE.LineBasicMaterial({
      color: COLOR_SAGE,
      transparent: true,
      opacity: 0.25,
    });
    const segments = new THREE.LineSegments(wireGeo, mat);
    return { segments, wireGeo, mat };
  }, []);

  const arcs = useMemo<Arc[]>(
    () => Array.from({ length: ARC_COUNT }, () => buildArc()),
    [],
  );

  const airports = useMemo<Airport[]>(() => {
    return Array.from({ length: AIRPORT_COUNT }, (_, i) => {
      const pos = randomUnitVector().multiplyScalar(GLOBE_RADIUS);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({ color: COLOR_SAGE }),
      );
      mesh.position.copy(pos);
      return { mesh, phase: i * 0.7 };
    });
  }, []);

  // Cleanup all Three resources.
  useEffect(() => {
    return () => {
      wireframe.wireGeo.dispose();
      wireframe.mat.dispose();
      arcs.forEach((a) => {
        a.geometry.dispose();
        a.material.dispose();
        a.dot.geometry.dispose();
        a.dotMaterial.dispose();
      });
      airports.forEach((ap) => {
        ap.mesh.geometry.dispose();
        (ap.mesh.material as THREE.Material).dispose();
      });
    };
  }, [arcs, airports, wireframe]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    // Auto-rotate.
    g.rotation.y += 0.0008;

    // Mouse parallax — lerp toward target rotation.
    const targetX = mouse.current.y * 0.15;
    const targetY = mouse.current.x * 0.15;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    // Re-introduce auto-rotate after parallax target on Y.
    g.rotation.y += (targetY - (g.rotation.y % (Math.PI * 2))) * 0.005;

    // Animate arcs.
    const now = Date.now();
    for (const arc of arcs) {
      const elapsed = now - arc.startTime;
      if (elapsed < 0) {
        arc.geometry.setDrawRange(0, 0);
        arc.dot.visible = false;
        continue;
      }
      if (elapsed < ARC_DRAW_DURATION_MS) {
        const t = elapsed / ARC_DRAW_DURATION_MS;
        arc.geometry.setDrawRange(0, Math.floor(t * arc.totalCount));
        arc.material.opacity = 0.6;
        const p = arc.curve.getPoint(Math.min(t, 1));
        arc.dot.position.copy(p);
        arc.dot.visible = true;
        arc.dotMaterial.opacity = 0.9;
      } else if (elapsed < ARC_DRAW_DURATION_MS + ARC_FADE_DURATION_MS) {
        arc.geometry.setDrawRange(0, arc.totalCount);
        const fadeT = (elapsed - ARC_DRAW_DURATION_MS) / ARC_FADE_DURATION_MS;
        arc.material.opacity = 0.6 * (1 - fadeT);
        arc.dot.visible = false;
      } else {
        arc.startTime = now + Math.random() * ARC_MAX_INITIAL_DELAY_MS;
        arc.geometry.setDrawRange(0, 0);
        arc.dot.visible = false;
      }
    }

    // Pulse airports.
    const t = state.clock.getElapsedTime();
    for (const ap of airports) {
      const s = 0.8 + ((Math.sin(t * 1.8 + ap.phase) + 1) / 2) * 0.5;
      ap.mesh.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={wireframe.segments} />
      {arcs.map((a, i) => (
        <group key={`arc-${i}`}>
          <primitive object={a.mesh} />
          <primitive object={a.dot} />
        </group>
      ))}
      {airports.map((ap, i) => (
        <primitive key={`airport-${i}`} object={ap.mesh} />
      ))}
    </group>
  );
}

export function HeroGlobe() {
  const mouse = useRef({ x: 0, y: 0 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouse.current = { x, y };
  }

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color={COLOR_SAGE} />
        <GlobeScene mouse={mouse} />
      </Canvas>
    </div>
  );
}
