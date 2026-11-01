import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Destination } from '../types';
import { DestinationDetailModal } from '../components/DestinationDetailModal';
import {
  Search,
  Filter,
  X,
  Clock,
  Calendar,
  IndianRupee,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { destinations, selectedDestinationId, setSelectedDestinationId, setCurrentPage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [budgetBracket, setBudgetBracket] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTraveller, setSelectedTraveller] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active modal destination
  const activeModalDest = useMemo(() => {
    if (!selectedDestinationId) return null;
    return destinations.find((d) => d.id === selectedDestinationId) || null;
  }, [selectedDestinationId, destinations]);

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Published check
      if (dest.isPublished === false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesState = dest.state.toLowerCase().includes(q);
        const matchesDesc = dest.description.toLowerCase().includes(q);
        if (!matchesName && !matchesState && !matchesDesc) return false;
      }

      // Region
      if (selectedRegion !== 'All' && dest.region !== selectedRegion) {
        return false;
      }

      // Budget Bracket
      if (budgetBracket === 'under3k' && dest.budgetPerPerson > 3000) return false;
      if (budgetBracket === '3k-5k' && (dest.budgetPerPerson < 3000 || dest.budgetPerPerson > 5000)) return false;
      if (budgetBracket === 'above5k' && dest.budgetPerPerson < 5000) return false;

      // Duration
      if (selectedDuration === 'weekend' && dest.idealDays > 2) return false;
      if (selectedDuration === 'extended' && (dest.idealDays < 3 || dest.idealDays > 4)) return false;
      if (selectedDuration === 'week' && dest.idealDays < 5) return false;

      // Category
      if (selectedCategory !== 'All' && !dest.categories.includes(selectedCategory as any)) {
        return false;
      }

      // Traveller Type
      if (selectedTraveller !== 'All' && !dest.travellerTypes.includes(selectedTraveller as any)) {
        return false;
      }

      return true;
    });
  }, [
    destinations,
    searchQuery,
    selectedRegion,
    budgetBracket,
    selectedDuration,
    selectedCategory,
    selectedTraveller,
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedRegion !== 'All' ||
    budgetBracket !== 'All' ||
    selectedDuration !== 'All' ||
    selectedCategory !== 'All' ||
    selectedTraveller !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setBudgetBracket('All');
    setSelectedDuration('All');
    setSelectedCategory('All');
    setSelectedTraveller('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Discover India On A Budget</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
            Explore Affordable Destinations
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search verified budget benchmarks across hill stations, beaches, historic ruins, and sacred rivers.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('planner')}
          className="inline-flex items-center space-x-2 bg-[#F28C45] hover:bg-[#d97531] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Trip Planner</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, state or attraction (e.g., Jaipur, Goa, fort, beach, waterfall)..."
            className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-[#202B27] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Region */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            >
              <option value="All">All Regions</option>
              <option value="North">North India</option>
              <option value="South">South India</option>
              <option value="West">West India</option>
              <option value="East">East India</option>
              <option value="Central">Central India</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Budget</label>
            <select
              value={budgetBracket}
              onChange={(e) => setBudgetBracket(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            >
              <option value="All">All Budgets</option>
              <option value="under3k">Under ₹3,000</option>
              <option value="3k-5k">₹3,000 – ₹5,000</option>
              <option value="above5k">₹5,000+</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            >
              <option value="All">Any Duration</option>
              <option value="weekend">1-2 Days (Weekend)</option>
              <option value="extended">3-4 Days</option>
              <option value="week">5+ Days</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            >
              <option value="All">All Vibe Types</option>
              <option value="Historical">Historical</option>
              <option value="Beach">Beach</option>
              <option value="Hill Station">Hill Station</option>
              <option value="Adventure">Adventure</option>
              <option value="Nature">Nature</option>
              <option value="Spiritual">Spiritual</option>
            </select>
          </div>

          {/* Traveller Type */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Traveller Type</label>
            <select
              value={selectedTraveller}
              onChange={(e) => setSelectedTraveller(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            >
              <option value="All">All Travellers</option>
              <option value="Friends">Friends Gang</option>
              <option value="Solo">Solo Backpacker</option>
              <option value="Couples">Couples</option>
              <option value="Family">Family</option>
            </select>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
          <span>
            Showing <strong className="text-[#174C3C]">{filteredDestinations.length}</strong> of{' '}
            {destinations.length} destinations
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#F28C45] hover:underline font-bold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center space-y-3 border border-gray-200">
          <p className="text-gray-500 text-sm">No destinations match your exact filter combination.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#174C3C] text-white rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelectedDestinationId(dest.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all cursor-pointer group flex flex-col transform hover:-translate-y-1"
            >
              {/* Photo Box */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#174C3C]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {dest.state}
                </div>
                <div className="absolute top-3 right-3 bg-[#F28C45] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  ₹{dest.budgetPerPerson.toLocaleString('en-IN')}/head
                </div>
                <div className="absolute bottom-2 left-3 flex flex-wrap gap-1">
                  {dest.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-[#202B27] group-hover:text-[#174C3C] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#4F8063]" />
                    <span>{dest.idealDays} Days</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4F8063]" />
                    <span className="truncate">{dest.bestSeason}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[#4F8063] font-semibold">
                    ~₹{Math.round(dest.budgetPerPerson / dest.idealDays)}/day
                  </span>
                  <span className="text-[#F28C45] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Explore Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Detail Modal */}
      {activeModalDest && (
        <DestinationDetailModal
          destination={activeModalDest}
          onClose={() => setSelectedDestinationId(null)}
        />
      )}
    </div>
  );
};
