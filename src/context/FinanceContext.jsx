import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    budgets: JSON.parse(localStorage.getItem('budgets')) || {},
    darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
    filters: {
        query: '',
        category: 'All',
    },
    periodFilter: JSON.parse(localStorage.getItem('periodFilter')) || 'All',
    dateRange: JSON.parse(localStorage.getItem('dateRange')) || { start: '', end: '' },
};

export const FinanceContext = createContext(initialState);

const financeReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TRANSACTION':
            return { ...state, transactions: [...state.transactions, action.payload] };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter((t) => t.id !== action.payload),
            };
        case 'EDIT_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map((t) =>
                    t.id === action.payload.id ? action.payload : t
                ),
            };
        case 'SET_BUDGET':
            return {
                ...state,
                budgets: { ...state.budgets, [action.payload.category]: action.payload.amount },
            };
        case 'TOGGLE_DARK_MODE':
            return { ...state, darkMode: !state.darkMode };
        case 'SET_FILTER':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            };
        case 'SET_PERIOD_FILTER':
            return { ...state, periodFilter: action.payload };
        case 'SET_DATE_RANGE':
            return { ...state, dateRange: { ...state.dateRange, ...action.payload } };
        default:
            return state;
    }
};

export const FinanceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(financeReducer, initialState);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }, [state.transactions]);

    useEffect(() => {
        localStorage.setItem('budgets', JSON.stringify(state.budgets));
    }, [state.budgets]);

    useEffect(() => {
        localStorage.setItem('periodFilter', JSON.stringify(state.periodFilter));
    }, [state.periodFilter]);

    useEffect(() => {
        localStorage.setItem('dateRange', JSON.stringify(state.dateRange));
    }, [state.dateRange]);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
        if (state.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.darkMode]);

    return (
        <FinanceContext.Provider value={{ state, dispatch }}>
            {children}
        </FinanceContext.Provider>
    );
};
