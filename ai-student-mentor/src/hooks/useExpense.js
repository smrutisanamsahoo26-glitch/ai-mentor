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
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export const useExpense = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all expenses for current user
  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );
      const snapshot = await getDocs(q);
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err.message);
      setError(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Add expense
  const addExpense = async (category, amount, description, type = "spending") => {
    if (!user) throw new Error("User not authenticated");
    try {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        category, // e.g., "food", "books", "tuition", "entertainment"
        amount,
        description,
        type, // "spending" or "saving"
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
      await fetchExpenses();
      return true;
    } catch (err) {
      console.error("Error adding expense:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Update expense
  const updateExpense = async (expenseId, updates) => {
    try {
      await updateDoc(doc(db, "expenses", expenseId), {
        ...updates,
      });
      await fetchExpenses();
      return true;
    } catch (err) {
      console.error("Error updating expense:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
      await fetchExpenses();
      return true;
    } catch (err) {
      console.error("Error deleting expense:", err.message);
      setError(err.message);
      throw err;
    }
  };

  // Get expenses by category
  const getExpensesByCategory = (category) => {
    return expenses.filter((e) => e.category === category);
  };

  // Get monthly expenses
  const getMonthlyExpenses = (month, year) => {
    return expenses.filter((e) => {
      const expenseDate = new Date(e.date.seconds * 1000);
      return (
        expenseDate.getMonth() === month && expenseDate.getFullYear() === year
      );
    });
  };

  // Get total spending this month
  const getTotalMonthlySpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date.seconds * 1000);
        return (
          e.type === "spending" &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Get total savings this month
  const getTotalMonthlySavings = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter((e) => {
        const expenseDate = new Date(e.date.seconds * 1000);
        return (
          e.type === "saving" &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Get expenses by type
  const getExpensesByType = (type) => {
    return expenses.filter((e) => e.type === type);
  };

  // Auto-fetch when user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory,
    getMonthlyExpenses,
    getTotalMonthlySpending,
    getTotalMonthlySavings,
    getExpensesByType,
  };
};
