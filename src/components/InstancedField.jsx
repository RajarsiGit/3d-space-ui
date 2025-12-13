// src/components/InstancedField.jsx
import { useRef, useEffect } from "react";
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
export default function InstancedField({ count = 3000, radius = 80 }) {
  const pointsRef = useRef();

  const geometryRef = useRef();

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // --- Spherical star distribution ---
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.sqrt(Math.random()); // hollow feel

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
        size={0.15}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}
