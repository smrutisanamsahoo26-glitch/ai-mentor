import { useEffect, useMemo, useState } from "react";

// Import utilities
import {
  calculateStats,
  generatePieData,
  generateAttendanceDistribution,
  generateTopStudents,
  filterStudents,
} from "./utils/calculations";
import { fetchStudentsData } from "./utils/dataGeneration";
import { exportToCSV } from "./utils/export";

// Import components
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./components/StateComponents";
import { Header, StatsDashboard } from "./components/Header";
import { ChartsSection, TopStudentsChart } from "./components/Charts";
import { FilterBar, SearchBar } from "./components/Filters";
import { StudentTable } from "./components/StudentTable";
import { StudentDetails } from "./components/StudentDetails";

function App() {
  // State management
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortToggle, setSortToggle] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch students on mount
  useEffect(() => {
    const controller = new AbortController();

    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentsData(controller.signal);
        setStudents(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
    return () => controller.abort();
  }, []);

  // Apply filters & sorting
  const filtered = useMemo(
    () =>
      filterStudents(
        students,
        filter,
        showLowAttendance,
        searchQuery,
        sortToggle,
      ),
    [students, filter, showLowAttendance, searchQuery, sortToggle],
  );

  // Calculate statistics
  const stats = useMemo(() => calculateStats(students), [students]);

  // Generate chart data
  const pieData = useMemo(() => generatePieData(students), [students]);
  const distributionData = useMemo(
    () => generateAttendanceDistribution(students),
    [students],
  );
  const topStudentsData = useMemo(
    () => generateTopStudents(students),
    [students],
  );

  // Handle dark mode toggle
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Handle CSV export
  const handleExport = () => {
    exportToCSV(filtered, students);
  };

  // Render loading state
  if (loading) return <LoadingState />;

  // Render error state
  if (error) return <ErrorState error={error} />;

  // Render empty state
  if (students.length === 0) return <EmptyState />;

  // Main render
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header & Branding */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Statistics Dashboard */}
        <StatsDashboard stats={stats} students={students} />

        {/* Charts Visualization */}
        <ChartsSection pieData={pieData} distributionData={distributionData} />

        {/* Top Students Chart */}
        <TopStudentsChart topStudentsData={topStudentsData} />

        {/* Filter & Sort Controls */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortToggle={sortToggle}
          setSortToggle={setSortToggle}
          showLowAttendance={showLowAttendance}
          setShowLowAttendance={setShowLowAttendance}
          handleExport={handleExport}
        />

        {/* Search & Entry Counter */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filtered={filtered}
          students={students}
        />

        {/* Student List Table */}
        <StudentTable
          filtered={filtered}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />

        {/* Selected Student Details */}
        <StudentDetails
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          students={students}
        />
      </div>
    </div>
  );
}

export default App;
