import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Moon, Sun, Wallet } from 'lucide-react';

const Navbar = () => {
    const { state, dispatch } = useContext(FinanceContext);

    return (
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            FinanceDash
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {state.darkMode ? (
                                <Sun className="w-5 h-5 text-amber-500" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
