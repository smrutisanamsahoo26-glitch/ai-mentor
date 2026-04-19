import { API_URL, FIRST_NAMES, LAST_NAMES } from "../constants";
export const getRandomAttendance = () => Math.floor(Math.random() * 41) + 60;

export const fetchStudentsData = async (signal) => {
  const res = await fetch(API_URL, { signal });

  if (!res.ok) throw new Error("API error");

  const data = await res.json();
  const enriched = data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    attendance: getRandomAttendance(),
  }));

  const syntheticStudents = FIRST_NAMES.map((first, idx) => ({
    id: data.length + idx + 1,
    name: `${first} ${LAST_NAMES[idx]}`,
    email: `${first.toLowerCase()}.${LAST_NAMES[idx].toLowerCase()}@school.edu`,
    attendance: getRandomAttendance(),
  }));

  return [...enriched, ...syntheticStudents];
};
