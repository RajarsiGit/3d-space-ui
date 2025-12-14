// src/components/ThreeScene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import InstancedField from "./InstancedField";
import PlanetarySystem from "./PlanetarySystem";

/* ===============================
   Main Scene
   =============================== */
export default function ThreeScene({ orbitalSpeed = 1 }) {
  return (
    <div className="h-screen w-screen bg-gray-900">
      <Canvas camera={{ position: [40, 30, 40], fov: 60 }}>
        <ambientLight intensity={0.1} />
        {/* <directionalLight position={[6, 6, 6]} /> */}
        <InstancedField />
        <PlanetarySystem
          planetCount={8}
          minOrbit={12}
          maxOrbit={80}
          speedMultiplier={orbitalSpeed}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
