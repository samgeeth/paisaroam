import React, { useState, useMemo } from 'react';
import {
  Calculator,
  IndianRupee,
  Users,
  Calendar,
  Train,
  Home,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  HelpCircle,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  icon: any;
  color: string;
  description: string;
}

export const BudgetCalculatorPage: React.FC = () => {
  const [totalTargetBudget, setTotalTargetBudget] = useState<number>(12000);
  const [travellers, setTravellers] = useState<number>(3);
  const [days, setDays] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const [categories, setCategories] = useState<ExpenseCategory[]>([
    {
      id: 'transport',
      name: 'Transport (Train / Bus)',
      amount: 3200,
      icon: Train,
      color: '#174C3C',
      description: 'Return sleeper tickets or state express bus fares',
    },
    {
      id: 'stay',
      name: 'Accommodation',
      amount: 3600,
      icon: Home,
      color: '#4F8063',
      description: 'Hostel dorms, guesthouses, or budget hotel rooms',
    },
    {
      id: 'food',
      name: 'Food & Chai',
      amount: 2400,
      icon: Utensils,
      color: '#F28C45',
      description: 'Local dhabas, street food, water, and evening tea',
    },
    {
      id: 'localTransport',
      name: 'Local Transport',
      amount: 800,
      icon: Car,
      color: '#2A9D8F',
      description: 'Shared autos, city buses, metro, or scooter fuel',
    },
    {
      id: 'activities',
      name: 'Activities & Tickets',
      amount: 800,
      icon: Ticket,
      color: '#E76F51',
      description: 'Fort entry passes, rafting gear, or temple darshan',
    },
    {
      id: 'shopping',
      name: 'Shopping & Souvenirs',
      amount: 400,
      icon: ShoppingBag,
      color: '#F4A261',
      description: 'Local handicrafts, spices, postcards, and gifts',
    },
    {
      id: 'other',
      name: 'Other Expenses',
      amount: 300,
      icon: HelpCircle,
      color: '#8D99AE',
      description: 'SIM recharges, cloakrooms, toiletries, luggage tips',
    },
    {
      id: 'emergency',
      name: 'Emergency Allowance',
      amount: 500,
      icon: ShieldAlert,
      color: '#D90429',
      description: 'Medical store emergency, sudden cab hire, safety cushion',
    },
  ]);

  const updateCategoryAmount = (id: string, newAmount: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount: Math.max(0, newAmount) } : c))
    );
  };

  // Calculations
  const totalCost = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.amount, 0);
  }, [categories]);

  const costPerPerson = useMemo(() => {
    return Math.round(totalCost / Math.max(1, travellers));
  }, [totalCost, travellers]);

  const costPerDay = useMemo(() => {
    return Math.round(totalCost / (Math.max(1, travellers) * Math.max(1, days)));
  }, [totalCost, travellers, days]);

  const budgetRemaining = totalTargetBudget - totalCost;

  // Apply Presets
  const applyPreset = (type: 'student' | 'balanced' | 'family') => {
    if (type === 'student') {
      setTotalTargetBudget(6000);
      setTravellers(2);
      setDays(3);
      setCategories([
        { ...categories[0], amount: 1600 },
        { ...categories[1], amount: 1800 },
        { ...categories[2], amount: 1400 },
        { ...categories[3], amount: 400 },
        { ...categories[4], amount: 400 },
        { ...categories[5], amount: 100 },
        { ...categories[6], amount: 100 },
        { ...categories[7], amount: 200 },
      ]);
    } else if (type === 'balanced') {
      setTotalTargetBudget(15000);
      setTravellers(3);
      setDays(3);
      setCategories([
        { ...categories[0], amount: 4000 },
        { ...categories[1], amount: 4500 },
        { ...categories[2], amount: 3200 },
        { ...categories[3], amount: 1000 },
        { ...categories[4], amount: 1000 },
        { ...categories[5], amount: 500 },
        { ...categories[6], amount: 300 },
        { ...categories[7], amount: 500 },
      ]);
    } else if (type === 'family') {
      setTotalTargetBudget(28000);
      setTravellers(4);
      setDays(4);
      setCategories([
        { ...categories[0], amount: 8000 },
        { ...categories[1], amount: 10000 },
        { ...categories[2], amount: 5000 },
        { ...categories[3], amount: 2000 },
        { ...categories[4], amount: 1500 },
        { ...categories[5], amount: 1000 },
        { ...categories[6], amount: 500 },
        { ...categories[7], amount: 1000 },
      ]);
    }
  };

  const copySummary = () => {
    const summary = `PAISAROAM Travel Budget Summary:
Target Budget: ₹${totalTargetBudget}
Calculated Cost: ₹${totalCost}
Travellers: ${travellers} | Duration: ${days} days
Cost Per Person: ₹${costPerPerson}
Daily Cost / Person: ₹${costPerDay}
${budgetRemaining >= 0 ? `Savings Remaining: ₹${budgetRemaining}` : `Deficit: ₹${Math.abs(budgetRemaining)}`}

Breakdown:
${categories.map((c) => `- ${c.name}: ₹${c.amount}`).join('\n')}

Plan your trip on https://paisaroam.com`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#174C3C]/10 text-[#174C3C] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5 text-[#F28C45]" />
          <span>Interactive Mathematical Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          Smart Budget Calculator
        </h1>
        <p className="text-sm text-gray-600">
          Tweak every single rupee across transport, stay, meals, and emergency reserve to see your exact per-day and per-person cost.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-gray-500 font-semibold mr-1">Load Presets:</span>
        <button
          onClick={() => applyPreset('student')}
          className="text-xs bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl font-bold text-[#174C3C] shadow-2xs"
        >
          🎒 Student Backpacker (₹900/day)
        </button>
        <button
          onClick={() => applyPreset('balanced')}
          className="text-xs bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl font-bold text-[#174C3C] shadow-2xs"
        >
          🌿 Balanced Group (₹1,500/day)
        </button>
        <button
          onClick={() => applyPreset('family')}
          className="text-xs bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl font-bold text-[#174C3C] shadow-2xs"
        >
          👨‍👩‍👧‍👦 Family Comfort (₹2,200/day)
        </button>
      </div>

      {/* Top Parameter Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Total Target Budget (₹ INR)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="500"
              value={totalTargetBudget}
              onChange={(e) => setTotalTargetBudget(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-base font-bold text-[#174C3C] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Number of Travellers
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="20"
              value={travellers}
              onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
              className="w-full accent-[#174C3C]"
            />
            <span className="w-12 text-center font-bold text-sm bg-gray-100 py-2 rounded-lg text-[#174C3C]">
              {travellers}p
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Trip Duration (Days)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              className="w-full accent-[#174C3C]"
            />
            <span className="w-12 text-center font-bold text-sm bg-gray-100 py-2 rounded-lg text-[#174C3C]">
              {days}d
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Live Results Banner */}
      <div className="bg-[#174C3C] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/10 rounded-2xl">
            <span className="text-[11px] text-[#FFF8ED]/70 uppercase font-semibold">Total Trip Cost</span>
            <div className="text-2xl sm:text-3xl font-black text-[#F28C45] mt-1">
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#FFF8ED]/60">Sum of all categories</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl">
            <span className="text-[11px] text-[#FFF8ED]/70 uppercase font-semibold">Cost Per Person</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ₹{costPerPerson.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#FFF8ED]/60">Divided across {travellers} people</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl">
            <span className="text-[11px] text-[#FFF8ED]/70 uppercase font-semibold">Daily Rate / Person</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ₹{costPerDay.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#FFF8ED]/60">For {days} days on the road</span>
          </div>

          <div className={`p-3 rounded-2xl ${budgetRemaining >= 0 ? 'bg-emerald-900/60' : 'bg-red-900/70'}`}>
            <span className="text-[11px] text-[#FFF8ED]/70 uppercase font-semibold">
              {budgetRemaining >= 0 ? 'Budget Remaining' : 'Budget Deficit'}
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 ${budgetRemaining >= 0 ? 'text-emerald-400' : 'text-red-300'}`}>
              ₹{Math.abs(budgetRemaining).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#FFF8ED]/80">
              {budgetRemaining >= 0 ? '✓ Within target' : '⚠ Over budget'}
            </span>
          </div>
        </div>

        {/* Visual Allocation Bar Chart */}
        <div>
          <div className="flex items-center justify-between text-xs text-[#FFF8ED]/80 mb-2">
            <span>Visual Expense Distribution</span>
            <span>{Math.min(100, Math.round((totalCost / (totalTargetBudget || 1)) * 100))}% of Target</span>
          </div>
          <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden flex shadow-inner">
            {categories.map((c) => {
              const pct = totalCost > 0 ? (c.amount / totalCost) * 100 : 0;
              if (pct <= 0) return null;
              return (
                <div
                  key={c.id}
                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                  title={`${c.name}: ₹${c.amount} (${Math.round(pct)}%)`}
                  className="h-full transition-all duration-300"
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2.5 text-[11px] text-[#FFF8ED]/80">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span>{c.name.split('(')[0]}: ₹{c.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editable Category Sliders & Numeric Inputs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#202B27]">
              Category Expense Sliders
            </h2>
            <p className="text-xs text-gray-500">
              Adjust any amount with the slider or type the exact figure directly.
            </p>
          </div>

          <button
            onClick={copySummary}
            className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const pctOfTotal = totalCost > 0 ? Math.round((cat.amount / totalCost) * 100) : 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#202B27]">{cat.name}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {pctOfTotal}% of total spend
                      </span>
                    </div>
                  </div>

                  {/* Numeric Input */}
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={cat.amount}
                      onChange={(e) =>
                        updateCategoryAmount(cat.id, parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-2 py-1 text-sm font-bold text-right text-[#202B27] focus:outline-none focus:ring-1 focus:ring-[#174C3C]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-tight">{cat.description}</p>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="50"
                  value={cat.amount}
                  onChange={(e) =>
                    updateCategoryAmount(cat.id, parseInt(e.target.value) || 0)
                  }
                  className="w-full accent-[#174C3C]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
