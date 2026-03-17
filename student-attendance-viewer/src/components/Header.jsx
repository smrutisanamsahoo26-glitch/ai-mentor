export const Header = ({ darkMode, setDarkMode }) => (
  <div className="flex justify-between items-center mb-6 animate-slide-in">
    <div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        📚 Student Attendance Viewer
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
        Track attendance and identify low-performing students
      </p>
    </div>
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      title="Toggle dark mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  </div>
);

export const StatsDashboard = ({ stats, students }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-slide-in">
    <div className="stat-box from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <p className="text-blue-600 dark:text-blue-300 text-sm font-semibold">
        👥 Total Students
      </p>
      <p className="text-4xl font-bold text-blue-700 dark:text-blue-200 mt-2">
        {students.length}
      </p>
    </div>
    <div className="stat-box from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
      <p className="text-green-600 dark:text-green-300 text-sm font-semibold">
        ✅ Present (≥75%)
      </p>
      <p className="text-4xl font-bold text-green-700 dark:text-green-200 mt-2">
        {stats.presentCount}
      </p>
    </div>
    <div className="stat-box from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
      <p className="text-purple-600 dark:text-purple-300 text-sm font-semibold">
        📊 Average Attendance
      </p>
      <p className="text-4xl font-bold text-purple-700 dark:text-purple-200 mt-2">
        {stats.avgAttendance}%
      </p>
    </div>
  </div>
);
