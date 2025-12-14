// src/components/Sun.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===============================
   Sun Component
   ===============================
   Central star with smooth glowing effect
*/
export default function Sun({ position = [0, 0, 0], size = 2.5 }) {
  const sunRef = useRef();

  // Create smooth glow texture
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    // Create smooth radial gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 200, 0.9)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 150, 0.7)');
    gradient.addColorStop(0.35, 'rgba(255, 220, 100, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.3)');
    gradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.15)');
    gradient.addColorStop(0.85, 'rgba(255, 140, 0, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Slow rotation
  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main sun sphere - bright yellow core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshBasicMaterial color="#FFFEF0" />
      </mesh>

      {/* Smooth glow using sprite-like plane that always faces camera */}
      <sprite scale={[size * 8, size * 8, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Main point light - very bright */}
      <pointLight
        color="#FFFFEE"
        intensity={100}
        distance={200}
        decay={1.2}
      />

      {/* Additional fill light for atmosphere */}
      <pointLight
        color="#FFE4B5"
        intensity={50}
        distance={150}
        decay={2}
      />
    </group>
  );
}
