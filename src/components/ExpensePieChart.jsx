import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { filterTransactionsByPeriod } from '../utils/filters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#64748B'];

const ExpensePieChart = () => {
    const { state } = useContext(FinanceContext);
    const { transactions, periodFilter, dateRange } = state;

    const data = useMemo(() => {
        const filteredTransactions = filterTransactionsByPeriod(transactions, periodFilter, dateRange);
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const categoryTotals = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        return Object.keys(categoryTotals).map(key => ({
            name: key,
            value: categoryTotals[key],
            percent: totalExpense > 0 ? (categoryTotals[key] / totalExpense) * 100 : 0
        })).sort((a, b) => b.value - a.value);
    }, [transactions, periodFilter, dateRange]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">{data.name}</p>
                    <p className="text-sm font-medium" style={{ color: payload[0].color || '#fff' }}>
                        ₹{data.value.toFixed(2)} ({data.percent.toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-2">📊</div>
                <p>No data yet. Add your first transaction!</p>
            </div>
        );
    }

    return (
        <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpensePieChart;
