import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useExams } from "../hooks/useExams";
import { useStudySessions } from "../hooks/useStudySessions";
import { useTasks } from "../hooks/useTasks";
import { useAnalytics } from "../hooks/useAnalytics";
import { useMoodEntries } from "../hooks/useMoodEntries";
import { useExpense } from "../hooks/useExpense";
import { useBudgetGoals } from "../hooks/useBudgetGoals";
import { useStudyHours } from "../hooks/useStudyHours";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus, FiTrash2 } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

import ExamList from "../components/Exams/ExamList";
import MoodTracker from "../components/MoodTracker/MoodTracker";
import StudyTimer from "../components/StudyTimer/StudyTimer";
import AnalyticsDashboard from "../components/Analytics/AnalyticsDashboard";
import WeakAreaDetector from "../components/WeakAreaDetector/WeakAreaDetector";
import ExpenseTracker from "../components/Expenses/ExpenseTracker";
import StudyHourManager from "../components/StudyHourManager/StudyHourManager";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMood, setSelectedMood] = useState(null);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [newGoal, setNewGoal] = useState("");
  const [quickTasks, setQuickTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTime, setNewTaskTime] = useState(30);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize all hooks
  const { exams, fetchExams, addExam, updateExam, deleteExam } = useExams();
  const { sessions, fetchSessions } = useStudySessions();
  const { tasks, fetchTasks } = useTasks();
  const {
    analytics,
    fetchAnalytics,
    getChartData,
    getSubjectChartData,
    getWeakAreas,
    getProductivityInsights,
  } = useAnalytics();
  const {
    moodEntries,
    fetchMoodEntries,
    addMoodEntry,
    detectBurnoutPatterns,
    getLatestMood,
  } = useMoodEntries();
  const { expenses, fetchExpenses } = useExpense();
  const { budgetGoals, fetchBudgetGoals } = useBudgetGoals();
  const { studyHours, fetchStudyHours, getTodayStudyHours } = useStudyHours();

  // Fetch all data on mount and when user changes
  useEffect(() => {
    if (user) {
      Promise.allSettled([
        fetchExams().catch((err) =>
          console.error("Failed to fetch exams:", err.message),
        ),
        fetchSessions().catch((err) =>
          console.error("Failed to fetch sessions:", err.message),
        ),
        fetchTasks().catch((err) =>
          console.error("Failed to fetch tasks:", err.message),
        ),
        fetchAnalytics().catch((err) =>
          console.error("Failed to fetch analytics:", err.message),
        ),
        fetchMoodEntries().catch((err) =>
          console.error("Failed to fetch mood entries:", err.message),
        ),
        fetchExpenses().catch((err) =>
          console.error("Failed to fetch expenses:", err.message),
        ),
        fetchBudgetGoals().catch((err) =>
          console.error("Failed to fetch budget goals:", err.message),
        ),
        fetchStudyHours().catch((err) =>
          console.error("Failed to fetch study hours:", err.message),
        ),
      ]);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    try {
      await addMoodEntry(mood);
    } catch (error) {
      console.error("Error adding mood entry:", error);
    }
  };

  const subjects = Array.from(
    new Set([
      ...exams.map((e) => e.subject),
      ...sessions.map((s) => s.subject),
      ...tasks.map((t) => t.subject).filter(Boolean),
    ]),
  );

  const burnoutAlert = detectBurnoutPatterns();
  const latestMood = getLatestMood();

  // Weekly Goals Handlers
  const handleSetWeeklyGoal = () => {
    if (newGoal.trim() && parseFloat(newGoal) > 0) {
      setWeeklyGoal(parseFloat(newGoal));
      setNewGoal("");
    }
  };

  // Quick Tasks Handlers
  const handleAddQuickTask = () => {
    if (newTaskName.trim() && newTaskTime > 0) {
      const task = {
        id: Date.now(),
        name: newTaskName,
        duration: newTaskTime,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      };
      setQuickTasks([...quickTasks, task]);
      setNewTaskName("");
      setNewTaskTime(30);

      // Trigger dashboard update
      if (user) {
        setTimeout(() => {
          fetchAnalytics();
        }, 100);
      }
    }
  };

  const handleCompleteQuickTask = (taskId) => {
    const updatedTasks = quickTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setQuickTasks(updatedTasks);

    // Trigger analytics update by refetching
    // This ensures the dashboard reacts to task completion
    if (user) {
      setTimeout(() => {
        fetchAnalytics();
      }, 100);
    }
  };

  const handleDeleteQuickTask = (taskId) => {
    setQuickTasks(quickTasks.filter((task) => task.id !== taskId));
  };

  // Calculate weekly goal progress including completed quick tasks
  const completedQuickTasksHours = quickTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.duration / 60, 0); // Convert minutes to hours

  const totalWeeklyHours =
    (analytics.weeklyStudyHours || 0) + completedQuickTasksHours;

  const weeklyGoalProgress =
    weeklyGoal > 0
      ? Math.min(100, Math.round((totalWeeklyHours / weeklyGoal) * 100))
      : 0;

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${isDarkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-blue-600 to-purple-600"} text-white shadow-lg sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🎓 AI Student Mentor</h1>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-blue-100"}`}
            >
              Smart learning assistant for engineering students
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-blue-500"}`}
            >
              {user?.email}
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${
                isDarkMode
                  ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  : "bg-gray-700 hover:bg-gray-800 text-yellow-300"
              }`}
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              <FiLogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Burnout Alert */}
        {burnoutAlert.burnoutRisk === "HIGH" && (
          <div className="bg-red-500 text-white px-6 py-3 text-center font-semibold">
            ⚠️ {burnoutAlert.message} | 💡 {burnoutAlert.suggestion}
          </div>
        )}
        {burnoutAlert.burnoutRisk === "MODERATE" && (
          <div className="bg-yellow-500 text-white px-6 py-3 text-center font-semibold">
            ⚡ {burnoutAlert.message} | 💡 {burnoutAlert.suggestion}
          </div>
        )}
      </header>

      {/* Tabs Navigation */}
      <nav
        className={`shadow-md sticky top-24 z-40 transition-colors ${
          isDarkMode ? "bg-gray-800 border-gray-700 border-b" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-8">
            {[
              { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
              { id: "exams", label: "📅 Exams", icon: "📅" },
              { id: "goals", label: "🎯 Weekly Goals", icon: "🎯" },
              { id: "study-hours", label: "📚 Study Hours", icon: "📚" },
              { id: "mood", label: "🧠 Mood Check", icon: "🧠" },
              { id: "analytics", label: "📈 Analytics", icon: "📈" },
              { id: "expenses", label: "💰 Expenses", icon: "💰" },
              { id: "weak-areas", label: "⚠️ Weak Areas", icon: "⚠️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors border-b-4 ${
                  activeTab === tab.id
                    ? `${
                        isDarkMode
                          ? "text-blue-400 border-blue-400"
                          : "border-blue-600 text-blue-600"
                      }`
                    : `${
                        isDarkMode
                          ? "border-transparent text-gray-300 hover:text-blue-400"
                          : "border-transparent text-gray-600 hover:text-blue-600"
                      }`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 shadow-lg">
              <h2 className="text-4xl font-bold mb-2">
                Welcome back, {user?.email?.split("@")[0]}! 👋
              </h2>
              <p className="text-lg opacity-90 mb-4">
                Ready to excel in your studies? Let's make today productive!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-sm opacity-80">Total Study Hours</p>
                  <p className="text-3xl font-bold">
                    {analytics.totalStudyHours}h
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-sm opacity-80">Weekly Target</p>
                  <p className="text-3xl font-bold">
                    {analytics.weeklyStudyHours}h
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-sm opacity-80">Tasks Done</p>
                  <p className="text-3xl font-bold">
                    {analytics.completedTasks}
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="text-sm opacity-80">Completion</p>
                  <p className="text-3xl font-bold">
                    {analytics.completionRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Next Exam */}
              {exams.length > 0 && (
                <div
                  className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6 border-l-4 border-red-500`}
                >
                  <h3
                    className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    📅 Next Exam
                  </h3>
                  <p className="text-2xl font-bold text-red-400 mb-2">
                    {exams[0].subject}
                  </p>
                  <p
                    className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {Math.ceil(
                      (new Date(exams[0].date) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days left
                  </p>
                  <button
                    onClick={() => setActiveTab("exams")}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    View All Exams
                  </button>
                </div>
              )}

              {/* Mood Status */}
              <div
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6 border-l-4 border-purple-500`}
              >
                <h3
                  className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  🧠 Current Mood
                </h3>
                {latestMood ? (
                  <>
                    <p className="text-4xl mb-3">{latestMood.mood}</p>
                    <p
                      className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {new Date(
                        latestMood.timestamp.seconds * 1000,
                      ).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p
                    className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Not tracked yet
                  </p>
                )}
                <button
                  onClick={() => setActiveTab("mood")}
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                >
                  Check in
                </button>
              </div>

              {/* Study Streak */}
              <div
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6 border-l-4 border-green-500`}
              >
                <h3
                  className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  🔥 Study Streak
                </h3>
                <p className="text-3xl font-bold text-green-400 mb-3">
                  {sessions.filter((s) => {
                    const date = new Date(
                      s.startTime.seconds * 1000,
                    ).toDateString();
                    return date === new Date().toDateString();
                  }).length > 0
                    ? "🔥"
                    : "Start today!"}
                </p>
                <button
                  onClick={() => setActiveTab("goals")}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Set Goal
                </button>
              </div>

              {/* Weekly Goal Preview */}
              {weeklyGoal > 0 && (
                <div
                  className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6 border-l-4 border-purple-500`}
                >
                  <h3
                    className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    🎯 Weekly Goal
                  </h3>
                  <p className="text-2xl font-bold text-purple-400 mb-3">
                    {weeklyGoalProgress}%
                  </p>
                  <div
                    className={`w-full rounded-full h-3 mb-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all"
                      style={{ width: `${weeklyGoalProgress}%` }}
                    />
                  </div>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {analytics.weeklyStudyHours}h / {weeklyGoal}h
                  </p>
                  <button
                    onClick={() => setActiveTab("goals")}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition mt-3"
                  >
                    Manage Goals
                  </button>
                </div>
              )}

              {/* Quick Tasks Summary */}
              <div
                className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6 border-l-4 border-blue-500`}
              >
                <h3
                  className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  ✅ Quick Tasks
                </h3>
                <p className="text-2xl font-bold text-blue-400 mb-3">
                  {quickTasks.filter((t) => !t.completed).length} pending
                </p>
                <p
                  className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {quickTasks.filter((t) => t.completed).length} of{" "}
                  {quickTasks.length} completed
                </p>
                <button
                  onClick={() => setActiveTab("goals")}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  View Tasks
                </button>
              </div>
            </div>

            {/* Upcoming Exams List */}
            {exams.length > 0 && (
              <div
                className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  📋 Your Exams
                </h3>
                <div className="space-y-3">
                  {exams.slice(0, 3).map((exam) => (
                    <div
                      key={exam.id}
                      className={`flex justify-between items-center p-4 rounded-lg border-l-4 border-blue-500 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {exam.subject}
                        </p>
                        <p
                          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {new Date(exam.date).toLocaleDateString()} at{" "}
                          {exam.time}
                        </p>
                      </div>
                      <span className="text-2xl">
                        {
                          {
                            high: "🔴",
                            moderate: "🟡",
                            low: "🟢",
                          }[exam.priority]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === "exams" && (
          <ExamList
            exams={exams}
            onAddExam={addExam}
            onDeleteExam={deleteExam}
            onUpdateExam={updateExam}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Weekly Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            {/* Set Weekly Goal */}
            <div
              className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                🎯 Set Your Weekly Study Goal
              </h3>
              <div className="flex gap-3 mb-6">
                <input
                  type="number"
                  min="1"
                  max="168"
                  step="0.5"
                  placeholder="Study hours per week"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
                <button
                  onClick={handleSetWeeklyGoal}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition font-semibold"
                >
                  Set Goal
                </button>
              </div>

              {weeklyGoal > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Progress: {analytics.weeklyStudyHours}h / {weeklyGoal}h
                    </span>
                    <span className="text-purple-400 font-bold">
                      {weeklyGoalProgress}%
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all"
                      style={{ width: `${weeklyGoalProgress}%` }}
                    />
                  </div>
                  {weeklyGoalProgress >= 100 && (
                    <p className="text-green-400 font-semibold mt-3">
                      🎉 Congratulations! You've reached your weekly goal!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Tasks */}
            <div
              className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-lg shadow-lg p-6`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                ✅ Quick Study Tasks
              </h3>
              <div
                className={`mb-6 p-4 rounded-lg space-y-3 ${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <input
                  type="text"
                  placeholder="Task name (e.g., 'Solve 10 DSA problems')"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddQuickTask()}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    placeholder="Duration (minutes)"
                    value={newTaskTime}
                    onChange={(e) =>
                      setNewTaskTime(parseInt(e.target.value) || 30)
                    }
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  <button
                    onClick={handleAddQuickTask}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center gap-2"
                  >
                    <FiPlus size={20} />
                    Add Task
                  </button>
                </div>
              </div>

              {quickTasks.length > 0 ? (
                <div className="space-y-2">
                  {quickTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-l-4 transition ${
                        task.completed
                          ? isDarkMode
                            ? "bg-gray-700 border-gray-500"
                            : "bg-gray-100 border-gray-400"
                          : isDarkMode
                            ? "bg-gray-700 border-blue-400"
                            : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              task.completed
                                ? isDarkMode
                                  ? "line-through text-gray-400"
                                  : "line-through text-gray-500"
                                : isDarkMode
                                  ? "text-gray-100"
                                  : "text-gray-800"
                            }`}
                          >
                            {task.name}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            ⏱️ {task.duration} minutes • {task.createdAt}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCompleteQuickTask(task.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              task.completed
                                ? "bg-gray-400 text-white hover:bg-gray-500"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {task.completed ? "Undo" : "Done"}
                          </button>
                          <button
                            onClick={() => handleDeleteQuickTask(task.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-600 mt-4">
                    Total tasks: {quickTasks.length} | Completed:{" "}
                    {quickTasks.filter((t) => t.completed).length}
                  </p>
                </div>
              ) : (
                <p
                  className={`text-center py-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No quick tasks yet. Add one to get started! 📝
                </p>
              )}
              {quickTasks.length > 0 && (
                <p
                  className={`text-sm mt-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total tasks: {quickTasks.length} | Completed:{" "}
                  {quickTasks.filter((t) => t.completed).length}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Mood Check Tab */}
        {activeTab === "mood" && (
          <MoodTracker
            onMoodSelect={handleMoodSelect}
            studyHours={analytics.totalStudyHours}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <AnalyticsDashboard
            chartData={getChartData}
            subjectChartData={getSubjectChartData}
            analytics={analytics}
            insights={getProductivityInsights}
            weakAreas={getWeakAreas}
            quickTasks={quickTasks}
            weeklyGoal={weeklyGoal}
            weeklyGoalProgress={weeklyGoalProgress}
          />
        )}

        {/* Study Hours Tab */}
        {activeTab === "study-hours" && (
          <StudyHourManager />
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <ExpenseTracker />
        )}

        {/* Weak Areas Tab */}
        {activeTab === "weak-areas" && (
          <WeakAreaDetector
            subjects={subjects}
            taskStats={Object.fromEntries(
              subjects.map((s) => [
                s,
                tasks.filter((t) => t.subject === s && t.status === "completed")
                  .length,
              ]),
            )}
            weeklyGoal={weeklyGoal}
            weeklyStudyHours={analytics.weeklyStudyHours}
            dailyStats={analytics.dailyStats}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
        <p>🎓 AI Student Mentor v1.0 | Made with ❤️ for engineering students</p>
        <p className="text-sm mt-2">
          © 2026 Scaler College| All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
