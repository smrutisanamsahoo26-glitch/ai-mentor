import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useStudyHours = () => {
  const { user } = useAuth();
  const [studyHours, setStudyHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all manual study hour entries for current user
  const fetchStudyHours = async () => {
    if (!user) {
      setStudyHours([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "studySessions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const hoursData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudyHours(hoursData);
      setError(null);
    } catch (err) {
      console.error("Error fetching study hours:", err.message);
      setError(err.message);
      setStudyHours([]);
    } finally {
      setLoading(false);
    }
  };

  // Add manual study hours
  const addStudyHours = async (hours, subject, notes = "") => {
    if (!user) throw new Error("User not authenticated");
    try {
      const durationMinutes = hours * 60;
      const now = new Date();
      const startTime = new Date(now.getTime() - durationMinutes * 60000);

      await addDoc(collection(db, "studySessions"), {
        userId: user.uid,
        subject,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(now),
        duration: durationMinutes,
        notes,
        isManual: true, // Flag to distinguish from timer sessions
        createdAt: Timestamp.now(),
      });
      await fetchStudyHours();
      return true;
    } catch (err) {
      console.error("Error adding study hours:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get today's total study hours
  const getTodayStudyHours = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return studyHours
      .filter((session) => {
        const sessionDate = new Date(session.createdAt.seconds * 1000);
        return sessionDate >= today && sessionDate < tomorrow;
      })
      .reduce((total, session) => total + session.duration / 60, 0); // Convert to hours
  };

  // Get this week's total study hours
  const getWeeklyStudyHours = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return studyHours
      .filter((session) => {
        const sessionDate = new Date(session.createdAt.seconds * 1000);
        return sessionDate >= weekAgo;
      })
      .reduce((total, session) => total + session.duration / 60, 0);
  };

  // Get study hours by date range
  const getStudyHoursByDateRange = (startDate, endDate) => {
    return studyHours.filter((session) => {
      const sessionDate = new Date(session.createdAt.seconds * 1000);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  // Get study hours by subject
  const getStudyHoursBySubject = (subject) => {
    return studyHours.filter((session) => session.subject === subject);
  };

  // Auto-fetch when user changes
  useEffect(() => {
    if (user) {
      fetchStudyHours();
    }
  }, [user]);

  return {
    studyHours,
    loading,
    error,
    fetchStudyHours,
    addStudyHours,
    getTodayStudyHours,
    getWeeklyStudyHours,
    getStudyHoursByDateRange,
    getStudyHoursBySubject,
  };
};
