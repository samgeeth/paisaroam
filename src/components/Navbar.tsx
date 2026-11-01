import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MapPin,
  Calendar,
  Calculator,
  Users,
  GitCompare,
  BookOpen,
  Info,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    announcements,
    homepageContent,
    isAdmin,
    user,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const activeAnnouncement = announcements.find((a) => a.isActive);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: MapPin },
    { id: 'planner', label: 'AI Planner', icon: Sparkles, badge: 'Smart' },
    { id: 'calculator', label: 'Budget Calc', icon: Calculator },
    { id: 'splitter', label: 'Split Expenses', icon: Users },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id: any) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#174C3C] text-white shadow-md">
      {/* Top Announcement Banner (Editable from Admin) */}
      {activeAnnouncement && !announcementDismissed && (
        <div className="bg-[#F28C45] px-4 py-1.5 text-xs sm:text-sm font-medium text-white flex items-center justify-between transition-all">
          <div className="flex items-center space-x-2 mx-auto text-center truncate pr-2">
            <Bell className="w-3.5 h-3.5 shrink-0 animate-bounce" />
            <span className="truncate">{activeAnnouncement.message}</span>
            {activeAnnouncement.linkText && (
              <button
                onClick={() => handleNav(activeAnnouncement.linkUrl?.replace('#', '') || 'explore')}
                className="underline font-bold hover:text-[#FFF8ED] ml-1.5 shrink-0 inline-flex items-center"
              >
                {activeAnnouncement.linkText}
                <ArrowRight className="w-3 h-3 ml-0.5 inline" />
              </button>
            )}
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 hover:bg-black/10 rounded text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F28C45] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl leading-none">₹</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                PAISA<span className="text-[#F28C45]">ROAM</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider text-[#FFF8ED]/80 uppercase font-semibold">
                Big Adventures. Small Budgets.
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/15 text-[#FFF8ED] font-bold shadow-xs'
                      : 'text-[#FFF8ED]/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#F28C45] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Area: CTA and Mobile Admin */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Plan CTA Button */}
            <button
              onClick={() => handleNav('planner')}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-[#F28C45] hover:bg-[#d97531] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan My Trip</span>
            </button>

            {/* Admin Dashboard Access */}
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center space-x-1 text-xs px-2.5 py-2 rounded-lg border transition-colors ${
                currentPage === 'admin'
                  ? 'bg-white text-[#174C3C] border-white font-bold'
                  : 'bg-black/20 text-[#FFF8ED] border-white/20 hover:bg-black/30'
              }`}
              title="Mobile Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-[#F28C45]" />
              <span className="font-semibold">{isAdmin ? 'Admin' : 'Admin'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F3328] border-t border-white/10 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="p-2 mb-2 bg-white/5 rounded-lg flex items-center justify-between">
            <span className="text-xs text-[#FFF8ED]/80">Budget Travel Companion</span>
            <span className="text-[11px] bg-[#F28C45]/20 text-[#F28C45] font-semibold px-2 py-0.5 rounded">
              v1.0 India
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-2.5 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F28C45] text-white font-bold shadow-sm'
                      : 'bg-white/5 text-[#FFF8ED] hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-white/20 text-[9px] px-1 rounded uppercase font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => handleNav('planner')}
              className="w-full py-3 bg-[#F28C45] hover:bg-[#d97531] text-white rounded-xl font-bold flex items-center justify-center space-x-2 text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Smart AI Plan</span>
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 text-xs border border-white/15"
            >
              <ShieldCheck className="w-4 h-4 text-[#F28C45]" />
              <span>Open Mobile Admin Control</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar for quick phone thumb access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#174C3C] border-t border-white/15 px-2 py-1.5 flex items-center justify-around shadow-2xl backdrop-blur-md">
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'home' ? 'text-[#F28C45] font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNav('explore')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'explore' ? 'text-[#F28C45] font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => handleNav('planner')}
          className="flex flex-col items-center -mt-4 bg-[#F28C45] text-white p-2.5 rounded-full shadow-lg border-2 border-[#174C3C] active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-extrabold mt-0.5">Plan</span>
        </button>

        <button
          onClick={() => handleNav('calculator')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'calculator' ? 'text-[#F28C45] font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          <Calculator className="w-5 h-5 mb-0.5" />
          <span>Budget</span>
        </button>

        <button
          onClick={() => handleNav('admin')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'admin' ? 'text-[#F28C45] font-bold' : 'text-white/70 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5 text-[#F28C45]" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
