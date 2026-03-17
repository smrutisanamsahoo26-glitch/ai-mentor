import { statusFromAttendance, statusClass } from "../utils/calculations";

export const StudentDetails = ({ selectedId, setSelectedId, students }) => {
  if (!selectedId) return null;

  const s = students.find((x) => x.id === selectedId);
  if (!s) return null;

  const status = statusFromAttendance(s.attendance);

  return (
    <div className="mt-6 card p-6 animate-slide-in border-l-4 border-blue-600">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          📋 Selected Student Details
        </h2>
        <button
          onClick={() => setSelectedId(null)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl transition"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border-l-4 border-blue-600 pl-4 py-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Name
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {s.name}
          </p>
        </div>

        <div className="border-l-4 border-purple-600 pl-4 py-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Email
          </p>
          <p className="text-sm font-mono text-slate-900 dark:text-white mt-1 break-all">
            {s.email}
          </p>
        </div>

        <div className="border-l-4 border-green-600 pl-4 py-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Attendance
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
            {s.attendance}%
          </p>
        </div>

        <div className="border-l-4 border-orange-600 pl-4 py-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Status
          </p>
          <span className={`badge text-base mt-1 ${statusClass(s.attendance)}`}>
            {status === "Present" ? "✅" : "⚠️"} {status}
          </span>
        </div>
      </div>
    </div>
  );
};
