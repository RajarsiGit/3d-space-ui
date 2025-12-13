// src/components/ThreeScene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import InstancedField from "./InstancedField";

/* ===============================
   Main Scene
   =============================== */
export default function ThreeScene() {
  return (
    <div className="h-screen w-screen bg-gray-900">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 6, 6]} />
        <InstancedField />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
