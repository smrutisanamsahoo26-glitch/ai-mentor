import { useState } from "react";
import { useExpense } from "../../hooks/useExpense";
import { useBudgetGoals } from "../../hooks/useBudgetGoals";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense, getTotalMonthlySpending, getTotalMonthlySavings } = useExpense();
  const { budgetGoals, addBudgetGoal, updateBudgetGoal, getCurrentMonthBudgetGoal } = useBudgetGoals();
  
  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    category: "food",
    amount: "",
    description: "",
    type: "spending",
  });

  const [budgetForm, setBudgetForm] = useState({
    monthlyBudget: "",
    savingsGoal: "",
    notes: "",
  });

  const [editingBudget, setEditingBudget] = useState(null);

  const currentBudget = getCurrentMonthBudgetGoal();
  const totalSpending = getTotalMonthlySpending();
  const totalSavings = getTotalMonthlySavings();

  const expenseCategories = ["food", "books", "tuition", "entertainment", "transport", "other"];
  const expensesByType = {
    spending: expenses.filter((e) => e.type === "spending"),
    saving: expenses.filter((e) => e.type === "saving"),
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.category) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await addExpense(
        expenseForm.category,
        parseFloat(expenseForm.amount),
        expenseForm.description,
        expenseForm.type,
      );
      setExpenseForm({ category: "food", amount: "", description: "", type: "spending" });
      setShowAddExpense(false);
    } catch (error) {
      alert("Error adding expense: " + error.message);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.monthlyBudget || !budgetForm.savingsGoal) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingBudget) {
        await updateBudgetGoal(editingBudget.id, {
          monthlyBudget: parseFloat(budgetForm.monthlyBudget),
          savingsGoal: parseFloat(budgetForm.savingsGoal),
          notes: budgetForm.notes,
        });
      } else {
        await addBudgetGoal(
          parseFloat(budgetForm.monthlyBudget),
          parseFloat(budgetForm.savingsGoal),
          budgetForm.notes,
        );
      }
      setBudgetForm({ monthlyBudget: "", savingsGoal: "", notes: "" });
      setEditingBudget(null);
      setShowAddBudget(false);
    } catch (error) {
      alert("Error saving budget: " + error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(expenseId);
      } catch (error) {
        alert("Error deleting expense: " + error.message);
      }
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      monthlyBudget: budget.monthlyBudget.toString(),
      savingsGoal: budget.savingsGoal.toString(),
      notes: budget.notes || "",
    });
    setShowAddBudget(true);
  };

  const budgetProgress = currentBudget
    ? Math.min((totalSpending / currentBudget.monthlyBudget) * 100, 100)
    : 0;

  const savingsProgress = currentBudget
    ? Math.min((totalSavings / currentBudget.savingsGoal) * 100, 100)
    : 0;

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Expense Tracker</h2>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("expenses")}
          className={`pb-2 font-semibold ${
            activeTab === "expenses"
              ? "border-b-2 border-blue-500 text-blue-500"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-600"
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab("budget")}
          className={`pb-2 font-semibold ${
            activeTab === "budget"
              ? "border-b-2 border-blue-500 text-blue-500"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-600"
          }`}
        >
          Budget Goals
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-2 font-semibold ${
            activeTab === "summary"
              ? "border-b-2 border-blue-500 text-blue-500"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-600"
          }`}
        >
          Summary
        </button>
      </div>

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div>
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FiPlus /> Add Expense
          </button>

          {showAddExpense && (
            <form
              onSubmit={handleAddExpense}
              className={`p-4 rounded mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={expenseForm.category}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, category: e.target.value })
                  }
                  className={`p-2 border rounded ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                >
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                  className={`p-2 border rounded ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                  required
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, description: e.target.value })
                  }
                  className={`p-2 border rounded md:col-span-2 ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                />

                <select
                  value={expenseForm.type}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, type: e.target.value })
                  }
                  className={`p-2 border rounded ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                >
                  <option value="spending">Spending</option>
                  <option value="saving">Saving</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Expenses List */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">💰 Spending</h3>
              {expensesByType.spending.length === 0 ? (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No spending recorded
                </p>
              ) : (
                expensesByType.spending.map((expense) => (
                  <div
                    key={expense.id}
                    className={`p-3 rounded flex justify-between items-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {expense.category.charAt(0).toUpperCase() +
                          expense.category.slice(1)}
                      </p>
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-red-500">
                        -₹{expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">🏦 Savings</h3>
              {expensesByType.saving.length === 0 ? (
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No savings recorded
                </p>
              ) : (
                expensesByType.saving.map((expense) => (
                  <div
                    key={expense.id}
                    className={`p-3 rounded flex justify-between items-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {expense.category.charAt(0).toUpperCase() +
                          expense.category.slice(1)}
                      </p>
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-green-500">
                        +₹{expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Goals Tab */}
      {activeTab === "budget" && (
        <div>
          <button
            onClick={() => {
              setEditingBudget(null);
              setBudgetForm({ monthlyBudget: "", savingsGoal: "", notes: "" });
              setShowAddBudget(!showAddBudget);
            }}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FiPlus /> Set Budget Goal
          </button>

          {showAddBudget && (
            <form
              onSubmit={handleAddBudget}
              className={`p-4 rounded mb-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <h3 className="font-semibold mb-4">
                {editingBudget ? "Edit Budget Goal" : "Create New Budget Goal"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Monthly Budget (₹)"
                  value={budgetForm.monthlyBudget}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, monthlyBudget: e.target.value })
                  }
                  className={`p-2 border rounded ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Savings Goal (₹)"
                  value={budgetForm.savingsGoal}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, savingsGoal: e.target.value })
                  }
                  className={`p-2 border rounded ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                  required
                />
                <textarea
                  placeholder="Notes"
                  value={budgetForm.notes}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, notes: e.target.value })
                  }
                  className={`p-2 border rounded md:col-span-2 ${isDarkMode ? "bg-gray-600 border-gray-500" : ""}`}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingBudget ? "Update Budget" : "Create Budget"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Current Budget Info */}
          {currentBudget ? (
            <div className={`p-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <h3 className="font-semibold text-lg mb-4">Current Month's Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold mb-2">Monthly Budget</p>
                  <p className="text-2xl font-bold">₹{currentBudget.monthlyBudget}</p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Spent: ₹{totalSpending.toFixed(2)} ({budgetProgress.toFixed(0)}%)
                  </p>
                  <div
                    className={`mt-2 w-full ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-300"
                    } rounded-full h-2`}
                  >
                    <div
                      className={`h-2 rounded-full ${
                        budgetProgress > 90
                          ? "bg-red-500"
                          : budgetProgress > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${budgetProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Savings Goal</p>
                  <p className="text-2xl font-bold">₹{currentBudget.savingsGoal}</p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Saved: ₹{totalSavings.toFixed(2)} ({savingsProgress.toFixed(0)}%)
                  </p>
                  <div
                    className={`mt-2 w-full ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-300"
                    } rounded-full h-2`}
                  >
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${savingsProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {currentBudget.notes && (
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <strong>Notes:</strong> {currentBudget.notes}
                </p>
              )}

              <button
                onClick={() => handleEditBudget(currentBudget)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Budget
              </button>
            </div>
          ) : (
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              No budget goal set for current month. Create one to start tracking!
            </p>
          )}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-red-50"}`}>
            <h3 className="font-semibold text-lg mb-2">💸 Total Monthly Spending</h3>
            <p className="text-3xl font-bold text-red-500">₹{totalSpending.toFixed(2)}</p>
            {currentBudget && (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Budget: ₹{currentBudget.monthlyBudget} (
                {budgetProgress > 100
                  ? `Over by ₹${(totalSpending - currentBudget.monthlyBudget).toFixed(2)}`
                  : `₹${(currentBudget.monthlyBudget - totalSpending).toFixed(2)} remaining`}
                )
              </p>
            )}
          </div>

          <div className={`p-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}>
            <h3 className="font-semibold text-lg mb-2">🏦 Total Monthly Savings</h3>
            <p className="text-3xl font-bold text-green-500">₹{totalSavings.toFixed(2)}</p>
            {currentBudget && (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Goal: ₹{currentBudget.savingsGoal} (
                {savingsProgress >= 100
                  ? `₹${(totalSavings - currentBudget.savingsGoal).toFixed(2)} extra`
                  : `₹${(currentBudget.savingsGoal - totalSavings).toFixed(2)} to go`}
                )
              </p>
            )}
          </div>

          <div className={`p-4 rounded md:col-span-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <h3 className="font-semibold text-lg mb-4">📊 Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {expenseCategories.map((cat) => {
                const categoryTotal = expenses
                  .filter((e) => e.category === cat && e.type === "spending")
                  .reduce((sum, e) => sum + e.amount, 0);
                return (
                  categoryTotal > 0 && (
                    <div key={cat} className={`p-2 rounded ${isDarkMode ? "bg-gray-600" : "bg-white"}`}>
                      <p className="font-semibold capitalize">{cat}</p>
                      <p className="text-xl font-bold">₹{categoryTotal.toFixed(2)}</p>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
