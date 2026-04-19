import { useState, useRef, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current || isRunning) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    pause();
    setTime(1500);
  };

  // Format time as MM:SS
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center mt-6">
      <h3 className="text-lg font-semibold mb-4">Pomodoro Timer</h3>
      <div className="text-5xl font-bold text-blue-600 mb-4 font-mono">
        {displayTime}
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={start}
          disabled={isRunning}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold"
        >
          Start
        </button>
        <button
          onClick={pause}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
