import { useState } from "react";
import { FiLoader, FiPlus } from "react-icons/fi";
import { useStudyHours } from "../../hooks/useStudyHours";

export default function WeakAreaDetector({
  subjects = [],
  taskStats = {},
  weeklyGoal = 0,
  weeklyStudyHours = 0,
  dailyStats = {},
}) {
  const { addStudyHours } = useStudyHours();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [subjectForHours, setSubjectForHours] = useState("General");

  // Ensure weeklyStudyHours is a number with proper fallback
  const safeWeeklyHours = parseFloat(weeklyStudyHours) || 0;

  // Local analysis logic (no API needed)
  const generateWeeklyAnalysis = () => {
    if (weeklyGoal === 0) {
      return "Please set a weekly study goal to see recommendations.";
    }

    const hoursRemaining = Math.max(0, weeklyGoal - safeWeeklyHours);
    const daysRemaining = Object.keys(dailyStats).length || 1;
    const dailyTargetRequired =
      daysRemaining > 0 ? (hoursRemaining / daysRemaining).toFixed(1) : 0;
    const currentDaily =
      daysRemaining > 0 ? (safeWeeklyHours / daysRemaining).toFixed(1) : 0;
    const progressPercent = Math.min(
      100,
      Math.round((safeWeeklyHours / weeklyGoal) * 100),
    );

    let analysis = `📊 Weekly Study Goal Analysis\n\n`;
    analysis += `🎯 Goal: ${weeklyGoal}h | Current: ${safeWeeklyHours.toFixed(1)}h\n`;
    analysis += `Progress: ${progressPercent}%\n\n`;

    if (hoursRemaining <= 0) {
      analysis += `✅ GOAL ACHIEVED! 🎉\n\n`;
      analysis += `You've completed your weekly goal!\n`;
      analysis += `🏆 Recommendations:\n`;
      analysis += `• Maintain this excellent pace\n`;
      analysis += `• Consider challenging yourself with harder topics\n`;
      analysis += `• Start planning next week's goal\n`;
      analysis += `• Help peers with their studies\n`;
    } else {
      analysis += `⏳ TIME REMAINING: ${hoursRemaining.toFixed(1)}h\n\n`;
      analysis += `📅 Days Left (this week): ${daysRemaining}\n`;
      analysis += `📈 Daily Target Required: ${dailyTargetRequired}h/day\n`;
      analysis += `📊 Current Average Daily: ${currentDaily}h/day\n\n`;
      analysis += `🎯 Recommendations:\n`;

      if (parseFloat(dailyTargetRequired) > parseFloat(currentDaily)) {
        const diff = (dailyTargetRequired - currentDaily).toFixed(1);
        analysis += `• You need to study ${diff}h more per day to reach your goal\n`;
        analysis += `• Schedule focused study sessions today\n`;
        analysis += `• Break tasks into smaller chunks\n`;
        analysis += `• Use the Study Timer to track your sessions\n`;
      } else {
        analysis += `• You're on track! Keep maintaining your study pace\n`;
        analysis += `• Focus on quality over quantity\n`;
        analysis += `• Review weak concepts regularly\n`;
      }

      analysis += `• Remaining hours: ${hoursRemaining}h\n`;
    }

    return analysis;
  };

  const handleAddHours = async (e) => {
    e.preventDefault();
    if (!hoursToAdd || parseFloat(hoursToAdd) <= 0) {
      alert("Please enter valid hours");
      return;
    }

    try {
      await addStudyHours(parseFloat(hoursToAdd), subjectForHours);
      setHoursToAdd("");
      setSubjectForHours("General");
      setShowAddHours(false);
      alert("✅ Study hours added successfully! Weekly progress will update.");
      // Refresh analysis
      const result = generateWeeklyAnalysis();
      setAnalysis(result);
    } catch (error) {
      alert("Error adding study hours: " + error.message);
    }
  };

  const handleAnalyze = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const result = generateWeeklyAnalysis();
      setAnalysis(result);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        🎯 Weak Area Detector
      </h2>
      <p className="text-gray-600 mb-6">
        Check your weekly study progress and see how many hours you still need to study
      </p>

      {/* Add Study Hours Button */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddHours(!showAddHours)}
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg"
        >
          <FiPlus size={20} /> Add Study Hours
        </button>
        
        <button
          onClick={handleAnalyze}
          disabled={loading || weeklyGoal === 0}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
        >
          {loading ? (
            <>
              <FiLoader className="inline animate-spin mr-2" size={16} />
              Analyzing...
            </>
          ) : weeklyGoal === 0 ? (
            "⚠️ Set Goal First"
          ) : (
            "📊 Analyze Progress"
          )}
        </button>
      </div>

      {/* Add Study Hours Form */}
      {showAddHours && (
        <form
          onSubmit={handleAddHours}
          className="bg-white rounded-lg p-6 mb-6 border-2 border-green-500"
        >
          <h3 className="font-bold text-lg text-gray-800 mb-4">➕ Add Study Hours Quickly</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 1.5"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Subject</label>
              <select
                value={subjectForHours}
                onChange={(e) => setSubjectForHours(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option>General</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
                <option>Geography</option>
                <option>Computer Science</option>
                <option>Economics</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                ✅ Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddHours(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Weekly Goal Analysis Button - ORIGINAL SECTION */}
      {/* Removed - button moved to top section */}

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            📋 Weekly Goal Progress
          </h3>

          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>

          {/* Action Items */}
          <div className="mt-6 pt-6 border-t border-gray-300 space-y-3">
            <p className="font-semibold text-gray-800">Next Steps:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                📝 Create Study Plan
              </button>
              <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                ⏱️ Start Focus Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {!analysis && !loading && (
        <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600 font-semibold mb-2">
            Check your weekly study goal progress
          </p>
          <p className="text-gray-500 text-sm">
            Click the button above to see how many more hours you need to study to reach your {weeklyGoal}h weekly goal. Get personalized daily targets and recommendations!
          </p>
        </div>
      )}

      {/* Weekly Progress Summary Card */}
      {weeklyGoal > 0 && !analysis && (
        <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-4">
            📊 Your Weekly Goal Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Weekly Goal</p>
              <p className="text-2xl font-bold text-blue-600">{weeklyGoal}h</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Studied This Week</p>
              <p className="text-2xl font-bold text-green-600">
                {weeklyStudyHours}h
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(0, weeklyGoal - weeklyStudyHours).toFixed(1)}h
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.min(
                  100,
                  Math.round((weeklyStudyHours / weeklyGoal) * 100),
                )}
                %
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((weeklyStudyHours / weeklyGoal) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg">
        <p className="font-semibold text-orange-900 mb-2">
          💡 How Area Analysis Works:
        </p>
        <ul className="text-orange-800 text-sm space-y-1">
          <li>✓ Analyzes your task completion rates</li>
          <li>✓ Identifies subjects needing more practice</li>
          <li>✓ Provides targeted study recommendations</li>
          <li>✓ Suggests optimal time allocation</li>
          <li>✓ Tracks your improvement progress</li>
        </ul>
      </div>
    </div>
  );
}
