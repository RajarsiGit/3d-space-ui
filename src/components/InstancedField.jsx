// src/components/InstancedField.jsx
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===============================
   Starfield Environment (Deep Space)
   ===============================
   - True star-like points (no solid meshes)
   - Spherical, infinite-feel distribution
   - Subtle parallax drift
   - Extremely GPU efficient
*/
export default function InstancedField({ count = 100000, radius = 150 }) {
  const pointsRef = useRef();

  const geometryRef = useRef();

  // Create circular star texture
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    // Create radial gradient for round star
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // --- Clustered spherical star distribution ---
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // More clustering towards center (power of 0.3 instead of 0.5)
      const r = radius * Math.pow(Math.random(), 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);

      // --- Star color variation (white → blue → warm)
      const tint = Math.random();
      const color = new THREE.Color();

      if (tint < 0.7) color.setRGB(1, 1, 1); // white
      else if (tint < 0.9) color.setRGB(0.7, 0.85, 1); // blue
      else color.setRGB(1, 0.8, 0.6); // warm

      colors.set([color.r, color.g, color.b], i * 3);
    }

    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometryRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
  }, [count, radius]);

  // Slow galactic drift
  useFrame((_, delta) => {
    pointsRef.current.rotation.y += delta * 0.005;
    pointsRef.current.rotation.x += delta * 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        map={starTexture}
        size={0.15}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        alphaTest={0.01}
      />
    </points>
  );
}
