import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function MoodTracker({
  onMoodSelect,
  studyHours = 0,
  isDarkMode = false,
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const moods = [
    { emoji: "😃", label: "Happy", value: "happy" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😔", label: "Sad", value: "sad" },
    { emoji: "😫", label: "Stressed", value: "stressed" },
    { emoji: "😴", label: "Tired", value: "tired" },
  ];

  // Local support messages (no API needed)
  const supportMessages = {
    happy:
      "🎉 That's amazing! Keep that positive energy going! Your enthusiasm will help you achieve great things. Stay focused and maintain this momentum!",
    neutral:
      "😊 You seem calm and balanced. This is a good state for productive studying. Channel this focus into making progress on your tasks!",
    sad: "🤗 It's okay to feel down sometimes. Remember that studying can help improve your mood and give you a sense of accomplishment. Start with something small and build from there.",
    stressed:
      "🧘 Take a deep breath! Stress is normal when you're working hard. Try these tips:\n• Take a 5-minute break\n• Drink some water\n• Go for a quick walk\n• Break your work into smaller chunks",
    tired:
      "💤 Your body is telling you it needs rest! Here's what to do:\n• Take a 15-20 minute power nap\n• Stretch and move around\n• Have a healthy snack\n• Then come back refreshed!",
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    setLoading(true);
    setShowSupport(true);

    // Simulate loading and get local support message
    setTimeout(() => {
      setSupport(supportMessages[mood]);
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className={`rounded-lg shadow-lg p-8 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-purple-50 to-pink-50"
      }`}
    >
      {/* Mood Selection */}
      {!showSupport ? (
        <div>
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            How are you feeling? 🎭
          </h2>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Select your current mood to get personalized support and tips
          </p>

          <div className="grid grid-cols-5 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`p-6 rounded-lg transition-all transform hover:scale-110 ${
                  selectedMood === mood.value
                    ? isDarkMode
                      ? "bg-gray-700 shadow-lg scale-110"
                      : "bg-white shadow-lg scale-110"
                    : isDarkMode
                      ? "bg-gray-700/70 hover:bg-gray-700"
                      : "bg-white/70 hover:bg-white"
                }`}
              >
                <div className="text-5xl mb-2">{mood.emoji}</div>
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  {mood.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Mood Display */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowSupport(false);
                setSupport(null);
              }}
              className="text-3xl hover:scale-125 transition-transform"
            >
              {moods.find((m) => m.value === selectedMood)?.emoji}
            </button>
            <div>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                You're feeling
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                {moods.find((m) => m.value === selectedMood)?.label}
              </p>
            </div>
            <button
              onClick={() => {
                setShowSupport(false);
                setSupport(null);
              }}
              className="ml-auto text-blue-400 hover:text-blue-300 font-semibold underline"
            >
              Change mood
            </button>
          </div>

          {/* Support Section */}
          {loading ? (
            <div
              className={`p-6 rounded-lg flex items-center justify-center gap-3 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <FiLoader className="animate-spin text-blue-400" size={24} />
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Getting personalized support...
              </p>
            </div>
          ) : (
            <div
              className={`p-6 rounded-lg border-l-4 border-purple-500 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                💓 Support & Tips
              </h3>
              <div
                className={`leading-relaxed whitespace-pre-wrap ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {support}
              </div>

              {/* Burnout Detection */}
              <div
                className={`mt-6 p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-600" : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  <strong>💡 Pro Tip:</strong> Take regular breaks, stay
                  hydrated, and remember that consistency beats intensity. Your
                  well-being matters more than perfect scores!
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              📝 Open Journal
            </button>
            <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
              🧘 Meditation (5 min)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
