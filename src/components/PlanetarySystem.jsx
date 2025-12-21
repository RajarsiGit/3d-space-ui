// src/components/PlanetarySystem.jsx
import { useMemo } from "react";
import Planet from "./Planet";
import Sun from "./Sun";

/* ===============================
   Planetary System Generator
   ===============================
   Generates a solar system with:
   - Central sun
   - Orbiting planets (rocky, gas, ice)
   - Varied orbital distances and speeds
   - Random moons
   - Occasional rings
*/
export default function PlanetarySystem({
  planetCount = 8,
  minOrbit = 12,
  maxOrbit = 80,
  speedMultiplier = 1,
}) {
  const planets = useMemo(() => {
    const generatedPlanets = [];
    const planetTypes = ["rocky", "gas", "ice"];
    const ringColors = ["#8b7355", "#a8896a", "#c9b896", "#6b5d52"];

    for (let i = 0; i < planetCount; i++) {
      // Orbital parameters - planets in concentric orbits with better spacing
      const orbitRadius =
        minOrbit + (maxOrbit - minOrbit) * Math.pow(i / (planetCount - 1), 1.3);
      const orbitSpeed = 0.1 / Math.sqrt(orbitRadius); // Kepler's law approximation (slower overall)
      const orbitOffset = Math.random() * Math.PI * 2; // Random starting position
      const y = (Math.random() - 0.5) * 0.5; // Minimal vertical variation

      // Special case: Make the 3rd planet Earth (habitable zone)
      let type;
      if (i === 2) {
        type = "earth";
      } else {
        // Planet type based on distance (inner rocky, middle/outer gas/ice)
        let typeIndex;
        if (i < planetCount * 0.4) typeIndex = 0; // Inner planets rocky
        else if (i < planetCount * 0.7) typeIndex = 1; // Middle planets gas giants
        else typeIndex = 2; // Outer planets ice
        type = planetTypes[typeIndex];
      }

      // Size varies by type - much smaller relative to sun
      let size;
      if (type === "earth") size = 0.6; // Earth-sized
      else if (type === "rocky") size = 0.3 + Math.random() * 0.4; // 0.3-0.7 (small)
      else if (type === "gas")
        size = 0.8 + Math.random() * 0.6; // 0.8-1.4 (larger)
      else size = 0.5 + Math.random() * 0.5; // 0.5-1.0 (medium)

      // Rotation speed varies by size (smaller = faster)
      const rotationSpeed = 0.005 + (1 / size) * 0.01;

      // Gas giants have higher chance of rings
      const hasRings =
        type === "gas" ? Math.random() < 0.4 : Math.random() < 0.1;
      const ringColor =
        ringColors[Math.floor(Math.random() * ringColors.length)];

      // Generate moons (more likely for larger planets, fewer overall)
      const moons = [];
      let moonCount;

      if (type === "earth") {
        // Earth always gets one moon
        moonCount = 1;
      } else {
        const moonChance = type === "gas" ? 0.7 : 0.3; // Gas giants more likely to have moons
        moonCount = Math.random() < moonChance ? Math.floor(Math.random() * 2) + 1 : 0;
      }

      for (let j = 0; j < moonCount; j++) {
        const moonSize = size * (0.1 + Math.random() * 0.15); // Scale with planet
        const orbitRadius = size * (2 + j * 1.2);
        const moonSpeed = 0.3 + Math.random() * 0.5;
        const moonOffset = Math.random() * Math.PI * 2;

        // Moon colors (gray variations)
        const grayValue = 0.4 + Math.random() * 0.4;
        const moonColor = `rgb(${grayValue * 255}, ${grayValue * 255}, ${
          grayValue * 255
        })`;

        moons.push({
          size: moonSize,
          orbitRadius: orbitRadius,
          speed: moonSpeed,
          color: moonColor,
          offset: moonOffset,
        });
      }

      generatedPlanets.push({
        id: i,
        position: [0, y, 0], // Start at origin, orbit will move them
        size,
        type,
        rotationSpeed,
        hasRings,
        ringColor,
        moons,
        orbitRadius,
        orbitSpeed,
        orbitOffset,
      });
    }

    return generatedPlanets;
  }, [planetCount, minOrbit, maxOrbit]);

  return (
    <group>
      {/* Central Sun - larger to be more prominent */}
      <Sun position={[0, 0, 0]} size={2.5} />

      {/* Orbiting Planets */}
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          position={planet.position}
          size={planet.size}
          type={planet.type}
          rotationSpeed={planet.rotationSpeed}
          hasRings={planet.hasRings}
          ringColor={planet.ringColor}
          moons={planet.moons}
          orbitRadius={planet.orbitRadius}
          orbitSpeed={planet.orbitSpeed}
          orbitOffset={planet.orbitOffset}
          speedMultiplier={speedMultiplier}
        />
      ))}
    </group>
  );
}
