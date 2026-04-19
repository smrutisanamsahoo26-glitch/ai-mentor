import { useEffect, useMemo, useState } from "react";
import {
  calculateStats,
  generatePieData,
  generateAttendanceDistribution,
  generateTopStudents,
  filterStudents,
} from "./utils/calculations";
import { fetchStudentsData } from "./utils/dataGeneration";
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
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortToggle, setSortToggle] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
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
  const stats = useMemo(() => calculateStats(students), [students]);
  const pieData = useMemo(() => generatePieData(students), [students]);
  const distributionData = useMemo(
    () => generateAttendanceDistribution(students),
    [students],
  );
  const topStudentsData = useMemo(
    () => generateTopStudents(students),
    [students],
  );
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (students.length === 0) return <EmptyState />;
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <StatsDashboard stats={stats} students={students} />
        <ChartsSection pieData={pieData} distributionData={distributionData} />
        <TopStudentsChart topStudentsData={topStudentsData} />
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortToggle={sortToggle}
          setSortToggle={setSortToggle}
          showLowAttendance={showLowAttendance}
          setShowLowAttendance={setShowLowAttendance}
        />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filtered={filtered}
          students={students}
        />
        <StudentTable
          filtered={filtered}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
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
