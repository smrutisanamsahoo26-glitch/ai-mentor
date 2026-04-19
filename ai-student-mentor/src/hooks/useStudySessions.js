import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useStudySessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all study sessions for current user
  const fetchSessions = async () => {
    if (!user) {
      setSessions([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "studySessions"),
        where("userId", "==", user.uid),
        orderBy("startTime", "desc"),
      );
      const snapshot = await getDocs(q);
      const sessionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching sessions:", err.message);
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch sessions when user is available
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  // Start new study session
  const startSession = async (sessionData) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "studySessions"), {
        userId: user.uid,
        ...sessionData,
        startTime: Timestamp.now(),
        endTime: null,
        duration: 0, // in minutes
      });
      return docRef.id;
    } catch (err) {
      console.error("Error starting session:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // End study session
  const endSession = async (sessionId, duration) => {
    try {
      await updateDoc(doc(db, "studySessions", sessionId), {
        endTime: Timestamp.now(),
        duration: duration, // in minutes
      });
      await fetchSessions();
    } catch (err) {
      console.error("Error ending session:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get total study time for a subject
  const getTotalStudyTimeBySubject = (subject) => {
    return sessions
      .filter((s) => s.subject === subject)
      .reduce((total, s) => total + (s.duration || 0), 0);
  };

  // Get total study time today
  const getTodayStudyTime = () => {
    const today = new Date().toDateString();
    return sessions
      .filter((s) => {
        const sessionDate = new Date(s.startTime.seconds * 1000).toDateString();
        return sessionDate === today;
      })
      .reduce((total, s) => total + (s.duration || 0), 0);
  };

  // Get study time stats by subject
  const getSubjectStats = () => {
    const stats = {};
    sessions.forEach((session) => {
      if (!stats[session.subject]) {
        stats[session.subject] = 0;
      }
      stats[session.subject] += session.duration || 0;
    });
    return stats;
  };

  // Delete session
  const deleteSession = async (sessionId) => {
    try {
      await deleteDoc(doc(db, "studySessions", sessionId));
      await fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err.message);
      setError(err.message);
      throw err;
    }
  };

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    startSession,
    endSession,
    getTotalStudyTimeBySubject,
    getTodayStudyTime,
    getSubjectStats,
    deleteSession,
  };
};
