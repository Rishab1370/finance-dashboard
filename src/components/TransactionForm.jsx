import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import clsx from 'clsx';

const CATEGORIES = [
    'Salary', 'Freelance', 'Investment', 'Food', 'Travel', 'Rent', 'Utilities', 'Shopping', 'Savings', 'Other'
];

const TransactionForm = ({ transactionToEdit, onClose }) => {
    const { dispatch } = useContext(FinanceContext);

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'Food',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (transactionToEdit) {
            setFormData(transactionToEdit);
        }
    }, [transactionToEdit]);

    const validate = () => {
        const newErrors = {};
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount greater than 0.';
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category.';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (transactionToEdit) {
            dispatch({
                type: 'EDIT_TRANSACTION',
                payload: { ...formData, amount: parseFloat(formData.amount) }
            });
            if (onClose) onClose();
        } else {
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: {
                    ...formData,
                    id: uuidv4(),
                    amount: parseFloat(formData.amount),
                    createdAt: new Date().toISOString()
                }
            });
            // Reset form if not closing
            setFormData({
                type: 'expense',
                amount: '',
                category: 'Food',
                date: format(new Date(), 'yyyy-MM-dd'),
                note: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'expense'
                        ? 'bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100'
                        }`}
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                >
                    Expense
                </button>
                <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'income'
                        ? 'bg-white dark:bg-slate-600 text-green-600 dark:text-green-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100'
                        }`}
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                >
                    Income
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400">₹</span>
                    </div>
                    <input
                        id="amountInput"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className={clsx(
                            "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
                            errors.amount ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-slate-300 dark:border-slate-600"
                        )}
                        placeholder="0.00"
                    />
                </div>
                {errors.amount && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.amount}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={clsx(
                            "mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
                            errors.category ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-slate-300 dark:border-slate-600"
                        )}
                    >
                        <option value="" disabled>Select category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={clsx(
                            "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
                            errors.date ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-slate-300 dark:border-slate-600"
                        )}
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Note (Optional)</label>
                <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="What was this for?"
                />
            </div>

            <div className="flex justify-end pt-2">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-3 bg-white dark:bg-slate-800 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {transactionToEdit ? 'Save Changes' : 'Add Transaction'}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
