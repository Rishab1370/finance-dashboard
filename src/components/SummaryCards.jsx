import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { formatCurrency } from '../utils/helpers';
import { filterTransactionsByPeriod } from '../utils/filters';
import { ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank } from 'lucide-react';
import clsx from 'clsx';

const SummaryCards = () => {
    const { state } = useContext(FinanceContext);
    const { transactions, periodFilter, dateRange } = state;

    const { income, expense, balance, savings } = useMemo(() => {
        const filteredTransactions = filterTransactionsByPeriod(transactions, periodFilter, dateRange);

        let inc = 0;
        let exp = 0;

        filteredTransactions.forEach((t) => {
            const amount = parseFloat(t.amount) || 0;
            if (t.type === 'income') {
                inc += amount;
            } else if (t.type === 'expense') {
                exp += amount;
            }
        });

        const bal = inc - exp;
        const sav = Math.max(0, bal);

        return { income: inc, expense: exp, balance: bal, savings: sav };
    }, [transactions]);

    const cards = [
        {
            title: 'Total Balance',
            amount: balance,
            trend: '+8% from last month',
            trendUp: true,
            icon: DollarSign,
            color: balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-500',
            bgColor: balance >= 0 ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-red-100 dark:bg-red-900/50',
        },
        {
            title: 'Total Income',
            amount: income,
            trend: '+12% from last month',
            trendUp: true,
            icon: ArrowUpRight,
            color: 'text-green-600 dark:text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/50',
        },
        {
            title: 'Total Expense',
            amount: expense,
            trend: '-2% from last month',
            trendUp: true,
            icon: ArrowDownRight,
            color: 'text-red-600 dark:text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/50',
        },
        {
            title: 'Savings',
            amount: savings,
            trend: savings > 0 ? '+5% from last month' : 'No savings this month',
            trendUp: savings > 0,
            trendNeutral: savings === 0,
            icon: PiggyBank,
            color: 'text-sky-600 dark:text-sky-500',
            bgColor: 'bg-sky-100 dark:bg-sky-900/50',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {card.title}
                            </p>
                            <h3 className={clsx("text-2xl font-bold mt-2 text-slate-900 dark:text-slate-100", { "text-red-600 dark:text-red-500": card.title === 'Total Balance' && card.amount < 0 })}>
                                {formatCurrency(card.amount)}
                            </h3>
                        </div>
                        <div className={clsx("p-3 rounded-full flex-shrink-0", card.bgColor)}>
                            <card.icon className={clsx("w-6 h-6", card.color)} />
                        </div>
                    </div>
                    {card.trend && (
                        <div className="mt-4 flex items-center text-sm">
                            <span className={clsx("font-medium",
                                card.trendNeutral ? "text-slate-500 dark:text-slate-400" :
                                    card.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {card.trend}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
