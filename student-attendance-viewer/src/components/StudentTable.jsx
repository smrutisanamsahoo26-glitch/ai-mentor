import { statusFromAttendance, statusClass } from "../utils/calculations";
import { ATTENDANCE_THRESHOLD } from "../constants";

export const StudentTable = ({ filtered, selectedId, setSelectedId }) => (
  <div className="card overflow-hidden animate-slide-in">
    <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-600">
      <span>Name</span>
      <span>Attendance</span>
      <span>Status</span>
      <span className="text-right">Action</span>
    </div>

    {filtered.map((student) => {
      const isSelected = selectedId === student.id;
      const status = statusFromAttendance(student.attendance);
      const progressPercent = student.attendance;

      return (
        <button
          key={student.id}
          onClick={() => setSelectedId(student.id)}
          className={`grid grid-cols-4 gap-4 items-center px-6 py-4 border-b text-left w-full transition dark:border-slate-700 ${
            isSelected
              ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600"
              : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
          }`}
        >
          <span className="font-semibold text-slate-900 dark:text-white">
            {student.name}
          </span>

          <div className="flex items-center gap-3">
            <span className="font-bold dark:text-white text-lg">
              {progressPercent}%
            </span>
            <div className="w-20 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  progressPercent >= ATTENDANCE_THRESHOLD
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <span className={`badge ${statusClass(student.attendance)}`}>
            {status === "Present" ? "✅" : "❌"} {status}
          </span>

          <span className="text-right text-2xl">
            {isSelected ? "🔵" : "⭕"}
          </span>
        </button>
      );
    })}

    {filtered.length === 0 && (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        <p className="text-2xl mb-2">📭</p>
        <p className="text-lg font-semibold">No students match your filters</p>
        <p className="text-sm mt-1">
          Try adjusting your search or view options
        </p>
      </div>
    )}
  </div>
);
