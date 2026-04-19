import { useState } from "react";
import ExamCountdown from "./ExamCountdown";
import AddExam from "./AddExam";

export default function ExamList({
  exams,
  onAddExam,
  onDeleteExam,
  onUpdateExam,
  isDarkMode = false,
}) {
  const [editingExam, setEditingExam] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: "",
    date: "",
    time: "",
    priority: "moderate",
  });

  const handleEdit = (exam) => {
    setEditingExam(exam.id);
    setEditFormData({
      subject: exam.subject,
      date: exam.date,
      time: exam.time,
      priority: exam.priority,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await onUpdateExam(editingExam, editFormData);
      setEditingExam(null);
    } catch (error) {
      alert("Error updating exam: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
  };

  const nextExam = exams.length > 0 ? exams[0] : null;

  return (
    <div className="space-y-8">
      {/* Add Exam Button */}
      <div>
        <AddExam onAddExam={onAddExam} />
      </div>

      {/* Next Exam Highlight */}
      {nextExam && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Next Upcoming Exam</h2>
            <span className="text-5xl">🎯</span>
          </div>
          <p className="text-xl mb-2">{nextExam.subject}</p>
          <p className="text-lg opacity-90">
            {new Date(nextExam.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {nextExam.time}
          </p>
          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <p className="text-sm opacity-90">
              {Math.ceil(
                (new Date(nextExam.date) - new Date()) / (1000 * 60 * 60 * 24),
              )}{" "}
              days left to prepare!
            </p>
          </div>
        </div>
      )}

      {/* All Exams */}
      <div>
        <h3
          className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
        >
          All Exams
        </h3>

        {exams.length === 0 ? (
          <div
            className={`border-l-4 border-blue-500 p-6 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <p className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
              📚 No exams scheduled yet. Add one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) =>
              editingExam === exam.id ? (
                <div
                  key={exam.id}
                  className={`p-6 rounded-lg shadow-md border-2 border-blue-500 space-y-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    Edit Exam
                  </h3>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={editFormData.subject}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <select
                    name="priority"
                    value={editFormData.priority}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="low">Low Priority</option>
                    <option value="moderate">Moderate Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <ExamCountdown
                  key={exam.id}
                  exam={exam}
                  onDelete={onDeleteExam}
                  onEdit={handleEdit}
                  isDarkMode={isDarkMode}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
