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

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks for current user
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      console.log("✅ Tasks fetched successfully:", tasksData.length, "tasks found");
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err.message);
      console.error("Error code:", err.code);
      console.error("Full error:", err);
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch tasks when user is available
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Add new task (optionally linked to exam)
  const addTask = async (taskData) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        ...taskData,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      await fetchTasks();
      return docRef.id;
    } catch (err) {
      console.error("Error adding task:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Update task status
  const updateTask = async (taskId, updates) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      await fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Mark task as complete
  const completeTask = async (taskId) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status: "completed",
        completedAt: new Date().toISOString(),
      });
      await fetchTasks();
    } catch (err) {
      console.error("Error completing task:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      await fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  // Get tasks by subject
  const getTasksBySubject = (subject) => {
    return tasks.filter((task) => task.subject === subject);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    getTasksByStatus,
    getTasksBySubject,
  };
};
