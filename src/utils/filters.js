import { isSameDay, isSameWeek, isSameMonth, isSameYear, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const filterTransactionsByPeriod = (transactions, periodFilter, dateRange) => {
    if (periodFilter === 'All' || !periodFilter) return transactions;

    const today = new Date();

    return transactions.filter(t => {
        const txDate = parseISO(t.date);

        switch (periodFilter) {
            case 'Daily':
                return isSameDay(txDate, today);
            case 'Weekly':
                // Using 0=Sunday. Adjust if needed.
                return isSameWeek(txDate, today, { weekStartsOn: 0 });
            case 'Monthly':
                return isSameMonth(txDate, today);
            case 'Yearly':
                return isSameYear(txDate, today);
            case 'Custom':
                if (!dateRange || !dateRange.start || !dateRange.end) return true;
                return isWithinInterval(txDate, {
                    start: startOfDay(parseISO(dateRange.start)),
                    end: endOfDay(parseISO(dateRange.end))
                });
            default:
                return true;
        }
    });
};
