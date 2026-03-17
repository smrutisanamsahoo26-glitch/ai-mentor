import { statusFromAttendance } from "./calculations";

// Export filtered students to CSV
export const exportToCSV = (filtered, students) => {
  const csv = [
    ["ID", "Name", "Email", "Attendance %", "Status"],
    ...filtered.map((s) => [
      s.id,
      s.name,
      s.email,
      s.attendance,
      statusFromAttendance(s.attendance),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance-report.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};
