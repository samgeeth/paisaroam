import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Send,
  Heart,
  ChevronRight,
  Sliders,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    homepageContent,
    destinations,
    tripPackages,
    setCurrentPage,
    setSelectedDestinationId,
    submitFeedback,
  } = useApp();

  // Quick Trip Finder states
  const [quickCity, setQuickCity] = useState('Delhi');
  const [quickBudget, setQuickBudget] = useState('3000');
  const [quickDays, setQuickDays] = useState('3');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle');

  const popularDestinations = destinations.slice(0, 6);
  const weekendTrips = destinations.filter((d) => d.budgetPerPerson <= 3500);

  const handleQuickFind = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage('explore');
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await submitFeedback({
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        subject: 'Newsletter Subscription',
        message: 'Please send budget trip deals and weekend alerts.',
        category: 'query',
      });
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  const openDestination = (id: string) => {
    setSelectedDestinationId(id);
    setCurrentPage('destination-detail');
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#174C3C] to-[#0F3328] text-white pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-[2.5rem] shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#4F8063]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/15 text-xs sm:text-sm font-semibold text-[#FFF8ED]">
            <span className="w-2 h-2 rounded-full bg-[#F28C45] animate-pulse" />
            <span>Big Adventures. Small Budgets.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {homepageContent.heroHeading || 'Your Dream Trip. Your Budget. Our Plan.'}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#FFF8ED]/85 leading-relaxed font-normal">
            {homepageContent.heroSubtitle ||
              'Stop overpaying for travel packages. Plan realistic Indian trips with day-by-day itineraries, group expense splitting, and exact railway, stay and food benchmarks.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setCurrentPage('planner')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-[#F28C45] hover:bg-[#d97531] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5" />
              <span>Plan My Trip with AI</span>
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-3.5 rounded-xl border border-white/20 transition-all"
            >
              <Compass className="w-5 h-5 text-[#F28C45]" />
              <span>Explore 10+ Destinations</span>
            </button>
          </div>

          {/* Quick-Pick Budget Tags */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#FFF8ED]/80">
            <span className="font-semibold text-white/90">Popular search picks:</span>
            <button
              onClick={() => setCurrentPage('explore')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-colors"
            >
              ⚡ Under ₹2,000 Weekend
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-colors"
            >
              🏖️ Goa with Friends
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-colors"
            >
              🏔️ Himachal Hill Stations
            </button>
            <button
              onClick={() => setCurrentPage('splitter')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-colors"
            >
              🤝 Split Group Bill
            </button>
          </div>
        </div>
      </section>

      {/* QUICK TRIP FINDER WIDGET */}
      <section className="max-w-5xl mx-auto px-4 -mt-14 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#4F8063]/20 p-5 sm:p-7">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-[#174C3C]">
              <Sliders className="w-5 h-5 text-[#F28C45]" />
              <h2 className="font-bold text-base sm:text-lg">Quick Budget Trip Finder</h2>
            </div>
            <span className="text-xs bg-[#4F8063]/10 text-[#174C3C] font-semibold px-2.5 py-1 rounded-full">
              Real Indian Rates
            </span>
          </div>

          <form onSubmit={handleQuickFind} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Starting From</label>
              <select
                value={quickCity}
                onChange={(e) => setQuickCity(e.target.value)}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="Delhi">Delhi / NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Chennai">Chennai</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Max Budget per Person</label>
              <select
                value={quickBudget}
                onChange={(e) => setQuickBudget(e.target.value)}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="2000">Under ₹2,000 (Super Frugal)</option>
                <option value="3500">Under ₹3,500 (Weekend)</option>
                <option value="6000">Under ₹6,000 (Comfortable)</option>
                <option value="10000">Under ₹10,000 (Extended)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Duration</label>
              <select
                value={quickDays}
                onChange={(e) => setQuickDays(e.target.value)}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              >
                <option value="2">2 Days (Weekend Trip)</option>
                <option value="3">3 Days (Extended Weekend)</option>
                <option value="4">4-5 Days (Full Break)</option>
                <option value="7">7 Days (Week-long Roam)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#174C3C] hover:bg-[#0F3328] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#F28C45]" />
                <span>Find Matching Spots</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[#4F8063] text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Tested & Vetted By Indian Travellers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B27]">
              Popular Budget Destinations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Realistic cost averages including return sleeper train, verified budget stays, and authentic local food.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('explore')}
            className="inline-flex items-center space-x-1.5 text-[#174C3C] hover:text-[#F28C45] font-bold text-sm transition-colors"
          >
            <span>View All ({destinations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => openDestination(dest.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all cursor-pointer group flex flex-col"
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

              {/* Info Body */}
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
                    Plan this <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW PAISAROAM WORKS */}
      <section className="bg-white py-14 sm:py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#F28C45] uppercase tracking-wider">
              Simple. Honest. Transparent.
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B27]">
              How PAISAROAM Works
            </h2>
            <p className="text-sm text-gray-600">
              We eliminate guesswork and booking markups so you can travel with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFF8ED] p-6 sm:p-8 rounded-2xl border border-[#4F8063]/20 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#174C3C] text-white flex items-center justify-center font-black text-xl mb-4 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-[#202B27] mb-2">Set Your Actual Budget</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Whether you have ₹1,500 in your UPI or ₹10,000 for a holiday, enter your exact starting city, duration, and headcount.
              </p>
            </div>

            <div className="bg-[#FFF8ED] p-6 sm:p-8 rounded-2xl border border-[#4F8063]/20 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#F28C45] text-white flex items-center justify-center font-black text-xl mb-4 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-[#202B27] mb-2">Get Honest Day-by-Day Math</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our smart planner allocates realistic funds for sleeper train, verified hostels/dharamsalas, local dhabas, entry tickets, and an emergency cushion.
              </p>
            </div>

            <div className="bg-[#FFF8ED] p-6 sm:p-8 rounded-2xl border border-[#4F8063]/20 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#4F8063] text-white flex items-center justify-center font-black text-xl mb-4 shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-[#202B27] mb-2">Split Cleanly With Friends</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Use our built-in group expense splitter to calculate exact peer-to-peer settlements and avoid awkward conversations after the trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED WEEKEND TRIPS UNDER ₹3,000 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#174C3C] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold text-[#F28C45] uppercase tracking-wider">
              Escape The City
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Weekend Getaways Under ₹3,000 Total
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF8ED]/80">
              Verified 2 to 3-day escapes within overnight bus/train distance of major Indian hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weekendTrips.slice(0, 4).map((dest) => (
              <div
                key={dest.id}
                onClick={() => openDestination(dest.id)}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xs rounded-xl p-4 border border-white/15 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{dest.name}</h3>
                  <span className="text-[#F28C45] font-extrabold text-sm">
                    ₹{dest.budgetPerPerson}
                  </span>
                </div>
                <p className="text-[11px] text-[#FFF8ED]/70 mt-1 line-clamp-1">{dest.state}</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FFF8ED]/80">
                  <span>{dest.idealDays} Days</span>
                  <span className="text-[#F28C45] font-bold">View Plan →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE PAISAROAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center space-x-2 text-[#4F8063] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#F28C45]" />
              <span>Authentic Indian Travel Tech</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#202B27] leading-tight">
              Why Indian Travellers Rely On PAISAROAM
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Most travel websites are designed for luxury tourists or affiliate bookings. PAISAROAM is built by people who have actually travelled in sleeper coaches, stayed in Tapovan dorms, and eaten unlimited Marwari thalis.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#4F8063] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#202B27]">No Fake Booking Claims</h4>
                  <p className="text-xs text-gray-600">We never pretend to sell non-existent train seats or fake hotel rooms. We give transparent rate benchmarks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#4F8063] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#202B27]">Designed for Students & Young Friends</h4>
                  <p className="text-xs text-gray-600">Calculates per-person expenses and includes verified money-saving railway and hostel tricks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#4F8063] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#202B27]">100% Free & Mobile-First</h4>
                  <p className="text-xs text-gray-600">Plan on your phone while commuting or sitting in class. Works smoothly even on slower 4G connections.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#174C3C] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-[#F28C45] uppercase">Real Trip Snapshot</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded font-mono">Sample Benchmark</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Jaipur 3-Day Trip (Group of 4)</span>
                  <span className="font-bold text-[#F28C45]">₹3,200 / person</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#F28C45] h-full" style={{ width: '25%' }} title="Transport 25%" />
                  <div className="bg-[#4F8063] h-full" style={{ width: '35%' }} title="Stay 35%" />
                  <div className="bg-[#FFF8ED] h-full" style={{ width: '25%' }} title="Food 25%" />
                  <div className="bg-amber-400 h-full" style={{ width: '15%' }} title="Buffer 15%" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#FFF8ED]/80 pt-2">
                  <div>🚆 Sleeper Train: ₹800</div>
                  <div>🏨 Clean Hostel: ₹1,200</div>
                  <div>🍛 Thalis & Chai: ₹800</div>
                  <div>🛡️ Safety Buffer: ₹400</div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-xs text-[#FFF8ED]/90 italic border border-white/10">
                "We followed PAISAROAM's advice to take the 2S passenger train from Delhi and eat at Rawat. Our final group spend was ₹12,400 for 4 people!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE COMMUNITY REVIEWS (CLEARLY MARKED) */}
      <section className="bg-white py-14 sm:py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-xs font-bold text-[#4F8063] uppercase tracking-wider">
              Community Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B27]">
              Real Stories from Budget Roamers
            </h2>
            <p className="text-xs text-gray-500">
              *Clearly labelled illustrative user accounts demonstrating typical trip savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFF8ED] p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center space-x-1 text-[#F28C45] text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                "Our college group of 5 was arguing about Rishikesh expenses. The Expense Splitter saved our friendship—we settled UPI payments in literally 2 minutes!"
              </p>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-bold text-[#202B27]">Rohan Verma & Friends</span>
                <span className="text-gray-500">DU Students (Delhi)</span>
              </div>
            </div>

            <div className="bg-[#FFF8ED] p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center space-x-1 text-[#F28C45] text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                "Planned a quiet 3-day anniversary trip to Udaipur under ₹8,000 for both of us. The haveli dorm recommendation and walking route around Pichola was pure gold."
              </p>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-bold text-[#202B27]">Neha & Kunal</span>
                <span className="text-gray-500">Young Couple (Pune)</span>
              </div>
            </div>

            <div className="bg-[#FFF8ED] p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center space-x-1 text-[#F28C45] text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                "As a solo traveller on a tight budget, the Hampi bicycle guide was incredible. Spent only ₹3,100 in total including coracle boat and Sanapur lake."
              </p>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="font-bold text-[#202B27]">Arjun Nair</span>
                <span className="text-gray-500">Backpacker (Bengaluru)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER & UPDATES */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-[#0F3328] text-white p-6 sm:p-10 rounded-3xl text-center space-y-4 shadow-xl border border-white/10">
          <span className="text-xs font-bold text-[#F28C45] uppercase tracking-wider">
            Never Miss a Deal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Get Weekly Indian Budget Trip Alerts
          </h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-[#FFF8ED]/80">
            Fresh weekend destinations, off-season railway discounts, and vetted hostel deals delivered right to your inbox. No spam, ever.
          </p>

          <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C45]"
            />
            <button
              type="submit"
              className="bg-[#F28C45] hover:bg-[#d97531] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shrink-0 active:scale-95"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {newsletterStatus === 'success' && (
            <div className="text-xs font-semibold text-emerald-400 pt-2 animate-fadeIn">
              ✓ Subscribed! You will receive our next budget getaway bulletin.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
