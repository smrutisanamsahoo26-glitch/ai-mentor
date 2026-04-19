import { useState, useRef, useEffect } from "react";
import { callAIMentor } from "../../services/api";
import { FiSend, FiLoader } from "react-icons/fi";

export default function AIMentor({ exams = [], mood = null }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Study Mentor. I can help you with:\n\n📚 Study planning and scheduling\n🧠 Explaining tough concepts\n📝 Exam preparation strategies\n⏰ Time management tips\n💡 Motivation & support\n\nWhat do you need help with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setError(null);
    setLoading(true);

    try {
      // Prepare messages for API (without timestamps)
      const apiMessages = messages
        .filter((m) => m.role === "assistant" || m.role === "user")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))
        .concat({ role: "user", content: inputValue });

      // Call AI Mentor
      const response = await callAIMentor(apiMessages, exams, mood);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err.message || "Failed to get response. Please check your API key.",
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">🤖 AI Study Mentor</h2>
        <p className="text-sm opacity-90">Your personal study assistant</p>
      </div>

      {/* Messages Container */}
      <div className=" flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-bl-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-tl-none">
              <FiLoader className="animate-spin inline mr-2" size={16} />
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg rounded-tl-none max-w-xs">
              <p className="text-sm font-semibold">❌ Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-300 p-4 bg-white rounded-b-lg">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about study, exams, time management..."
            rows="3"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 h-fit"
          >
            {loading ? (
              <FiLoader className="animate-spin" size={20} />
            ) : (
              <>
                <FiSend size={20} />
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
