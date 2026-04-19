import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FiTrendingUp, FiCheckCircle, FiAward } from "react-icons/fi";

export default function AnalyticsDashboard({
  chartData,
  subjectChartData,
  analytics,
  insights,
  weakAreas,
  quickTasks = [],
  weeklyGoal = 0,
  weeklyGoalProgress = 0,
}) {
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div className="space-y-8 bg-gray-50 p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800">
        📊 Analytics Dashboard
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Study Hours</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.totalStudyHours}h
              </p>
            </div>
            <FiTrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Weekly Study Hours</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.weeklyStudyHours}h
              </p>
            </div>
            <FiAward className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tasks Completed</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.completedTasks}/{analytics.totalTasks}
              </p>
            </div>
            <FiCheckCircle className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-pink-600">
                {analytics.completionRate}%
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            💡 Productivity Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Average Daily Study
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {insights.averageDailyStudy} hours
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Best Study Day
              </p>
              <p className="text-lg font-bold text-gray-800">
                {insights.bestStudyDay} ({insights.bestStudyHours}h)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            📈 Study Hours (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            🎯 Subject-wise Focus
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectChartData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}h`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(subjectChartData || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak Areas */}
      {weeklyGoal > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            🎯 Weekly Goal Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Target</p>
              <p className="text-2xl font-bold text-purple-600">
                {weeklyGoal}h
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Completed
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.weeklyStudyHours}h
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Progress
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {weeklyGoalProgress}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-purple-500 h-4 rounded-full transition-all"
              style={{ width: `${weeklyGoalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Tasks Summary */}
      {quickTasks.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            ✅ Quick Task Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-600">
                {quickTasks.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {quickTasks.filter((t) => t.completed).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-orange-600">
                {quickTasks.reduce((sum, t) => sum + t.duration, 0)} min
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {quickTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  task.completed ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.name}
                </span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {task.duration}m
                </span>
              </div>
            ))}
            {quickTasks.length > 3 && (
              <p className="text-sm text-gray-600 mt-2">
                +{quickTasks.length - 3} more tasks
              </p>
            )}
          </div>
        </div>
      )}

      {/* Weak Areas */}
      {weakAreas && weakAreas.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            ⚠️ Areas Needing Improvement
          </h3>
          <div className="space-y-4">
            {weakAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-l-4 border-orange-400"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {area.subject}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {area.recommendation}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded">
                    {area.studyTime}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
        <h3 className="font-bold text-lg text-gray-800 mb-4">
          🎯 Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-green-600 mb-2">✅ Keep it up!</p>
            <p className="text-sm">
              You're maintaining a consistent study schedule. Stay disciplined!
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-blue-600 mb-2">⚡ Focus Areas</p>
            <p className="text-sm">
              Allocate more time to weaker subjects for balanced improvement.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-purple-600 mb-2">💡 Balance</p>
            <p className="text-sm">
              Balance study with breaks and activities to avoid burnout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
