/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { BudgetCalculatorPage } from './pages/BudgetCalculatorPage';
import { ExpenseSplitterPage } from './pages/ExpenseSplitterPage';
import { TripComparePage } from './pages/TripComparePage';
import { TravelGuidesPage } from './pages/TravelGuidesPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#202B27]">
      <Navbar />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {(currentPage === 'explore' || currentPage === 'destination-detail') && <ExplorePage />}
        {currentPage === 'planner' && <TripPlannerPage />}
        {currentPage === 'calculator' && <BudgetCalculatorPage />}
        {currentPage === 'splitter' && <ExpenseSplitterPage />}
        {currentPage === 'compare' && <TripComparePage />}
        {(currentPage === 'guides' || currentPage === 'guide-detail') && <TravelGuidesPage />}
        {(currentPage === 'about' || currentPage === 'contact') && <AboutContactPage />}
        {currentPage === 'admin' && <AdminDashboardPage />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
