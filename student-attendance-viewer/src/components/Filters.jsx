import { ATTENDANCE_THRESHOLD, FILTER_OPTIONS } from "../constants";

export const FilterBar = ({
  filter,
  setFilter,
  sortToggle,
  setSortToggle,
  showLowAttendance,
  setShowLowAttendance,
  handleExport,
}) => (
  <div className="card p-6 mb-6 animate-slide-in">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
      🔍 Filter & Sort Options
    </h3>
    <div className="flex flex-wrap gap-3 items-center">
      {FILTER_OPTIONS.map((type) => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === type
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          {type === "All" ? "📋" : type === "Present" ? "✅" : "❌"} {type}
        </button>
      ))}

      <button
        onClick={() =>
          setSortToggle((prev) => (prev === "desc" ? "asc" : "desc"))
        }
        className="px-4 py-2 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition"
      >
        {sortToggle === "desc" ? "📊 High → Low" : "📈 Low → High"}
      </button>

      <button
        onClick={() => setShowLowAttendance(!showLowAttendance)}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          showLowAttendance
            ? "bg-red-600 text-white shadow-lg"
            : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
        }`}
      >
        ⚠️ Only &lt;{ATTENDANCE_THRESHOLD}%
      </button>

      <button
        onClick={handleExport}
        className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition sm:ml-auto"
        title="Download attendance report as CSV"
      >
        ⬇️ Export CSV
      </button>
    </div>
  </div>
);

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  filtered,
  students,
}) => (
  <div className="card p-6 mb-6 animate-slide-in space-y-4">
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="🔍 Search by student name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field flex-1"
      />
    </div>

    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
      <span>📌</span>
      Showing <span className="font-semibold">{filtered.length}</span> of{" "}
      <span className="font-semibold">{students.length}</span> students
    </p>
  </div>
);
