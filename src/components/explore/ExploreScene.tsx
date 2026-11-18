"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, MapControls, useTexture } from "@react-three/drei";
import type { MapControls as MapControlsImpl } from "three-stdlib";
import gsap from "gsap";
import { aerial, spots, stops } from "@/lib/aerial";

// The ground is the aerial photo laid flat, W wide (world units), same proportions as the photo.
export const W = 30;
export const H = (W * aerial.height) / aerial.width;
const toWorld = (x: number, y: number) => new THREE.Vector3((x / 100 - 0.5) * W, 0, (y / 100 - 0.5) * H);

export const INTRO_POS = new THREE.Vector3(0, 24, 3);
export const EXPLORE_POS = new THREE.Vector3(0, 15, 5);

export type Phase = "intro" | "flying" | "explore";

function Ground() {
  const map = useTexture(aerial.src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial map={map} color="#d9dfd6" />
    </mesh>
  );
}

// A small bird seen from above: body + two wings that flap. Its shadow is drawn on the ground.
function useBirdGeometry() {
  return useMemo(() => {
    const wing = new THREE.Shape();
    wing.moveTo(0, 0);
    wing.bezierCurveTo(0.12, 0.05, 0.3, 0.06, 0.42, -0.02);
    wing.bezierCurveTo(0.3, -0.03, 0.12, -0.06, 0, -0.07);
    const wingGeo = new THREE.ShapeGeometry(wing);
    wingGeo.rotateX(-Math.PI / 2);
    const bodyGeo = new THREE.CapsuleGeometry(0.025, 0.16, 3, 6);
    bodyGeo.rotateX(Math.PI / 2);
    return { wingGeo, bodyGeo };
  }, []);
}

