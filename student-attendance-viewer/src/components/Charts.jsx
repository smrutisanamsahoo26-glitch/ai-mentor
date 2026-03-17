import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ChartsSection = ({
  pieData,
  distributionData,
  topStudentsData,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-slide-in">
    {/* Pie Chart - Present vs Absent */}
    <div className="card p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        📊 Attendance Status Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart - Attendance Distribution by Range */}
    <div className="card p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        📈 Attendance Range Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distributionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const TopStudentsChart = ({ topStudentsData }) => (
  <div className="card p-6 mb-6 animate-slide-in">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
      🏆 Top 5 Students by Attendance
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topStudentsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
