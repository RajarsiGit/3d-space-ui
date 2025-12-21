// src/components/Planet.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PlanetRings from "./PlanetRings";
import Moon from "./Moon";

/* ===============================
   Planet Component
   ===============================
   Supports different planet types:
   - rocky: Earth-like, Mars-like planets
   - gas: Gas giants like Jupiter, Saturn
   - ice: Ice planets like Uranus, Neptune
*/
export default function Planet({
  position = [0, 0, 0],
  size = 1,
  type = "rocky",
  rotationSpeed = 0.01,
  hasRings = false,
  ringColor = "#8b7355",
  moons = [],
  orbitRadius = null,
  orbitSpeed = 0.1,
  orbitOffset = 0,
  speedMultiplier = 1,
}) {
  const planetRef = useRef();
  const groupRef = useRef();
  const orbitAngle = useRef(orbitOffset);

  // Planet type color schemes and properties
  const planetTypes = {
    rocky: {
      // Realistic rocky planet colors (Mars reds, Earth browns, Venus yellows)
      colors: [
        "#CD5C5C",
        "#8B4513",
        "#D2691E",
        "#BC8F8F",
        "#A0522D",
        "#6B8E23",
      ],
      atmosphereColors: ["#87CEEB", "#B0C4DE", "#E6E6FA"],
      roughness: 0.9,
      metalness: 0.1,
    },
    earth: {
      // Earth with deep blue oceans and green/brown landmasses
      colors: ["#1E90FF"], // Deep ocean blue base
      atmosphereColors: ["#87CEEB"], // Sky blue atmosphere
      roughness: 0.7,
      metalness: 0.2,
      hasLandmasses: true,
      landColor: "#228B22", // Forest green
      landColor2: "#8B4513", // Saddle brown
    },
    gas: {
      // Gas giant colors (Jupiter oranges/browns, Saturn yellows)
      colors: [
        "#DAA520",
        "#CD853F",
        "#DEB887",
        "#F4A460",
        "#D2691E",
        "#BDB76B",
      ],
      atmosphereColors: ["#FFE4B5", "#FFDEAD", "#F5DEB3"],
      roughness: 0.3,
      metalness: 0.2,
    },
    ice: {
      // Ice planet colors (Neptune/Uranus blues, cyan)
      colors: [
        "#4682B4",
        "#5F9EA0",
        "#6495ED",
        "#4169E1",
        "#1E90FF",
        "#00CED1",
      ],
      atmosphereColors: ["#B0E0E6", "#ADD8E6", "#87CEEB"],
      roughness: 0.2,
      metalness: 0.3,
    },
  };

  // Pick a random color from the palette (memoized to prevent regeneration)
  const { baseColor, atmosphereColor, planetConfig } = useMemo(() => {
    const config = planetTypes[type] || planetTypes.rocky;
    const base = new THREE.Color(
      config.colors[Math.floor(Math.random() * config.colors.length)]
    );
    const atmosphere = new THREE.Color(
      config.atmosphereColors[
        Math.floor(Math.random() * config.atmosphereColors.length)
      ]
    );
    return {
      baseColor: base,
      atmosphereColor: atmosphere,
      planetConfig: config,
    };
  }, [type]);

  // Add rotation and orbital animation
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
    }

    // Orbital motion around sun (with speed multiplier)
    if (orbitRadius !== null && groupRef.current) {
      orbitAngle.current += delta * orbitSpeed * speedMultiplier;
      groupRef.current.position.x = Math.cos(orbitAngle.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(orbitAngle.current) * orbitRadius;
    }
  });

  // Create landmass geometry for Earth
  const landmassGeometry = useMemo(() => {
    if (type !== "earth") return null;

    const geometry = new THREE.SphereGeometry(size * 1.001, 64, 64);
    const colors = [];
    const positions = geometry.attributes.position;

    // Create a pseudo-random landmass pattern based on vertex positions
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Pseudo-random noise based on position
      const noise1 = Math.sin(x * 5 + y * 3) * Math.cos(z * 4);
      const noise2 = Math.sin(x * 3 - z * 5) * Math.cos(y * 2);
      const noise3 = Math.sin(y * 4 + z * 3) * Math.cos(x * 6);
      const combinedNoise = (noise1 + noise2 + noise3) / 3;

      // Create landmass pattern (roughly 30% land, 70% ocean)
      const isLand = combinedNoise > 0.2;

      if (isLand) {
        // Mix of green and brown for land
        const landType = Math.sin(x * 10) > 0 ? 0 : 1;
        if (landType === 0) {
          colors.push(0.13, 0.55, 0.13); // Green (forest)
        } else {
          colors.push(0.55, 0.27, 0.07); // Brown (desert/mountain)
        }
      } else {
        // Ocean blue
        colors.push(0.12, 0.56, 1.0); // Deep ocean blue
      }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [type, size]);

  return (
    <group ref={groupRef} position={position}>
      {/* Main Planet Sphere */}
      <mesh ref={planetRef}>
        {type === "earth" && landmassGeometry ? (
          <primitive object={landmassGeometry} attach="geometry" />
        ) : (
          <sphereGeometry args={[size, 64, 64]} />
        )}
        <meshStandardMaterial
          color={type === "earth" ? "#FFFFFF" : baseColor}
          roughness={planetConfig.roughness}
          metalness={planetConfig.metalness}
          emissive={type === "earth" ? new THREE.Color("#1E90FF") : baseColor}
          emissiveIntensity={type === "earth" ? 0.15 : 0.05}
          vertexColors={type === "earth"}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={type === "earth" ? 0.3 : 0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Planet Rings (if enabled) */}
      {hasRings && (
        <PlanetRings
          innerRadius={size * 1.3}
          outerRadius={size * 2}
          color={ringColor}
        />
      )}

      {/* Moons */}
      {moons.map((moon, index) => (
        <Moon
          key={index}
          orbitRadius={moon.orbitRadius}
          size={moon.size}
          speed={moon.speed}
          color={moon.color}
          offset={moon.offset}
        />
      ))}
    </group>
  );
}
