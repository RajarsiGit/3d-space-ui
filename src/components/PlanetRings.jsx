// src/components/PlanetRings.jsx
import { useMemo } from "react";
import * as THREE from "three";

/* ===============================
   Planet Rings Component
   ===============================
   Creates Saturn-style rings around planets
   with opacity gradient for realistic appearance
*/
export default function PlanetRings({
  innerRadius = 1.5,
  outerRadius = 2.5,
  color = "#8b7355",
}) {
  // Create ring geometry
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    // Add UV coordinates for better texture control
    const positions = geometry.attributes.position;
    const uvs = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const radius = Math.sqrt(x * x + y * y);
      const normalizedRadius =
        (radius - innerRadius) / (outerRadius - innerRadius);
      uvs.push(normalizedRadius, 0);
    }

    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return geometry;
  }, [innerRadius, outerRadius]);

  // Custom shader material for ring with opacity gradient
  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
  }, [color]);

  return (
    <mesh
      geometry={ringGeometry}
      material={ringMaterial}
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
}
