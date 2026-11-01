import { TripPlanRequest, TripPlanResult, DayPlan } from '../../api/gemini-service';

export function generateClientTripPlan(params: TripPlanRequest, reasonNote?: string): TripPlanResult {
  const destInput = params.destination?.trim();
  const dest =
    destInput && destInput.toLowerCase() !== 'suggest destinations for me'
      ? destInput
      : params.interests.includes('beaches')
      ? 'Goa'
      : params.interests.includes('history')
      ? 'Jaipur'
      : params.interests.includes('nature')
      ? 'Manali'
      : 'Rishikesh';

  const travellers = Math.max(1, params.travellers || 1);
  const days = Math.max(1, Math.min(params.days || 3, 14));
  const totalBudget = Math.max(500, params.totalBudget || 6000);
  const budgetPerPerson = Math.round(totalBudget / travellers);
  const budgetPerPersonPerDay = Math.round(budgetPerPerson / days);

  const isRealistic = budgetPerPersonPerDay >= 600;

  // Sensible Indian Budget Allocations
  const transportTotal = Math.round(totalBudget * 0.28);
  const stayTotal = Math.round(totalBudget * 0.30);
  const foodTotal = Math.round(totalBudget * 0.22);
  const activityTotal = Math.round(totalBudget * 0.08);
  const localTransportTotal = Math.round(totalBudget * 0.05);
  const emergencyTotal = Math.round(totalBudget * 0.07);
  const totalCalc = transportTotal + stayTotal + foodTotal + activityTotal + localTransportTotal + emergencyTotal;

  // Determine state
  const stateMap: Record<string, string> = {
    jaipur: 'Rajasthan',
    udaipur: 'Rajasthan',
    jaisalmer: 'Rajasthan',
    goa: 'Goa',
    manali: 'Himachal Pradesh',
    kasol: 'Himachal Pradesh',
    rishikesh: 'Uttarakhand',
    hampi: 'Karnataka',
    gokarna: 'Karnataka',
    varanasi: 'Uttar Pradesh',
    lonavala: 'Maharashtra',
  };
  const key = dest.toLowerCase().split(' ')[0];
  const state = stateMap[key] || 'India';

  const itinerary: DayPlan[] = [];
  for (let d = 1; d <= days; d++) {
    itinerary.push({
      day: d,
      title:
        d === 1
          ? `Arrival in ${dest} & Heritage Orientation`
          : d === days
          ? `Final Exploration, Souvenir Bazaars & Departure`
          : `Exploring Iconic Landmarks & Riverside Viewpoints (Day ${d})`,
      morning: {
        activity:
          d === 1
            ? `Arrive from ${params.startingCity || 'starting hub'}, check-in to budget dorm/guest house, steaming ginger chai & local breakfast`
            : `Early morning sunrise at top viewpoint or landmark before tourist peak`,
        estimatedCost: Math.round(150 * travellers),
        tip: 'Start by 7:30 AM to beat tourist queues, afternoon sun, and peak ticket lines.',
      },
      afternoon: {
        activity:
          'Authentic regional thali lunch at popular local dhaba followed by cultural landmark exploration',
        estimatedCost: Math.round(200 * travellers),
        tip: 'Local bhojanalayas offer unlimited fresh thalis at ₹120–₹180 per head.',
      },
      evening: {
        activity:
          'Sunset viewpoint, vibrant street food tasting walk, and gathering by riverside ghat or old town bazaar',
        estimatedCost: Math.round(180 * travellers),
        tip: 'Ghats, fort walks, and bazaar strolls offer rich cultural immersion at zero ticket cost.',
      },
      dayMealsEstimate: Math.round(foodTotal / days),
      stayNote: `Clean budget hostel dorm or verified guest house (~₹${Math.round(stayTotal / days)}/night total)`,
    });
  }

  return {
    destinationName: dest,
    destinationState: state,
    destinationOverview: `${dest} is one of India's most vibrant and budget-accessible destinations, well suited for ${params.travellerType} travel with rich sights, local culinary culture, and easy transit from ${params.startingCity || 'your city'}.`,
    isBudgetRealistic: isRealistic,
    budgetFeasibilityNote: isRealistic
      ? `Budget of ₹${totalBudget.toLocaleString('en-IN')} (₹${budgetPerPersonPerDay}/day per person) is well matched for a smart budget trip covering sleeper/bus travel, dorm/budget rooms, and delicious dhaba meals.`
      : `₹${totalBudget.toLocaleString('en-IN')} is very tight for ${days} days and ${travellers} travellers (approx ₹${budgetPerPersonPerDay}/person/day). We suggest reducing duration to ${Math.max(1, days - 1)} days or picking an ultra-frugal destination closer to home.`,
    budgetBreakdown: {
      transport: transportTotal,
      accommodation: stayTotal,
      food: foodTotal,
      activities: activityTotal,
      localTransport: localTransportTotal,
      shopping: 0,
      emergencyContingency: emergencyTotal,
      totalEstimated: totalCalc,
      costPerPerson: Math.round(totalCalc / travellers),
      costPerDay: Math.round(totalCalc / (travellers * days)),
    },
    cheaperAlternatives: [
      'Pushkar (Rajasthan)',
      'Gokarna (Karnataka)',
      'Lansdowne (Uttarakhand)',
      'Hampi (Karnataka)',
    ],
    moneySavingHacks: [
      'Book Indian Railways Sleeper (SL) class or express state road transport (KSRTC/UPSRTC/RSRTC) in advance.',
      'Stay in youth hostels like Zostel, The Hosteller, or certified homestays instead of commercial hotels.',
      'Eat at busy local dhabas with high food turnover—fresher and 60% cheaper than tourist cafes.',
      'Use shared autos or local state buses instead of private tourist taxis.',
      'Carry a student ID card; many national monuments offer 50% to 80% ticket discounts.',
    ],
    disclaimer:
      'All price calculations are indicative averages based on verified Indian budget travel rates. PAISAROAM does not guarantee live railway or hotel fares. Please verify before departure.',
    itinerary,
    transportRecommendation: {
      recommendedMode:
        params.transportPreference === 'train'
          ? 'Indian Railways Superfast Sleeper / 3AC'
          : 'State Transport Express Bus or Shared Cab',
      details: `Direct overnight route from ${params.startingCity || 'nearest metro'} allows saving on one night's hotel stay.`,
      estimatedCostReturn: transportTotal,
    },
    generatedBy: 'budget-engine-fallback',
  };
}
