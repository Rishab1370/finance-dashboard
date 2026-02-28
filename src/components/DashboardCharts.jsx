import React from 'react';
import ExpensePieChart from './ExpensePieChart';
import MonthlyBarChart from './MonthlyBarChart';
import PeriodFilter from './PeriodFilter';

const DashboardCharts = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h2>
                <PeriodFilter />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-slate-100">Expenses by Category</h3>
                    <ExpensePieChart />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-slate-100">Income vs Expense</h3>
                    <MonthlyBarChart />
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
