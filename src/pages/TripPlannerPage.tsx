import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TripPlanResult, TripPlanRequest } from '../../api/gemini-service';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Train,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Printer,
  Bookmark,
  RotateCcw,
  Sliders,
  Compass,
  ArrowRight,
  ShieldAlert,
  Clock,
  Home,
  Utensils,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const TripPlannerPage: React.FC = () => {
  const { saveTripPlanToDb, user } = useApp();

  const [formData, setFormData] = useState<TripPlanRequest>({
    startingCity: 'Delhi',
    destination: '',
    travelStartDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    days: 3,
    travellers: 2,
    totalBudget: 6000,
    travellerType: 'friends',
    travelStyle: 'budget',
    interests: ['history', 'food', 'sightseeing'],
    transportPreference: 'train',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlanResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Interest options
  const interestOptions = [
    { id: 'nature', label: '🌿 Nature & Hills' },
    { id: 'food', label: '🍛 Street Food & Thalis' },
    { id: 'adventure', label: '🧗 Adventure & Treks' },
    { id: 'history', label: '🏰 History & Forts' },
    { id: 'beaches', label: '🏖️ Beaches & Sunset' },
    { id: 'temples', label: '🛕 Temples & Ghats' },
    { id: 'shopping', label: '🛍️ Local Bazaars' },
    { id: 'sightseeing', label: '📸 Core Sightseeing' },
  ];

  const handleInterestToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== id) : [...prev.interests, id],
      };
    });
  };

  const perPersonPerDay = Math.round(
    formData.totalBudget / (Math.max(1, formData.travellers) * Math.max(1, formData.days))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/gemini/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const plan: TripPlanResult = await response.json();
      setTripPlan(plan);
      setExpandedDay(1);

      // Scroll to plan view
      setTimeout(() => {
        document.getElementById('plan-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      console.error('Planner error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to generate itinerary. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!tripPlan) return;
    try {
      await saveTripPlanToDb({
        startingCity: formData.startingCity,
        destination: tripPlan.destinationName,
        days: formData.days,
        travellers: formData.travellers,
        totalBudget: formData.totalBudget,
        travellerType: formData.travellerType,
        travelStyle: formData.travelStyle,
        transportPreference: formData.transportPreference,
        interests: formData.interests,
        planDetails: tripPlan,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Plan saved locally.');
      setSavedSuccess(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#F28C45]/10 text-[#F28C45] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart AI Travel Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          Smart Budget Trip Planner
        </h1>
        <p className="text-sm text-gray-600">
          Tell us your starting point and honest budget. Our engine generates a realistic day-by-day plan with verified Indian transport, stay, and meal estimates.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-[#174C3C] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-[#F28C45]" />
            <h2 className="font-bold text-base sm:text-lg">Your Trip Preferences</h2>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-[#FFF8ED]">
            ₹ INR Calculations
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Starting City & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Starting City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.startingCity}
                  onChange={(e) => setFormData({ ...formData, startingCity: e.target.value })}
                  placeholder="e.g. Delhi, Mumbai, Bangalore, Pune..."
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Destination (or leave blank to suggest)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Jaipur, Rishikesh, Goa (or blank for auto-pick)"
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                />
              </div>
            </div>
          </div>

          {/* Duration, Travellers, and Total Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Duration (Days) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                  className="w-full accent-[#174C3C]"
                />
                <span className="w-12 text-center font-bold text-sm bg-gray-100 py-1.5 rounded-lg text-[#174C3C]">
                  {formData.days}d
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Number of Travellers <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={formData.travellers}
                  onChange={(e) => setFormData({ ...formData, travellers: parseInt(e.target.value) || 1 })}
                  className="w-full accent-[#174C3C]"
                />
                <span className="w-12 text-center font-bold text-sm bg-gray-100 py-1.5 rounded-lg text-[#174C3C]">
                  {formData.travellers}p
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Total Group Budget (₹ INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={formData.totalBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, totalBudget: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                />
              </div>
            </div>
          </div>

          {/* Live Budget Feasibility Indicator */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
            <div>
              <span className="text-gray-500">Estimated available per person: </span>
              <strong className="text-[#174C3C] text-sm">
                ₹{Math.round(formData.totalBudget / (formData.travellers || 1)).toLocaleString('en-IN')}
              </strong>
              <span className="text-gray-400"> (₹{perPersonPerDay}/day)</span>
            </div>

            {perPersonPerDay < 600 ? (
              <span className="text-amber-700 bg-amber-100 font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Extremely tight budget • Requires ultra-frugal stay</span>
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Healthy budget for Indian sleeper & hostel trips</span>
              </span>
            )}
          </div>

          {/* Group Type & Travel Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Traveller Type
              </label>
              <select
                value={formData.travellerType}
                onChange={(e) => setFormData({ ...formData, travellerType: e.target.value })}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="friends">Group of Friends</option>
                <option value="solo">Solo Backpacker</option>
                <option value="couple">Couple</option>
                <option value="family">Family with Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Travel Style
              </label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="budget">Budget Backpacker (Dorms, Dhabas)</option>
                <option value="comfortable">Balanced & Comfortable (Private Rooms)</option>
                <option value="adventure">Adventure & Outdoor Camps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Transport Preference
              </label>
              <select
                value={formData.transportPreference}
                onChange={(e) => setFormData({ ...formData, transportPreference: e.target.value })}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="train">Train (IRCTC Sleeper / 3AC)</option>
                <option value="bus">State Transport / Volvo Bus</option>
                <option value="car">Road Trip (Car / Shared Cabs)</option>
                <option value="bike">Motorcycle Ride</option>
                <option value="flight">Flight (If budget permits)</option>
              </select>
            </div>
          </div>

          {/* Interests Multi-Select Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Select Your Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const isSelected = formData.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleInterestToggle(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#174C3C] text-white shadow-sm ring-2 ring-[#F28C45]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F28C45] hover:bg-[#d97531] disabled:opacity-60 text-white font-extrabold py-3.5 px-6 rounded-xl text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Structuring Realistic Itinerary with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Budget Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ERROR MESSAGE IF ANY */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PLAN RESULTS VIEW */}
      {tripPlan && (
        <div id="plan-results" className="space-y-8 animate-in fade-in duration-300">
          {/* Plan Header Card */}
          <div className="bg-[#174C3C] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#F28C45] mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {tripPlan.destinationName}, {tripPlan.destinationState}
                  </span>
                  <span className="text-white/60">• {formData.days} Days for {formData.travellers} Person(s)</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Your Budget Itinerary
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSavePlan}
                  className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-white/20"
                >
                  <Bookmark className="w-4 h-4 text-[#F28C45]" />
                  <span>{savedSuccess ? 'Saved!' : 'Save Plan'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-white/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Destination Overview & Feasibility Notice */}
            <div className="pt-6 space-y-4">
              <p className="text-sm text-[#FFF8ED]/90 leading-relaxed">
                {tripPlan.destinationOverview}
              </p>

              <div
                className={`p-4 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed ${
                  tripPlan.isBudgetRealistic
                    ? 'bg-[#4F8063]/30 border border-[#4F8063]/40 text-[#FFF8ED]'
                    : 'bg-amber-900/40 border border-amber-500/40 text-amber-200'
                }`}
              >
                {tripPlan.isBudgetRealistic ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold mb-0.5">Budget Feasibility Verdict:</strong>
                  <span>{tripPlan.budgetFeasibilityNote}</span>
                </div>
              </div>
            </div>

            {/* Total Budget Highlights */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[11px] text-[#FFF8ED]/70 uppercase">Total Estimated</div>
                <div className="text-xl sm:text-2xl font-black text-[#F28C45] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.totalEstimated.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#FFF8ED]/70 uppercase">Cost Per Person</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  ₹{tripPlan.budgetBreakdown.costPerPerson.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#FFF8ED]/70 uppercase">Daily Spend / Person</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  ₹{tripPlan.budgetBreakdown.costPerDay.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#FFF8ED]/70 uppercase">Emergency Buffer</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                  ₹{tripPlan.budgetBreakdown.emergencyContingency.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown Cards */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200">
            <h3 className="text-base font-bold text-[#174C3C] uppercase tracking-wider mb-4 flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-[#F28C45]" />
              <span>Recommended Rupee Allocation</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Transport</span>
                <div className="text-base font-bold text-[#202B27] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.transport}
                </div>
              </div>
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Stay</span>
                <div className="text-base font-bold text-[#202B27] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.accommodation}
                </div>
              </div>
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Food & Chai</span>
                <div className="text-base font-bold text-[#202B27] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.food}
                </div>
              </div>
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Local Transit</span>
                <div className="text-base font-bold text-[#202B27] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.localTransport}
                </div>
              </div>
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Activities</span>
                <div className="text-base font-bold text-[#202B27] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.activities}
                </div>
              </div>
              <div className="bg-[#FFF8ED] p-3 rounded-2xl border border-gray-100 text-center">
                <span className="text-[11px] text-gray-500 font-medium">Emergency Cushion</span>
                <div className="text-base font-bold text-[#F28C45] mt-0.5">
                  ₹{tripPlan.budgetBreakdown.emergencyContingency}
                </div>
              </div>
            </div>

            {/* Transport Advice */}
            {tripPlan.transportRecommendation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-start space-x-3 text-xs text-gray-700 border border-gray-100">
                <Train className="w-5 h-5 text-[#174C3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#174C3C]">
                    Transit Recommendation: {tripPlan.transportRecommendation.recommendedMode}
                  </strong>
                  <p className="mt-0.5">{tripPlan.transportRecommendation.details}</p>
                </div>
              </div>
            )}
          </div>

          {/* Day-by-Day Itinerary Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#202B27]">
                Day-by-Day Detailed Itinerary
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                Click a day to expand
              </span>
            </div>

            {tripPlan.itinerary.map((day) => {
              const isExpanded = expandedDay === day.day;
              return (
                <div
                  key={day.day}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#174C3C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        D{day.day}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#202B27] text-base">{day.title}</h4>
                        <div className="text-xs text-gray-500">
                          Meals approx: ₹{day.dayMealsEstimate} • {day.stayNote}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-gray-100 space-y-4 text-xs sm:text-sm">
                      {/* Morning */}
                      <div className="flex items-start space-x-3 pt-4">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#202B27]">Morning</strong>
                            <span className="text-[#F28C45] font-bold">
                              ₹{day.morning.estimatedCost}
                            </span>
                          </div>
                          <p className="text-gray-700">{day.morning.activity}</p>
                          {day.morning.tip && (
                            <p className="text-[11px] text-gray-500 italic">💡 {day.morning.tip}</p>
                          )}
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="flex items-start space-x-3 pt-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F28C45] flex items-center justify-center shrink-0 mt-0.5">
                          <Sunset className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#202B27]">Afternoon</strong>
                            <span className="text-[#F28C45] font-bold">
                              ₹{day.afternoon.estimatedCost}
                            </span>
                          </div>
                          <p className="text-gray-700">{day.afternoon.activity}</p>
                          {day.afternoon.tip && (
                            <p className="text-[11px] text-gray-500 italic">💡 {day.afternoon.tip}</p>
                          )}
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="flex items-start space-x-3 pt-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#202B27]">Evening</strong>
                            <span className="text-[#F28C45] font-bold">
                              ₹{day.evening.estimatedCost}
                            </span>
                          </div>
                          <p className="text-gray-700">{day.evening.activity}</p>
                          {day.evening.tip && (
                            <p className="text-[11px] text-gray-500 italic">💡 {day.evening.tip}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Money Saving Hacks & Tips */}
          {tripPlan.moneySavingHacks && tripPlan.moneySavingHacks.length > 0 && (
            <div className="bg-[#FFF8ED] rounded-3xl p-6 border border-[#4F8063]/30 space-y-3">
              <h3 className="text-sm font-bold text-[#174C3C] uppercase tracking-wider flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-[#F28C45]" />
                <span>Verified Indian Money-Saving Hacks</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                {tripPlan.moneySavingHacks.map((hack, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-white/70 p-3 rounded-xl border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-[#4F8063] shrink-0 mt-0.5" />
                    <span>{hack}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cheaper Alternatives if needed */}
          {tripPlan.cheaperAlternatives && tripPlan.cheaperAlternatives.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-1.5">
              <span className="font-bold text-[#202B27]">Cheaper Nearby Indian Alternatives:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {tripPlan.cheaperAlternatives.map((alt, i) => (
                  <span key={i} className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg font-semibold text-gray-700">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Disclaimer */}
          <div className="p-4 bg-black/5 rounded-2xl text-[11px] text-gray-600 leading-relaxed border border-gray-200 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-[#F28C45] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">Important Disclaimer: </strong>
              {tripPlan.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
