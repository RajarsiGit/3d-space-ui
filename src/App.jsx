import { useState } from "react";
import ThreeScene from "./components/ThreeScene";
import SpeedController from "./components/SpeedController";

export default function App() {
  const [orbitalSpeed, setOrbitalSpeed] = useState(1);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      <div className="flex h-full">
        {/* Left panel */}
        {/* <div className="w-1/3 p-6 border-r border-gray-700">
          <h1 className="text-2xl font-semibold mb-4">3D Dashboard</h1>
          <p className="text-gray-400">
            This panel is regular React + Tailwind UI.
          </p>
        </div> */}

        {/* 3D Canvas */}
        <div className="flex-1">
          <ThreeScene orbitalSpeed={orbitalSpeed} />
        </div>
      </div>

      {/* Speed Controller UI */}
      <SpeedController onSpeedChange={setOrbitalSpeed} />
    </div>
  );
}
