// src/components/SpeedController.jsx
import { useState } from "react";
import PropTypes from "prop-types";

/* ===============================
   Speed Controller Component
   ===============================
   UI control for adjusting orbital speed
*/
export default function SpeedController({ onSpeedChange }) {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (e) => {
    const newSpeed = Number.parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="fixed bottom-6 left-6 bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-white shadow-lg border border-gray-700">
      <div className="flex flex-col gap-3 min-w-[220px]">
        {/* Speed Control */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="speed-input" className="text-sm font-medium">
              Orbital Speed
            </label>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
              {speed.toFixed(1)}x
            </span>
          </div>
          <input
            id="speed-input"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Pause</span>
            <span>Normal</span>
            <span>5x</span>
          </div>
        </div>
      </div>
    </div>
  );
}

SpeedController.propTypes = {
  onSpeedChange: PropTypes.func.isRequired,
};
