import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useMoodEntries = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MOODS = {
    happy: "😃",
    neutral: "😐",
    sad: "😔",
    stressed: "😫",
    tired: "😴",
  };

  // Fetch all mood entries for current user
  const fetchMoodEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "moodEntries"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
      );
      const snapshot = await getDocs(q);
      const moods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMoodEntries(moods);
      setError(null);
    } catch (err) {
      console.error("Error fetching mood entries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add mood entry
  const addMoodEntry = async (mood, notes = "") => {
    if (!user) return;
    try {
      await addDoc(collection(db, "moodEntries"), {
        userId: user.uid,
        mood,
        notes,
        timestamp: Timestamp.now(),
      });
      await fetchMoodEntries();
    } catch (err) {
      console.error("Error adding mood entry:", err);
      setError(err.message);
      throw err;
    }
  };

  // Delete mood entry
  const deleteMoodEntry = async (entryId) => {
    try {
      await deleteDoc(doc(db, "moodEntries", entryId));
      await fetchMoodEntries();
    } catch (err) {
      console.error("Error deleting mood entry:", err);
      setError(err.message);
      throw err;
    }
  };

  // Get mood trend (last 7 days)
  const getMoodTrend = () => {
    const last7Days = moodEntries.slice(0, 7);
    return last7Days.map((entry) => ({
      date: new Date(entry.timestamp.seconds * 1000).toLocaleDateString(),
      mood: entry.mood,
    }));
  };

  // Detect burnout patterns
  const detectBurnoutPatterns = () => {
    const last7Days = moodEntries.slice(0, 7);
    const stressedOrTiredCount = last7Days.filter(
      (e) => e.mood === "stressed" || e.mood === "tired",
    ).length;

    if (stressedOrTiredCount >= 5) {
      return {
        burnoutRisk: "HIGH",
        message: "⚠️ You seem stressed! Take a break and prioritize self-care.",
        suggestion: "Try 30-minute meditation or take a walk",
      };
    } else if (stressedOrTiredCount >= 3) {
      return {
        burnoutRisk: "MODERATE",
        message: "⚡ You might be overexerting. Balance work with rest.",
        suggestion: "Have a power nap or do something relaxing",
      };
    } else {
      return {
        burnoutRisk: "LOW",
        message: "✅ You're doing great! Keep up the momentum!",
        suggestion: "Maintain your current study routine",
      };
    }
  };

  // Get latest mood
  const getLatestMood = () => {
    return moodEntries.length > 0 ? moodEntries[0] : null;
  };

  // Auto-fetch mood entries when user is available
  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  return {
    moodEntries,
    loading,
    error,
    MOODS,
    fetchMoodEntries,
    addMoodEntry,
    deleteMoodEntry,
    getMoodTrend,
    detectBurnoutPatterns,
    getLatestMood,
  };
};
