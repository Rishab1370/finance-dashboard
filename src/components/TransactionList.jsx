import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { filterTransactionsByPeriod } from '../utils/filters';
import { Search, Filter, Trash2, Edit2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import clsx from 'clsx';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
    const { state, dispatch } = useContext(FinanceContext);
    const { transactions, filters, periodFilter, dateRange } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const filteredTransactions = useMemo(() => {
        const periodFiltered = filterTransactionsByPeriod(transactions, periodFilter, dateRange);

        return periodFiltered.filter(t => {
            const matchesQuery = t.note.toLowerCase().includes(filters.query.toLowerCase()) ||
                t.category.toLowerCase().includes(filters.query.toLowerCase());
            const matchesCategory = filters.category === 'All' || t.category === filters.category;
            return matchesQuery && matchesCategory;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first
    }, [transactions, filters, periodFilter, dateRange]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const currentTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        }
    };

    const handleSearch = (e) => {
        dispatch({ type: 'SET_FILTER', payload: { query: e.target.value } });
        setCurrentPage(1);
    };

    const handleCategoryFilter = (e) => {
        dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } });
        setCurrentPage(1);
    };

    // Get unique categories for filter dropdown
    const categories = ['All', ...new Set(transactions.map(t => t.category))];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Toolbox: Search & Filter */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.query}
                        onChange={handleSearch}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="relative sm:max-w-xs w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                        value={filters.category}
                        onChange={handleCategoryFilter}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800/80">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {currentTransactions.length > 0 ? (
                            currentTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {t.type === 'income' ? (
                                                    <ArrowUpCircle className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <ArrowDownCircle className="h-6 w-6 text-red-500" />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {t.note || `${t.category} ${t.type === 'income' ? 'Credit' : 'Expense'}`}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">{t.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                                        {formatDate(t.date)}
                                    </td>
                                    <td className={clsx("px-6 py-4 whitespace-nowrap text-sm font-medium text-right", {
                                        "text-green-600 dark:text-green-400": t.type === 'income',
                                        "text-red-600 dark:text-red-400": t.type === 'expense'
                                    })}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setEditingTransaction(t)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                    No transactions found. Feel free to add one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
                <div className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">Rows per page:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 py-1 pl-2 pr-6 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal popup logic can be inline here or handled via separate component mount */}
            {editingTransaction && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-500 dark:bg-slate-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" aria-hidden="true" onClick={() => setEditingTransaction(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg relative z-50">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-100" id="modal-title">
                                    Edit Transaction
                                </h3>
                                <div className="mt-4">
                                    <TransactionForm
                                        transactionToEdit={editingTransaction}
                                        onClose={() => setEditingTransaction(null)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
