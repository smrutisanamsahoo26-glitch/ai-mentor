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
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useBudgetGoals = () => {
  const { user } = useAuth();
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all budget goals for current user
  const fetchBudgetGoals = async () => {
    if (!user) {
      setBudgetGoals([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "budgetGoals"),
        where("userId", "==", user.uid),
      );
      const snapshot = await getDocs(q);
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBudgetGoals(goalsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching budget goals:", err.message);
      setError(err.message);
      setBudgetGoals([]);
    } finally {
      setLoading(false);
    }
  };

  // Add budget goal
  const addBudgetGoal = async (monthlyBudget, savingsGoal, notes = "") => {
    if (!user) throw new Error("User not authenticated");
    try {
      const now = new Date();
      await addDoc(collection(db, "budgetGoals"), {
        userId: user.uid,
        month: now.getMonth(),
        year: now.getFullYear(),
        monthlyBudget,
        savingsGoal,
        notes,
        createdAt: Timestamp.now(),
      });
      await fetchBudgetGoals();
      return true;
    } catch (err) {
      console.error("Error adding budget goal:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Update budget goal
  const updateBudgetGoal = async (goalId, updates) => {
    try {
      await updateDoc(doc(db, "budgetGoals", goalId), updates);
      await fetchBudgetGoals();
      return true;
    } catch (err) {
      console.error("Error updating budget goal:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Delete budget goal
  const deleteBudgetGoal = async (goalId) => {
    try {
      await deleteDoc(doc(db, "budgetGoals", goalId));
      await fetchBudgetGoals();
      return true;
    } catch (err) {
      console.error("Error deleting budget goal:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get current month's budget goal
  const getCurrentMonthBudgetGoal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return budgetGoals.find(
      (goal) => goal.month === currentMonth && goal.year === currentYear,
    );
  };

  // Get budget goal by month and year
  const getBudgetGoalByMonth = (month, year) => {
    return budgetGoals.find((goal) => goal.month === month && goal.year === year);
  };

  // Auto-fetch when user changes
  useEffect(() => {
    if (user) {
      fetchBudgetGoals();
    }
  }, [user]);

  return {
    budgetGoals,
    loading,
    error,
    fetchBudgetGoals,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    getCurrentMonthBudgetGoal,
    getBudgetGoalByMonth,
  };
};
