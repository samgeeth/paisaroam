import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GitCompare,
  IndianRupee,
  Clock,
  Calendar,
  Home,
  Utensils,
  Train,
  Ticket,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const TripComparePage: React.FC = () => {
  const { destinations, setCurrentPage, setSelectedDestinationId } = useApp();

  const [dest1Id, setDest1Id] = useState(destinations[0]?.id || 'jaipur');
  const [dest2Id, setDest2Id] = useState(destinations[1]?.id || 'rishikesh');
  const [dest3Id, setDest3Id] = useState(destinations[2]?.id || 'hampi');
  const [showThird, setShowThird] = useState(false);

  const d1 = destinations.find((d) => d.id === dest1Id) || destinations[0];
  const d2 = destinations.find((d) => d.id === dest2Id) || destinations[1];
  const d3 = destinations.find((d) => d.id === dest3Id) || destinations[2];

  const comparedList = showThird ? [d1, d2, d3] : [d1, d2];

  const handlePlanDestination = (id: string) => {
    setSelectedDestinationId(id);
    setCurrentPage('destination-detail');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#174C3C]/10 text-[#174C3C] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <GitCompare className="w-3.5 h-3.5 text-[#F28C45]" />
          <span>Side-by-Side Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          Trip Comparison
        </h1>
        <p className="text-sm text-gray-600">
          Compare estimated rupee budgets, ideal trip duration, lodging rates, and top highlights across India's favorite destinations.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Destination 1
            </label>
            <select
              value={dest1Id}
              onChange={(e) => setDest1Id(e.target.value)}
              className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#174C3C] focus:outline-none"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) - ₹{d.budgetPerPerson}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Destination 2
            </label>
            <select
              value={dest2Id}
              onChange={(e) => setDest2Id(e.target.value)}
              className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#174C3C] focus:outline-none"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) - ₹{d.budgetPerPerson}
                </option>
              ))}
            </select>
          </div>

          {showThird && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Destination 3
              </label>
              <select
                value={dest3Id}
                onChange={(e) => setDest3Id(e.target.value)}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#174C3C] focus:outline-none"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state}) - ₹{d.budgetPerPerson}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowThird(!showThird)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-xl shrink-0 transition-colors"
        >
          {showThird ? 'Remove 3rd' : '+ Add 3rd Destination'}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${comparedList.length} gap-6`}>
        {comparedList.map((dest, idx) => (
          <div
            key={dest.id || idx}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 flex flex-col justify-between"
          >
            {/* Header Photo */}
            <div>
              <div className="relative h-44 sm:h-48 w-full bg-gray-100">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#174C3C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {dest.state}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-black drop-shadow-sm">{dest.name}</h3>
                </div>
              </div>

              {/* Specs List */}
              <div className="p-5 space-y-4 text-xs sm:text-sm">
                {/* Cost Highlight */}
                <div className="p-3 bg-[#FFF8ED] rounded-2xl border border-[#4F8063]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Total Budget</span>
                    <div className="text-xl font-black text-[#F28C45]">
                      ₹{dest.budgetPerPerson.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Daily Burn</span>
                    <div className="text-sm font-extrabold text-[#174C3C]">
                      ~₹{Math.round(dest.budgetPerPerson / dest.idealDays)}/day
                    </div>
                  </div>
                </div>

                {/* Duration & Season */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#4F8063]" />
                      <span>Duration:</span>
                    </span>
                    <strong className="text-[#202B27]">{dest.idealDays} Days</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4F8063]" />
                      <span>Best Season:</span>
                    </span>
                    <strong className="text-[#202B27] text-right truncate max-w-[150px]">
                      {dest.bestSeason}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Home className="w-3.5 h-3.5 text-[#4F8063]" />
                      <span>Stay / Night:</span>
                    </span>
                    <strong className="text-[#202B27]">₹{dest.stayEstimate}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Utensils className="w-3.5 h-3.5 text-[#4F8063]" />
                      <span>Daily Food:</span>
                    </span>
                    <strong className="text-[#202B27]">₹{dest.foodEstimate}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Train className="w-3.5 h-3.5 text-[#4F8063]" />
                      <span>Transit Return:</span>
                    </span>
                    <strong className="text-[#202B27]">₹{dest.transportEstimate}</strong>
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
                    Top Landmarks & Vibe
                  </span>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#4F8063] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handlePlanDestination(dest.id)}
                className="w-full bg-[#174C3C] hover:bg-[#0F3328] text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>View Full {dest.name} Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F28C45]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
