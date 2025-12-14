// src/components/Moon.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===============================
   Moon Component
   ===============================
   Orbiting satellite for planets
*/
export default function Moon({
  orbitRadius = 2,
  size = 0.2,
  speed = 0.5,
  color = "#888888",
  offset = 0
}) {
  const moonRef = useRef();
  const orbitRef = useRef(offset);

  useFrame((_, delta) => {
    // Update orbit angle
    orbitRef.current += delta * speed;

    // Calculate position on orbit
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(orbitRef.current) * orbitRadius;
      moonRef.current.position.z = Math.sin(orbitRef.current) * orbitRadius;

      // Slight rotation
      moonRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}
