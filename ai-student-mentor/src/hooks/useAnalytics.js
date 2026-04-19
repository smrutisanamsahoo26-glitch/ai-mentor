import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useMemo, useEffect } from "react";

export const useAnalytics = () => {
  const { user } = useAuth();
  const [studySessions, setStudySessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!user) {
      setStudySessions([]);
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      // Fetch study sessions
      const sessionQuery = query(
        collection(db, "studySessions"),
        where("userId", "==", user.uid),
        orderBy("startTime", "desc"),
      );
      const sessionSnapshot = await getDocs(sessionQuery);
      const sessionsData = sessionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudySessions(sessionsData);

      // Fetch tasks
      const taskQuery = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
      );
      const taskSnapshot = await getDocs(taskQuery);
      const tasksData = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);

      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err.message);
      setError(err.message);
      setStudySessions([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch analytics when user is available
  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  // Calculate analytics using useMemo for optimization
  const analytics = useMemo(() => {
    const subjectStats = {};
    const dailyStats = {};

    // Calculate subject-wise study time
    studySessions.forEach((session) => {
      const subject = session.subject || "General";
      if (!subjectStats[subject]) {
        subjectStats[subject] = 0;
      }
      subjectStats[subject] += session.duration || 0;
    });

    // Calculate daily study time (last 7 days)
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      dailyStats[dateStr] = 0;
    }

    studySessions.forEach((session) => {
      const sessionDate = new Date(
        session.startTime.seconds * 1000,
      ).toLocaleDateString();
      if (dailyStats.hasOwnProperty(sessionDate)) {
        dailyStats[sessionDate] += session.duration || 0;
      }
    });

    // Calculate task completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const completionRate =
      totalTasks > 0 ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    // Calculate total study hours
    const totalStudyMinutes = studySessions.reduce(
      (sum, s) => sum + (s.duration || 0),
      0,
    );
    const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

    // Calculate weekly study hours
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyStudyMinutes = studySessions
      .filter((s) => new Date(s.startTime.seconds * 1000) > weekAgo)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    const weeklyStudyHours = parseFloat((weeklyStudyMinutes / 60).toFixed(1)) || 0;

    return {
      subjectStats,
      dailyStats,
      totalTasks,
      completedTasks,
      completionRate,
      totalStudyHours,
      weeklyStudyHours,
      totalStudyMinutes,
    };
  }, [studySessions, tasks]);

  // Get weak areas (subjects with low study time)
  const getWeakAreas = useMemo(() => {
    return () => {
      const sorted = Object.entries(analytics.subjectStats)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([subject, hours]) => ({
          subject,
          studyTime: (hours / 60).toFixed(1),
          recommendation: `Increase practice in ${subject} - currently only ${(hours / 60).toFixed(1)} hours`,
        }));
      return sorted;
    };
  }, [analytics.subjectStats]);

  // Get productivity insights
  const getProductivityInsights = useMemo(() => {
    return () => {
      const avgDaily = (
        Object.values(analytics.dailyStats).reduce((a, b) => a + b, 0) / 7
      ).toFixed(1);
      const bestDay = Object.entries(analytics.dailyStats).sort(
        (a, b) => b[1] - a[1],
      )[0];

      return {
        averageDailyStudy: avgDaily,
        bestStudyDay: bestDay ? bestDay[0] : "N/A",
        bestStudyHours: bestDay ? (bestDay[1] / 60).toFixed(1) : 0,
        taskCompletionRate: analytics.completionRate,
      };
    };
  }, [analytics.dailyStats, analytics.completionRate]);

  // Get study hours chart data
  const getChartData = useMemo(() => {
    return Object.entries(analytics.dailyStats).map(([date, minutes]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      hours: (minutes / 60).toFixed(1),
    }));
  }, [analytics.dailyStats]);

  // Get subject distribution chart data
  const getSubjectChartData = useMemo(() => {
    return Object.entries(analytics.subjectStats).map(([subject, minutes]) => ({
      name: subject,
      value: parseInt((minutes / 60).toFixed(1)),
    }));
  }, [analytics.subjectStats]);

  return {
    analytics,
    studySessions,
    tasks,
    loading,
    error,
    fetchAnalytics,
    getWeakAreas: getWeakAreas(),
    getProductivityInsights: getProductivityInsights(),
    getChartData,
    getSubjectChartData,
  };
};
