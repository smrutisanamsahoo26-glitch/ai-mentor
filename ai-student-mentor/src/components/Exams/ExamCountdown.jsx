import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function ExamCountdown({
  exam,
  onDelete,
  onEdit,
  isDarkMode = false,
}) {
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [color, setColor] = useState("bg-green-100");
  const [borderColor, setBorderColor] = useState("border-green-500");

  useEffect(() => {
    const calculateCountdown = () => {
      const examDate = new Date(exam.date);
      const now = new Date();
      const diffMs = examDate - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      setDaysLeft(diffDays > 0 ? diffDays : 0);
      setHoursLeft(diffHours > 0 ? diffHours : 0);

      // Color coding based on urgency and priority
      if (diffDays <= 1) {
        setColor("bg-red-100");
        setBorderColor("border-red-500");
      } else if (diffDays <= 3 || exam.priority === "high") {
        setColor("bg-yellow-100");
        setBorderColor("border-yellow-500");
      } else {
        setColor("bg-green-100");
        setBorderColor("border-green-500");
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, [exam.date, exam.priority]);

  const priorityEmoji = {
    high: "🔴",
    moderate: "🟡",
    low: "🟢",
  };

  const priorityLabel = {
    high: "Urgent",
    moderate: "Moderate",
    low: "Chill",
  };

  const getDarkModeStyles = () => {
    if (daysLeft <= 1) {
      return isDarkMode
        ? "bg-red-900/40 border-red-600"
        : "bg-red-100 border-red-500";
    } else if (daysLeft <= 3 || exam.priority === "high") {
      return isDarkMode
        ? "bg-yellow-900/40 border-yellow-600"
        : "bg-yellow-100 border-yellow-500";
    } else {
      return isDarkMode
        ? "bg-green-900/40 border-green-600"
        : "bg-green-100 border-green-500";
    }
  };

  return (
    <div
      className={`border-l-4 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${getDarkModeStyles()}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            {exam.subject}
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {new Date(exam.date).toLocaleDateString()} at {exam.time}
          </p>
        </div>
        <span className="text-3xl">{priorityEmoji[exam.priority]}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
        >
          <div
            className={`text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {daysLeft}
          </div>
          <div
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Days Left
          </div>
        </div>
        <div
          className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
        >
          <div
            className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
          >
            {priorityLabel[exam.priority]}
          </div>
          <div
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Priority Level
          </div>
        </div>
      </div>

      <div
        className={`mb-4 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
      >
        <div
          className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Status
        </div>
        <div
          className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          {daysLeft === 0
            ? "🚨 Exam Today!"
            : daysLeft === 1
              ? "⚡ Tomorrow!"
              : `📅 ${daysLeft} days, ${hoursLeft} hours remaining`}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(exam)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FiEdit2 size={18} />
          Edit
        </button>
        <button
          onClick={() => onDelete(exam.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FiTrash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
