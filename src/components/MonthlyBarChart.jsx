import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { filterTransactionsByPeriod } from '../utils/filters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const MonthlyBarChart = () => {
    const { state } = useContext(FinanceContext);
    const { transactions, periodFilter, dateRange } = state;

    const data = useMemo(() => {
        const filteredTransactions = filterTransactionsByPeriod(transactions, periodFilter, dateRange);
        const totals = {};

        filteredTransactions.forEach(t => {
            // Determine grouping key based on periodFilter
            let groupKey;
            const dateObj = parseISO(t.date);

            if (periodFilter === 'Daily' || periodFilter === 'Weekly' || periodFilter === 'Custom') {
                // Group by actual day
                groupKey = format(dateObj, 'MMM dd');
            } else if (periodFilter === 'Yearly') {
                // Group by month
                groupKey = format(dateObj, 'MMM yyyy');
            } else {
                // Default: Group by month for Monthly or All
                groupKey = format(dateObj, 'MMM yyyy');
            }

            if (!totals[groupKey]) {
                totals[groupKey] = { label: groupKey, income: 0, expense: 0, originalDate: dateObj };
            }

            if (t.type === 'income') {
                totals[groupKey].income += t.amount;
            } else {
                totals[groupKey].expense += t.amount;
            }
        });

        return Object.values(totals).sort((a, b) => {
            return a.originalDate - b.originalDate;
        });
    }, [transactions, periodFilter, dateRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <p className="text-slate-900 dark:text-slate-100 font-medium mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                            {entry.name}: ₹{entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-2">📈</div>
                <p>No data yet. Add your first transaction!</p>
            </div>
        );
    }

    return (
        <div className="h-64 sm:h-80 w-full text-slate-600 dark:text-slate-300">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="label" stroke="currentColor" fontSize={12} />
                    <YAxis stroke="currentColor" fontSize={12} />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyBarChart;
