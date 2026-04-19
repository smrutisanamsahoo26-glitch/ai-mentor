import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all exams for current user
  const fetchExams = async () => {
    if (!user) {
      setExams([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "exams"),
        where("userId", "==", user.uid),
        orderBy("date", "asc"),
      );
      const snapshot = await getDocs(q);
      const examsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExams(examsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching exams:", err.message);
      setError(err.message);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch exams when user is available
  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  // Add new exam
  const addExam = async (examData) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "exams"), {
        userId: user.uid,
        ...examData,
        createdAt: new Date().toISOString(),
        status: "upcoming",
      });
      await fetchExams();
      return docRef.id;
    } catch (err) {
      console.error("Error adding exam:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Update exam
  const updateExam = async (examId, examData) => {
    try {
      await updateDoc(doc(db, "exams", examId), {
        ...examData,
        updatedAt: new Date().toISOString(),
      });
      await fetchExams();
    } catch (err) {
      console.error("Error updating exam:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Delete exam
  const deleteExam = async (examId) => {
    try {
      await deleteDoc(doc(db, "exams", examId));
      await fetchExams();
    } catch (err) {
      console.error("Error deleting exam:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get next upcoming exam
  const getNextExam = () => {
    if (exams.length === 0) return null;
    return exams[0]; // Already sorted by date ascending
  };

  // Get exam by ID
  const getExamById = (examId) => {
    return exams.find((exam) => exam.id === examId);
  };

  return {
    exams,
    loading,
    error,
    fetchExams,
    addExam,
    updateExam,
    deleteExam,
    getNextExam,
    getExamById,
  };
};
