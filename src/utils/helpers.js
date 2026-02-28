import { format, parseISO } from 'date-fns';

/**
 * Format a number as a USD currency string.
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string (e.g., 'MMM dd, yyyy')
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

/**
 * Export transactions to a CSV file.
 * @param {Array} transactions - Array of transaction objects
 */
export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Type', 'Category', 'Amount', 'Date', 'Note', 'Created At', 'Transaction ID'];
  const csvRows = [headers.join(',')];

  transactions.forEach((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1);
    const row = [
      `"${type}"`,
      `"${t.category}"`,
      t.amount,
      `"${formatDate(t.date)}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      `"${formatDate(t.createdAt)}"`,
      `"${t.id}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
