import { ATTENDANCE_THRESHOLD } from "../constants";

// Status determination
export const statusFromAttendance = (attendance) =>
  attendance >= ATTENDANCE_THRESHOLD ? "Present" : "Absent";

// CSS classes for status
export const statusClass = (attendance) =>
  attendance >= ATTENDANCE_THRESHOLD
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

// Calculate statistics from student list
export const calculateStats = (students) => {
  if (students.length === 0)
    return { avgAttendance: 0, presentCount: 0, absentCount: 0 };

  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendance, 0) / students.length,
  );
  const presentCount = students.filter(
    (s) => s.attendance >= ATTENDANCE_THRESHOLD,
  ).length;

  return {
    avgAttendance,
    presentCount,
    absentCount: students.length - presentCount,
  };
};

// Generate pie chart data
export const generatePieData = (students) => [
  {
    name: "Present (≥75%)",
    value: students.filter((s) => s.attendance >= ATTENDANCE_THRESHOLD).length,
    fill: "#10b981",
  },
  {
    name: "Absent (<75%)",
    value: students.filter((s) => s.attendance < ATTENDANCE_THRESHOLD).length,
    fill: "#ef4444",
  },
];

// Generate attendance distribution for bar chart
export const generateAttendanceDistribution = (students) => {
  const ranges = [
    { range: "60-69%", count: 0 },
    { range: "70-79%", count: 0 },
    { range: "80-89%", count: 0 },
    { range: "90-100%", count: 0 },
  ];

  students.forEach((s) => {
    if (s.attendance < 70) ranges[0].count++;
    else if (s.attendance < 80) ranges[1].count++;
    else if (s.attendance < 90) ranges[2].count++;
    else ranges[3].count++;
  });

  return ranges;
};

// Get top 5 students for chart
export const generateTopStudents = (students) => {
  return students.slice(0, 5).map((s) => ({
    name: s.name.split(" ")[0],
    attendance: s.attendance,
  }));
};

// Filter students based on current filters
export const filterStudents = (
  students,
  filter,
  showLowAttendance,
  searchQuery,
  sortToggle,
) => {
  let items = [...students];

  // Apply filter
  if (filter !== "All") {
    items = items.filter(
      (s) =>
        (filter === "Present" && s.attendance >= ATTENDANCE_THRESHOLD) ||
        (filter === "Absent" && s.attendance < ATTENDANCE_THRESHOLD),
    );
  }

  // Apply low attendance filter
  if (showLowAttendance)
    items = items.filter((s) => s.attendance < ATTENDANCE_THRESHOLD);

  // Apply search
  if (searchQuery.trim()) {
    items = items.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // Apply sort
  items.sort((a, b) => {
    if (sortToggle === "desc") return b.attendance - a.attendance;
    return a.attendance - b.attendance;
  });

  return items;
};
