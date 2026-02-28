import React, { useContext, useMemo, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { formatCurrency, exportToCSV } from '../utils/helpers';
import { Download } from 'lucide-react';
import clsx from 'clsx';

const BudgetTracker = () => {
    const { state, dispatch } = useContext(FinanceContext);
    const { transactions, budgets } = state;

    const [inputBudgetCategory, setInputBudgetCategory] = useState('');
    const [inputBudgetAmount, setInputBudgetAmount] = useState('');

    const currentMonthExpenses = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const expenses = transactions.filter(t =>
            t.type === 'expense' &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        );

        return expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
    }, [transactions]);

    const handleSetBudget = (e) => {
        e.preventDefault();
        if (inputBudgetCategory && inputBudgetAmount && !isNaN(inputBudgetAmount) && Number(inputBudgetAmount) > 0) {
            dispatch({
                type: 'SET_BUDGET',
                payload: { category: inputBudgetCategory, amount: parseFloat(inputBudgetAmount) }
            });
            setInputBudgetCategory('');
            setInputBudgetAmount('');
        }
    };

    const categories = ['Food', 'Travel', 'Rent', 'Utilities', 'Shopping', 'Other']; // Configurable options

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Budget Tracker</h3>
                <button
                    onClick={() => exportToCSV(transactions)}
                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            <form onSubmit={handleSetBudget} className="flex gap-2 mb-6">
                <select
                    value={inputBudgetCategory}
                    onChange={(e) => setInputBudgetCategory(e.target.value)}
                    className="flex-1 rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400">₹</span>
                    </div>
                    <input
                        type="number"
                        placeholder="Budget limit"
                        value={inputBudgetAmount}
                        onChange={(e) => setInputBudgetAmount(e.target.value)}
                        className="w-full pl-7 rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Set
                </button>
            </form>

            <div className="space-y-4">
                {Object.keys(budgets).length > 0 ? (
                    Object.keys(budgets).map(category => {
                        const limit = budgets[category];
                        const spent = currentMonthExpenses[category] || 0;
                        const percentage = Math.min((spent / limit) * 100, 100);
                        const isOverBudget = spent > limit;
                        const overflowAmount = isOverBudget ? spent - limit : 0;

                        return (
                            <div key={category}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        <span className={isOverBudget ? 'text-red-500 font-semibold' : ''}>{formatCurrency(spent)}</span> / {formatCurrency(limit)}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={clsx("h-2.5 rounded-full transition-all duration-500",
                                            isOverBudget ? "bg-red-500" : (percentage > 80 ? "bg-amber-500" : "bg-indigo-500")
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                {isOverBudget && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        Over budget by {formatCurrency(overflowAmount)}
                                    </p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">No budgets set. Set a budget above to start tracking.</p>
                )}
            </div>
        </div>
    );
};

export default BudgetTracker;
