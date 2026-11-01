import React from 'react';
import { Destination } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Users,
  Train,
  Home,
  Utensils,
  Ticket,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface Props {
  destination: Destination | null;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<Props> = ({ destination, onClose }) => {
  const { setCurrentPage } = useApp();

  if (!destination) return null;

  const handlePlanTrip = () => {
    onClose();
    setCurrentPage('planner');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${destination.name} Budget Trip Guide - PAISAROAM`,
          text: `Explore ${destination.name}, ${destination.state} for ₹${destination.budgetPerPerson} on PAISAROAM!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Destination link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-[#202B27]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Banner */}
        <div className="relative h-56 sm:h-72 w-full bg-gray-100">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#F28C45] mb-1">
              <MapPin className="w-4 h-4" />
              <span>{destination.state} • {destination.region} India</span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold">{destination.name}</h2>
              <div className="text-right">
                <div className="text-[10px] text-white/80 uppercase font-semibold">Estimated Budget</div>
                <div className="text-xl sm:text-2xl font-black text-[#F28C45]">
                  ₹{destination.budgetPerPerson.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Overview Strip */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#FFF8ED] rounded-xl text-center border border-[#4F8063]/20">
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Ideal Duration</div>
              <div className="text-sm sm:text-base font-bold text-[#174C3C] flex items-center justify-center space-x-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{destination.idealDays} Days</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Daily Average</div>
              <div className="text-sm sm:text-base font-bold text-[#174C3C] mt-0.5">
                ₹{Math.round(destination.budgetPerPerson / destination.idealDays)}/day
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Best Months</div>
              <div className="text-xs sm:text-sm font-bold text-[#174C3C] mt-0.5 truncate" title={destination.bestSeason}>
                {destination.bestSeason.split(',')[0]}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-[#174C3C] uppercase tracking-wider mb-2">About This Destination</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{destination.description}</p>
          </div>

          {/* Estimated Budget Allocation Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#174C3C] uppercase tracking-wider">
                Cost Breakdown (Per Person Benchmark)
              </h3>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Indicative Estimates
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-1">
                  <Train className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Transport</span>
                </div>
                <div className="text-base font-extrabold text-[#202B27]">
                  ₹{destination.transportEstimate}
                </div>
                <div className="text-[10px] text-gray-400">Return Sleeper/Bus</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-1">
                  <Home className="w-3.5 h-3.5 text-[#4F8063]" />
                  <span>Stay</span>
                </div>
                <div className="text-base font-extrabold text-[#202B27]">
                  ₹{destination.stayEstimate}
                </div>
                <div className="text-[10px] text-gray-400">Dorm/Budget Hotel</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-[#F28C45]" />
                  <span>Food</span>
                </div>
                <div className="text-base font-extrabold text-[#202B27]">
                  ₹{destination.foodEstimate}
                </div>
                <div className="text-[10px] text-gray-400">Dhabas & Chai</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-1">
                  <Ticket className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sightseeing</span>
                </div>
                <div className="text-base font-extrabold text-[#202B27]">
                  ₹{destination.activityEstimate}
                </div>
                <div className="text-[10px] text-gray-400">Entry & local auto</div>
              </div>
            </div>
          </div>

          {/* Top Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#174C3C] uppercase tracking-wider mb-2.5">
                Top Budget Experiences
              </h3>
              <ul className="space-y-2">
                {destination.highlights.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#4F8063] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categories and Traveller Types */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {destination.categories.map((c) => (
              <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                {c}
              </span>
            ))}
            {destination.travellerTypes.map((t) => (
              <span key={t} className="text-xs bg-[#4F8063]/10 text-[#174C3C] px-2.5 py-1 rounded-md font-semibold">
                Best for {t}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePlanTrip}
              className="flex-1 bg-[#F28C45] hover:bg-[#d97531] text-white font-bold py-3 px-5 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan This Trip with AI</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
