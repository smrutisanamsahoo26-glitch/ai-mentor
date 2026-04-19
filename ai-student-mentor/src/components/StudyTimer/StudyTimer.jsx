import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiRotateCcw, FiCheck } from "react-icons/fi";
import { useStudySessions } from "../../hooks/useStudySessions";

export default function StudyTimer({ subjects = [] }) {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0] || "General",
  );
  const [sessionId, setSessionId] = useState(null);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showCustom, setShowCustom] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const { startSession, endSession } = useStudySessions();
  const intervalRef = useRef(null);

  const TIMER_MODES = [
    { name: "Pomodoro", duration: 25 * 60 },
    { name: "Short Break", duration: 5 * 60 },
    { name: "Long Break", duration: 15 * 60 },
  ];

  // Timer logic with stable interval
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Only set up interval if running
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer completed
          setIsRunning(false);
          setTimerComplete(true);
          return 0;
        }
        setSessionMinutes((p) => p + 1 / 60);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = async () => {
    if (!isRunning && !sessionId) {
      // Start new session
      try {
        const id = await startSession({
          subject: selectedSubject,
        });
        setSessionId(id);
        setIsRunning(true);
      } catch (error) {
        console.error("Error starting session:", error);
      }
    } else if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(false);
    setTimerComplete(false);
    if (sessionId) {
      try {
        await endSession(sessionId, Math.round(sessionMinutes));
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
    setSessionId(null);
    setTimeLeft(1500);
    setSessionMinutes(0);
  };

  const completeSession = async () => {
    if (sessionId) {
      try {
        await endSession(sessionId, Math.round(sessionMinutes));
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
  };

  const playNotification = () => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio notification play error:", error);
    }
  };

  const handleSetTimer = (duration) => {
    setTimeLeft(duration);
    setSessionMinutes(0);
    setIsRunning(false);
    setTimerComplete(false);
    if (sessionId) {
      setSessionId(null);
    }
    setShowCustom(false);
  };

  const handleSetCustom = () => {
    if (customMinutes > 0) {
      handleSetTimer(customMinutes * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      {/* Floating Timer Display */}
      {isRunning && (
        <div className="fixed top-20 right-6 z-40 bg-white rounded-2xl shadow-2xl p-6 border-4 border-green-500 animate-bounce">
          <div className="text-4xl font-bold text-green-600 font-mono text-center">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-semibold">
            Active Study
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ⏱️ Study Timer (Pomodoro)
        </h2>

        {/* Subject Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            What are you studying?
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
            <option value="General">General Study</option>
          </select>
        </div>

        {/* Timer Display */}
        <div
          className={`rounded-2xl p-12 text-center mb-8 shadow-md transition-all ${
            timerComplete
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : "bg-white"
          }`}
        >
          <div
            className={`text-7xl font-bold font-mono mb-2 transition-all ${
              timerComplete ? "text-white" : "text-green-600"
            }`}
          >
            {timerComplete
              ? "✓ Done!"
              : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
          </div>
          <p
            className={`text-lg transition-all ${
              timerComplete ? "text-white font-semibold" : "text-gray-600"
            }`}
          >
            {timerComplete
              ? "🎉 Study session completed! Great work!"
              : isRunning
                ? "⏳ Active Session"
                : "Ready to focus?"}
          </p>
          {sessionId && !timerComplete && (
            <p className="text-gray-500 mt-2 text-sm">
              Session time: {Math.round(sessionMinutes)} minutes
            </p>
          )}
        </div>

        {/* Timer Mode Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {TIMER_MODES.map((mode) => (
            <button
              key={mode.name}
              onClick={() => handleSetTimer(mode.duration)}
              disabled={isRunning}
              className={`py-3 rounded-lg font-semibold transition-all ${
                timeLeft === mode.duration
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
              } disabled:opacity-50`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* Custom Time Input */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-300">
          <label className="block text-gray-700 font-semibold mb-3">
            ⏰ Custom Timer (minutes)
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={(e) =>
                setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))
              }
              disabled={isRunning}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            />
            <button
              onClick={handleSetCustom}
              disabled={isRunning || customMinutes <= 0}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition font-semibold"
            >
              Set
            </button>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition text-lg font-semibold"
          >
            <FiPlay size={24} />
            Start
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition text-lg font-semibold"
          >
            <FiPause size={24} />
            Pause
          </button>
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition text-lg font-semibold"
          >
            <FiRotateCcw size={24} />
            Reset
          </button>
        </div>

        {/* Tips */}
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-900 font-semibold mb-2">💡 Pomodoro Tips:</p>
          <ul className="text-green-800 text-sm space-y-1">
            <li>✓ Silence your phone during study sessions</li>
            <li>✓ Take breaks to recharge your focus</li>
            <li>✓ Consistency builds strong habits</li>
            <li>✓ Track your progress over time</li>
          </ul>
        </div>
      </div>
    </>
  );
}
