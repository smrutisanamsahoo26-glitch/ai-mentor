import { API_URL, FIRST_NAMES, LAST_NAMES } from "../constants";

// Generate random attendance percentage
export const getRandomAttendance = () => Math.floor(Math.random() * 41) + 60;

// Fetch students from API and generate synthetic data
export const fetchStudentsData = async (signal) => {
  const res = await fetch(API_URL, { signal });

  if (!res.ok) throw new Error("API error");

  const data = await res.json();

  // Enrich API data with attendance
  const enriched = data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    attendance: getRandomAttendance(),
  }));

  // Generate 20 synthetic students to reach 30 total
  const syntheticStudents = FIRST_NAMES.map((first, idx) => ({
    id: data.length + idx + 1,
    name: `${first} ${LAST_NAMES[idx]}`,
    email: `${first.toLowerCase()}.${LAST_NAMES[idx].toLowerCase()}@school.edu`,
    attendance: getRandomAttendance(),
  }));

  return [...enriched, ...syntheticStudents];
};
