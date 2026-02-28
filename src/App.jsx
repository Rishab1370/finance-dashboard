import React from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import DashboardCharts from './components/DashboardCharts';
import BudgetTracker from './components/BudgetTracker';

function App() {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault(); // prevent typing 'n' if focused randomly
        const amountInput = document.getElementById('amountInput');
        if (amountInput) {
          amountInput.focus();
          amountInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Summary Cards Section (KPIs) */}
        <section>
          <SummaryCards />
        </section>

        {/* Removing duplicate Dashboard Charts section that was here */}

        {/* Form and Budget Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 border rounded-xl p-6 shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">Add Transaction</h2>
            <TransactionForm />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <DashboardCharts />
            <BudgetTracker />
          </div>
        </div>

        {/* Transaction History */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">Recent Transactions</h2>
          <TransactionList />
        </section>

      </main>
    </div>
  );
}

export default App;
