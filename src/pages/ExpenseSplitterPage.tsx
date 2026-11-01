import React, { useState, useMemo } from 'react';
import { FriendMember, ExpenseItem, Settlement } from '../types';
import {
  Users,
  Plus,
  Trash2,
  Share2,
  Copy,
  Check,
  IndianRupee,
  Receipt,
  UserPlus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Scale,
} from 'lucide-react';

export const ExpenseSplitterPage: React.FC = () => {
  // Members list
  const [members, setMembers] = useState<FriendMember[]>([
    { id: 'm1', name: 'Aman' },
    { id: 'm2', name: 'Rohan' },
    { id: 'm3', name: 'Sneha' },
    { id: 'm4', name: 'Priya' },
  ]);

  const [newMemberName, setNewMemberName] = useState('');

  // Expenses list
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-1',
      title: 'Delhi to Haridwar Train Tickets',
      amount: 1520,
      payerId: 'm1',
      participantIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'Transport',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 'exp-2',
      title: 'Rishikesh Tapovan 4-Bed Dorm (2 Nights)',
      amount: 2600,
      payerId: 'm2',
      participantIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'Stay',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 'exp-3',
      title: 'Marwari Bhojanalaya Dinner Thalis',
      amount: 720,
      payerId: 'm3',
      participantIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 'exp-4',
      title: 'Shivpuri River Rafting Tickets',
      amount: 1600,
      payerId: 'm1',
      participantIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'Activities',
      date: new Date().toISOString().split('T')[0],
    },
  ]);

  // New Expense Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPayerId, setNewPayerId] = useState(members[0]?.id || '');
  const [newParticipants, setNewParticipants] = useState<string[]>(members.map((m) => m.id));
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Food');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add Member
  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newId = 'm-' + Date.now();
    const updated = [...members, { id: newId, name: newMemberName.trim() }];
    setMembers(updated);
    setNewParticipants([...newParticipants, newId]);
    setNewMemberName('');
  };

  // Remove Member
  const removeMember = (id: string) => {
    if (members.length <= 2) {
      alert('You need at least 2 people to split expenses!');
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
    setExpenses(
      expenses
        .filter((e) => e.payerId !== id)
        .map((e) => ({
          ...e,
          participantIds: e.participantIds.filter((pId) => pId !== id),
        }))
    );
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amt) || amt <= 0 || newParticipants.length === 0) {
      alert('Please fill out all expense fields and select at least one participant.');
      return;
    }

    const newExp: ExpenseItem = {
      id: 'exp-' + Date.now(),
      title: newTitle.trim(),
      amount: amt,
      payerId: newPayerId,
      participantIds: newParticipants,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
    };

    setExpenses([newExp, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
  };

  // Delete Expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Balance calculations: net = totalPaid - totalOwed
  const memberBalances = useMemo(() => {
    const balances: Record<string, { name: string; paid: number; owed: number; net: number }> = {};

    members.forEach((m) => {
      balances[m.id] = { name: m.name, paid: 0, owed: 0, net: 0 };
    });

    expenses.forEach((exp) => {
      // Payer gets credited
      if (balances[exp.payerId]) {
        balances[exp.payerId].paid += exp.amount;
      }

      // Split equally among participants
      if (exp.participantIds.length > 0) {
        const splitAmount = exp.amount / exp.participantIds.length;
        exp.participantIds.forEach((pId) => {
          if (balances[pId]) {
            balances[pId].owed += splitAmount;
          }
        });
      }
    });

    // Calculate net
    Object.keys(balances).forEach((id) => {
      balances[id].net = Math.round(balances[id].paid - balances[id].owed);
    });

    return balances;
  }, [members, expenses]);

  // Optimal Settlement Algorithm (Greedy matching)
  const settlements = useMemo<Settlement[]>(() => {
    const creditors: { id: string; name: string; amount: number }[] = [];
    const debtors: { id: string; name: string; amount: number }[] = [];

    Object.entries(memberBalances).forEach(([id, data]) => {
      if (data.net > 1) {
        creditors.push({ id, name: data.name, amount: data.net });
      } else if (data.net < -1) {
        debtors.push({ id, name: data.name, amount: Math.abs(data.net) });
      }
    });

    // Sort descending
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const result: Settlement[] = [];

    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];

      const settlementAmount = Math.min(creditor.amount, debtor.amount);
      if (settlementAmount > 0) {
        result.push({
          fromId: debtor.id,
          fromName: debtor.name,
          toId: creditor.id,
          toName: creditor.name,
          amount: Math.round(settlementAmount),
        });
      }

      creditor.amount -= settlementAmount;
      debtor.amount -= settlementAmount;

      if (creditor.amount <= 1) cIdx++;
      if (debtor.amount <= 1) dIdx++;
    }

    return result;
  }, [memberBalances]);

  const copySettlementSummary = () => {
    const text = `PAISAROAM Group Expense Settlement:
Total Trip Spend: ₹${totalSpent.toLocaleString('en-IN')}

Individual Balances:
${Object.values(memberBalances)
  .map(
    (b) =>
      `- ${b.name}: Paid ₹${Math.round(b.paid)}, Share ₹${Math.round(b.owed)} (${
        b.net >= 0 ? `Gets back ₹${b.net}` : `Owes ₹${Math.abs(b.net)}`
      })`
  )
  .join('\n')}

Minimum Transactions To Settle:
${
  settlements.length > 0
    ? settlements.map((s) => `👉 ${s.fromName} pays ${s.toName} ₹${s.amount}`).join('\n')
    : 'All balances are settled!'
}

Calculated via PAISAROAM - Big Adventures. Small Budgets.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#F28C45]/10 text-[#F28C45] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Zero Awkward Math</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          Group Expense Splitter
        </h1>
        <p className="text-sm text-gray-600">
          Track who paid for train tickets, hostel rooms, and dhaba bills. Our algorithm calculates the minimum peer-to-peer UPI payments to settle up.
        </p>
      </div>

      {/* Friends Group Management */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#174C3C]" />
            <h2 className="font-bold text-base text-[#202B27]">Trip Members ({members.length})</h2>
          </div>
          <span className="text-xs text-gray-500">Add everyone in your travelling group</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-[#FFF8ED] text-[#174C3C] border border-[#4F8063]/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2"
            >
              <span>{m.name}</span>
              <button
                onClick={() => removeMember(m.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove friend"
              >
                ×
              </button>
            </div>
          ))}

          {/* Add Friend Form */}
          <form onSubmit={addMember} className="flex items-center space-x-1.5">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Friend's Name"
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#202B27] focus:outline-none focus:ring-1 focus:ring-[#174C3C]"
            />
            <button
              type="submit"
              className="bg-[#174C3C] hover:bg-[#0F3328] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Total Spent & Settlement Summary Banner */}
      <div className="bg-[#174C3C] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/15 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F28C45] uppercase tracking-wider">
              Total Group Spend
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#FFF8ED]/80 mt-1">
              Avg ₹{Math.round(totalSpent / Math.max(1, members.length)).toLocaleString('en-IN')} per person
            </div>
          </div>

          <button
            onClick={copySettlementSummary}
            className="bg-[#F28C45] hover:bg-[#d97531] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Settlement Copied!' : 'Share WhatsApp Summary'}</span>
          </button>
        </div>

        {/* Member Balances Breakdown Cards */}
        <div>
          <h3 className="text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-3">
            Individual Standing
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(memberBalances).map(([id, b]) => (
              <div key={id} className="bg-white/10 rounded-2xl p-3 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{b.name}</span>
                  {b.net >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#FFF8ED]/70">
                  Paid: ₹{Math.round(b.paid)} | Share: ₹{Math.round(b.owed)}
                </div>
                <div className="text-sm font-extrabold pt-1">
                  {b.net > 0 && <span className="text-emerald-400">+₹{b.net} (Gets)</span>}
                  {b.net < 0 && <span className="text-amber-300">-₹{Math.abs(b.net)} (Owes)</span>}
                  {b.net === 0 && <span className="text-white/60">Settled (₹0)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimal Settlement Transactions */}
        <div className="pt-4 border-t border-white/15">
          <h3 className="text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <Scale className="w-4 h-4" />
            <span>Optimal Settlement Transfers (Minimum UPI Steps)</span>
          </h3>

          {settlements.length === 0 ? (
            <p className="text-xs text-[#FFF8ED]/80 italic">
              Everyone is settled! No outstanding balances.
            </p>
          ) : (
            <div className="space-y-2">
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white/15 backdrop-blur-xs p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-semibold border border-white/10"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-300">{s.fromName}</span>
                    <span className="text-[#FFF8ED]/70 font-normal">pays</span>
                    <span className="font-bold text-emerald-400">{s.toName}</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#F28C45]">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Expense Form & Expenses List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#202B27]">Trip Expenses</h2>
            <p className="text-xs text-gray-500">Itemized bills recorded during the journey</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center space-x-1.5 bg-[#174C3C] hover:bg-[#0F3328] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-[#F28C45]" />
            <span>{showAddForm ? 'Cancel' : 'Add Expense'}</span>
          </button>
        </div>

        {/* Add Expense Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddExpense}
            className="p-5 bg-[#FFF8ED] rounded-2xl border border-[#4F8063]/30 space-y-4 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sleeper tickets, Cafe dinner, Fort entry"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Amount in ₹ INR *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Who Paid?
                </label>
                <select
                  value={newPayerId}
                  onChange={(e) => setNewPayerId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                >
                  <option value="Transport">Transport (Train, Bus, Auto)</option>
                  <option value="Stay">Accommodation (Hostel, Room)</option>
                  <option value="Food">Food & Drinks (Meals, Chai)</option>
                  <option value="Activities">Activities & Tickets</option>
                  <option value="Shopping">Shopping & Gifts</option>
                  <option value="Other">Other Expenses</option>
                </select>
              </div>
            </div>

            {/* Who is splitting this expense? */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Who Split This? (Participated)
              </label>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => {
                  const isChecked = newParticipants.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setNewParticipants((prev) =>
                          isChecked ? prev.filter((p) => p !== m.id) : [...prev, m.id]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-[#174C3C] text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F28C45] hover:bg-[#d97531] text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              Save Expense to Split
            </button>
          </form>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">
              No expenses recorded yet. Click "Add Expense" to log bills.
            </p>
          ) : (
            expenses.map((exp) => {
              const payerName = members.find((m) => m.id === exp.payerId)?.name || 'Unknown';
              const splitCount = exp.participantIds.length;
              const perHead = Math.round(exp.amount / Math.max(1, splitCount));

              return (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#202B27] text-sm sm:text-base">
                        {exp.title}
                      </span>
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">
                        {exp.category}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      Paid by <strong className="text-[#174C3C]">{payerName}</strong> • Split
                      between {splitCount} people (~₹{perHead}/head)
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-[#F28C45]">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