function Flock({ points, speed, offset }: { points: [number, number][]; speed: number; offset: number }) {
  const { wingGeo, bodyGeo } = useBirdGeometry();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(([x, y]) => toWorld(x, y).setY(3.2)), true), [points]);
  const birds = useRef<THREE.Group[]>([]);
  const shadows = useRef<THREE.Group[]>([]);
  const formation = [
    [0, 0],
    [-0.16, -0.14],
    [0.16, -0.14],
    [-0.32, -0.28],
    [0.32, -0.28],
  ];
  const ahead = new THREE.Vector3();
  const pos = new THREE.Vector3();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const u = (t * speed + offset) % 1;
    curve.getPointAt(u, pos);
    curve.getPointAt((u + 0.002) % 1, ahead);
    const heading = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
    formation.forEach(([dx, dz], i) => {
      const bird = birds.current[i];
      const shadow = shadows.current[i];
      if (!bird || !shadow) return;
      const ox = dx * Math.cos(heading) + dz * Math.sin(heading);
      const oz = -dx * Math.sin(heading) + dz * Math.cos(heading);
      bird.position.set(pos.x + ox, pos.y + Math.sin(t * 1.3 + i) * 0.05, pos.z + oz);
      bird.rotation.y = heading;
      const flap = Math.sin(t * 11 + i * 0.8) * 0.55;
      (bird.children[0] as THREE.Mesh).rotation.z = flap;
      (bird.children[1] as THREE.Mesh).rotation.z = -flap;
      // shadow falls a little away from the bird, as with a low sun
      shadow.position.set(bird.position.x + 0.6, 0.02, bird.position.z + 0.75);
      shadow.rotation.y = heading;
      (shadow.children[0] as THREE.Mesh).rotation.z = flap;
      (shadow.children[1] as THREE.Mesh).rotation.z = -flap;
    });
  });

  return (
    <>
      {formation.map((_, i) => (
        <group key={`b${i}`} ref={(g) => { if (g) birds.current[i] = g; }} scale={0.55}>
          <mesh geometry={wingGeo}>
            <meshBasicMaterial color="#f3efe6" side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={wingGeo} scale-x={-1}>
            <meshBasicMaterial color="#f3efe6" side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={bodyGeo}>
            <meshBasicMaterial color="#e8e2d6" />
          </mesh>
        </group>
      ))}
      {formation.map((_, i) => (
        <group key={`s${i}`} ref={(g) => { if (g) shadows.current[i] = g; }} scale={0.55}>
          <mesh geometry={wingGeo}>
            <meshBasicMaterial color="#000" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh geometry={wingGeo} scale-x={-1}>
            <meshBasicMaterial color="#000" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Fixed pseudo-random numbers, so the clouds look the same on every visit.
function seededRandom(start: number) {
  let seed = start;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// Soft clouds: clusters of cloud-puff sprites that always face the camera and drift slowly.
function CloudLayer({
  clusters,
  puffs,
  spread,
  size,
  opacity,
}: {
  clusters: { pos: [number, number, number] }[];
  puffs: number;
  spread: [number, number, number];
  size: [number, number];
  opacity: number;
}) {
  const texture = useTexture("/images/cloud-puff.png");
  const group = useRef<THREE.Group>(null);
  const sprites = useMemo(() => {
    const rand = seededRandom(clusters.length * 97 + puffs);
    return clusters.flatMap((c) =>
      Array.from({ length: puffs }, () => ({
        pos: [c.pos[0] + (rand() - 0.5) * spread[0] * 2, c.pos[1] + (rand() - 0.5) * spread[1] * 2, c.pos[2] + (rand() - 0.5) * spread[2] * 2] as [number, number, number],
        scale: size[0] + rand() * (size[1] - size[0]),
        shade: 0.86 + rand() * 0.14,
      })),
    );
  }, [clusters, puffs, spread, size]);

  // the whole layer drifts slowly sideways and wraps round
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.position.x += delta * 0.25;
    if (g.position.x > 12) g.position.x = -12;
  });

  return (
    <group ref={group}>
      {sprites.map((p, i) => (
        <sprite key={i} position={p.pos} scale={[p.scale, p.scale * 0.7, 1]}>
          <spriteMaterial map={texture} transparent opacity={opacity} depthWrite={false} color={new THREE.Color(p.shade, p.shade, p.shade * 1.01)} fog />
        </sprite>
      ))}
    </group>
  );
}

// Keeps the camera over the land while dragging (no flying off into the dark).
function clampPan(c: MapControlsImpl, camera: THREE.Camera) {
  {
    const lx = W * 0.4;
    const lz = H * 0.4;
    const tx = THREE.MathUtils.clamp(c.target.x, -lx, lx);
    const tz = THREE.MathUtils.clamp(c.target.z, -lz, lz);
    const dx = tx - c.target.x;
    const dz = tz - c.target.z;
    if (dx || dz) {
      c.target.x = tx;
      c.target.z = tz;
      camera.position.x += dx;
      camera.position.z += dz;
    }
  }
}

function useClampPan(controls: React.RefObject<MapControlsImpl | null>) {
  useFrame(({ camera }) => {
    if (controls.current) clampPan(controls.current, camera);
  });
}

export default function ExploreScene({
  phase,
  active,
  focus,
  onLanded,
  onPick,
  onInteract,
}: {
  phase: Phase;
  active: number | null;
  focus: number; // bumps each time a stop is picked, so picking the same one again still flies there
  onLanded: () => void;
  onPick: (i: number) => void;
  onInteract: () => void;
}) {
  const { camera } = useThree();
  const controls = useRef<MapControlsImpl | null>(null);
  useClampPan(controls);

  // Start high above the clouds.
  useEffect(() => {
    camera.position.copy(INTRO_POS);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // "Explore the map": drop down through the clouds.
  useEffect(() => {
    if (phase !== "flying") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(camera.position, {
      x: EXPLORE_POS.x,
      y: EXPLORE_POS.y,
      z: EXPLORE_POS.z,
      duration: reduce ? 0 : 3.6,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0),
      onComplete: onLanded,
    });
    return () => {
      tween.kill();
    };
  }, [phase, camera, onLanded]);

  // Picking a place flies the camera over it.
  useEffect(() => {
    if (active === null || phase !== "explore" || !controls.current) return;
    const c = controls.current;
    const p = toWorld(stops[active].x, stops[active].y);
    const tl = gsap.timeline({ defaults: { duration: 1.8, ease: "power3.inOut" } });
    tl.to(c.target, { x: p.x, y: 0, z: p.z, onUpdate: () => c.update() }, 0).to(camera.position, { x: p.x, y: 8, z: p.z + 3.5 }, 0);
    return () => {
      tl.kill();
    };
  }, [active, focus, phase, camera]);

  // Clouds: a thick layer up high (the intro looks down through it) and a few low drifts that stay in view.
  const high = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        pos: [((i * 37) % 36) - 18, 13.5 + (i % 4) * 2, ((i * 53) % 26) - 13] as [number, number, number],
      })),
    [],
  );
  const low = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        pos: [i % 2 ? 11 + (i % 3) * 2 : -11 - (i % 3) * 2, 5 + (i % 3), ((i * 29) % 20) - 10] as [number, number, number],
      })),
    [],
  );

  return (
    <>
      <color attach="background" args={["#0f1a20"]} />
      <fog attach="fog" args={["#0f1a20", 34, 80]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.2} />

      <Ground />

      <CloudLayer clusters={high} puffs={12} spread={[6, 1.6, 4]} size={[3.5, 6]} opacity={0.7} />
      <CloudLayer clusters={low} puffs={8} spread={[3.5, 0.8, 2.5]} size={[3, 5]} opacity={0.5} />

      <Flock points={[[5, 85], [35, 55], [60, 40], [92, 18], [70, 70], [30, 88]]} speed={0.012} offset={0} />
      <Flock points={[[90, 80], [65, 50], [40, 30], [10, 20], [25, 60], [60, 85]]} speed={0.009} offset={0.5} />

      {phase === "explore" &&
        stops.map((s, i) => (
          <Html key={s.name} position={toWorld(s.x, s.y)} center zIndexRange={[20, 10]}>
            <button type="button" onClick={() => onPick(i)} className="group relative grid size-12 place-items-center" aria-label={`Visit ${s.name}`}>
              <span className={`absolute inset-0 rounded-full bg-white/55 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${active === i ? "scale-100" : "scale-50 group-hover:scale-75"}`} />
              <span className={`relative size-2 rounded-full ${active === i ? "bg-black" : "bg-[#456a4b]"}`} />
              <span className="absolute top-1/2 left-full ml-2 flex h-7 -translate-y-1/2 items-center bg-white px-3 text-[0.65rem] font-medium tracking-[0.2em] whitespace-nowrap text-[#456a4b] uppercase opacity-0 transition-opacity group-hover:opacity-100">{s.name}</span>
            </button>
          </Html>
        ))}

      {phase === "explore" &&
        spots.map((s) => (
          <Html key={s.name} position={toWorld(s.x, s.y)} center zIndexRange={[20, 10]}>
            <span className="group relative grid size-8 cursor-default place-items-center" tabIndex={0} aria-label={s.name}>
              <span className="absolute inset-0 scale-50 rounded-full bg-white transition-transform duration-700 group-hover:scale-75" />
              <span className="relative size-1.5 rounded-full bg-[#456a4b]" />
              <span className="absolute top-1/2 left-full ml-2 flex h-7 -translate-y-1/2 items-center bg-white px-3 text-[0.65rem] font-medium tracking-[0.2em] whitespace-nowrap text-[#456a4b] uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{s.name}</span>
            </span>
          </Html>
        ))}

      <MapControls
        ref={controls}
        enabled={phase === "explore"}
        enableRotate={false}
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={0.7}
        panSpeed={0.9}
        minDistance={5}
        maxDistance={phase === "explore" ? 17 : 100}
        screenSpacePanning={false}
        onStart={onInteract}
      />
    </>
  );
}
