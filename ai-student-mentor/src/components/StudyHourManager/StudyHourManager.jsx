import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useStudyHours } from "../../hooks/useStudyHours";
import { useStudySessions } from "../../hooks/useStudySessions";

export default function StudyHourManager() {
  const { studyHours, addStudyHours, getTodayStudyHours, getWeeklyStudyHours } =
    useStudyHours();
  const { sessions, fetchSessions } = useStudySessions();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    hours: "",
    subject: "General",
    notes: "",
  });

  const subjects = [
    "General",
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Other",
  ];

  const handleAddStudyHours = async (e) => {
    e.preventDefault();
    if (!formData.hours || formData.hours <= 0) {
      alert("Please enter valid hours");
      return;
    }

    try {
      await addStudyHours(parseFloat(formData.hours), formData.subject, formData.notes);
      setFormData({ hours: "", subject: "General", notes: "" });
      setShowAddForm(false);
      // Refresh sessions to update dashboard
      await fetchSessions();
    } catch (error) {
      alert("Error adding study hours: " + error.message);
    }
  };

  const todayHours = getTodayStudyHours();
  const weeklyHours = getWeeklyStudyHours();

  // Get today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.createdAt.seconds * 1000);
    return sessionDate >= today && sessionDate < tomorrow;
  });

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📚 Study Hour Manager</h2>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-blue-50"
          } border-l-4 border-blue-500`}
        >
          <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Today's Study Hours
          </p>
          <p className="text-3xl font-bold text-blue-600">{todayHours.toFixed(2)}h</p>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-green-50"
          } border-l-4 border-green-500`}
        >
          <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            This Week's Study Hours
          </p>
          <p className="text-3xl font-bold text-green-600">{weeklyHours.toFixed(2)}h</p>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Last 7 days
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-purple-50"
          } border-l-4 border-purple-500`}
        >
          <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Weekly Goal Progress
          </p>
          <p className="text-3xl font-bold text-purple-600">
            {weeklyHours >= 30 ? "✅ 30h+" : `${weeklyHours.toFixed(1)}h`}
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Target: 30 hours/week
          </p>
        </div>
      </div>

      {/* Add Study Hours Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        <FiPlus /> Add Study Hours Manually
      </button>

      {/* Add Study Hours Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddStudyHours}
          className={`p-4 rounded-lg mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
        >
          <h3 className="font-semibold text-lg mb-4">Add Manual Study Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="Enter hours (e.g., 1.5)"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""
                }`}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Add notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""
                }`}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Study Hours
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Today's Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Today's Study Sessions</h3>
        {todaySessions.length === 0 ? (
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            No study sessions recorded today. Start studying to log your hours!
          </p>
        ) : (
          <div className="space-y-2">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg flex justify-between items-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div>
                  <p className="font-semibold">{session.subject || "General"}</p>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    {(session.duration / 60).toFixed(2)} hours
                    {session.isManual && " (Manual Entry)"}
                  </p>
                  {session.notes && (
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      📝 {session.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(session.createdAt.seconds * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Breakdown */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📊 Subject-Wise Study Hours</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Group study hours by subject */}
          {(() => {
            const subjectHours = {};
            studyHours.forEach((session) => {
              const subject = session.subject || "General";
              subjectHours[subject] = (subjectHours[subject] || 0) + session.duration / 60;
            });

            return Object.entries(subjectHours).length === 0 ? (
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                No study data yet
              </p>
            ) : (
              Object.entries(subjectHours)
                .sort((a, b) => b[1] - a[1])
                .map(([subject, hours]) => (
                  <div
                    key={subject}
                    className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}
                  >
                    <p className="font-semibold">{subject}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {hours.toFixed(2)}h
                    </p>
                  </div>
                ))
            );
          })()}
        </div>
      </div>

      {/* Goal Progress Bar */}
      <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Weekly Goal Progress (30 hours)</p>
          <p className="text-sm font-bold">
            {Math.min((weeklyHours / 30) * 100, 100).toFixed(0)}%
          </p>
        </div>
        <div
          className={`w-full ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded-full h-4`}
        >
          <div
            className={`h-4 rounded-full transition-all ${
              weeklyHours >= 30
                ? "bg-green-500"
                : weeklyHours >= 20
                  ? "bg-yellow-500"
                  : "bg-blue-500"
            }`}
            style={{ width: `${Math.min((weeklyHours / 30) * 100, 100)}%` }}
          />
        </div>
        <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {weeklyHours >= 30
            ? `🎉 Great job! You've reached your weekly goal!`
            : `Keep studying! ${(30 - weeklyHours).toFixed(2)} hours to go.`}
        </p>
      </div>
    </div>
  );
}
