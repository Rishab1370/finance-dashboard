import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import clsx from 'clsx';

const PERIODS = ['All', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

const PeriodFilter = () => {
    const { state, dispatch } = useContext(FinanceContext);
    const { periodFilter } = state;

    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-center">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-full md:w-auto overflow-x-auto min-w-0">
                {PERIODS.map(period => (
                    <button
                        key={period}
                        type="button"
                        onClick={() => dispatch({ type: 'SET_PERIOD_FILTER', payload: period })}
                        className={clsx(
                            "flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                            periodFilter === period
                                ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100"
                        )}
                    >
                        {period}
                    </button>
                ))}
            </div>

            {periodFilter === 'Custom' && (
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <input
                        type="date"
                        value={state.dateRange?.start || ''}
                        onChange={(e) => dispatch({ type: 'SET_DATE_RANGE', payload: { start: e.target.value } })}
                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="text-slate-500 dark:text-slate-400">to</span>
                    <input
                        type="date"
                        value={state.dateRange?.end || ''}
                        onChange={(e) => dispatch({ type: 'SET_DATE_RANGE', payload: { end: e.target.value } })}
                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default PeriodFilter;
