import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function AddExam({ onAddExam }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    time: "",
    priority: "moderate",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.date || !formData.time) {
      alert("Please fill all fields");
      return;
    }

    try {
      await onAddExam(formData);
      setFormData({
        subject: "",
        date: "",
        time: "",
        priority: "moderate",
      });
      setShowForm(false);
    } catch (error) {
      alert("Error adding exam: " + error.message);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
      >
        <FiPlus size={20} />
        Add Exam
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-800">Schedule New Exam</h3>

      <input
        type="text"
        name="subject"
        placeholder="Subject (e.g., Data Structures)"
        value={formData.subject}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low Priority 🟢</option>
        <option value="moderate">Moderate Priority 🟡</option>
        <option value="high">High Priority 🔴</option>
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Schedule Exam
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
