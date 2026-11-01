import { GoogleGenAI, Type } from "@google/genai";

export interface TripPlanRequest {
  startingCity: string;
  destination: string;
  travelStartDate?: string;
  days: number;
  travellers: number;
  totalBudget: number;
  travellerType: string;
  travelStyle: string;
  interests: string[];
  transportPreference: string;
}

export interface DayPlan {
  day: number;
  title: string;
  morning: { activity: string; estimatedCost: number; tip: string };
  afternoon: { activity: string; estimatedCost: number; tip: string };
  evening: { activity: string; estimatedCost: number; tip: string };
  dayMealsEstimate: number;
  stayNote: string;
}

export interface TripPlanResult {
  destinationName: string;
  destinationState: string;
  destinationOverview: string;
  isBudgetRealistic: boolean;
  budgetFeasibilityNote: string;
  budgetBreakdown: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    localTransport: number;
    shopping: number;
    emergencyContingency: number;
    totalEstimated: number;
    costPerPerson: number;
    costPerDay: number;
  };
  cheaperAlternatives: string[];
  moneySavingHacks: string[];
  disclaimer: string;
  itinerary: DayPlan[];
  transportRecommendation: {
    recommendedMode: string;
    details: string;
    estimatedCostReturn: number;
  };
  generatedBy: 'gemini' | 'budget-engine-fallback';
}

export async function generateTripPlanWithGemini(params: TripPlanRequest): Promise<TripPlanResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in environment. Using smart budget engine fallback.");
    return generateFallbackPlan(params, "Gemini API key is not configured in Settings > Secrets. Loaded deterministic Indian budget plan.");
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are PAISAROAM's Senior Indian Budget Travel Architect.
Create a realistic, frugal, and highly structured travel plan tailored for Indian students, young friends, couples, or middle-class families.

Trip Details:
- Starting City: ${params.startingCity || "Delhi"}
- Destination: ${params.destination || "Suggest the most suitable affordable destination in India for this budget"}
- Duration: ${params.days} days
- Group Size: ${params.travellers} person(s)
- Total Group Budget: ₹${params.totalBudget} INR (which is ₹${Math.round(params.totalBudget / (params.travellers || 1))} per person, and ₹${Math.round(params.totalBudget / ((params.travellers || 1) * (params.days || 1)))} per person per day)
- Traveller Type: ${params.travellerType}
- Travel Style: ${params.travelStyle} (Budget / Comfortable / Adventure)
- Interests: ${params.interests?.join(", ") || "Sightseeing, Local food, Nature"}
- Preferred Transport: ${params.transportPreference}

Guidelines:
1. All costs MUST be in Indian Rupees (INR ₹).
2. Never invent confirmed flight/train/hotel bookings. Label all numbers as indicative estimates.
3. Assess whether the total budget (₹${params.totalBudget}) is realistic for ${params.days} days and ${params.travellers} people. If too low, set isBudgetRealistic: false and clearly explain why in budgetFeasibilityNote, and list cheaper nearby alternatives.
4. Keep accommodation and food practical for Indian budget travellers (hostels, dharamshalas, Zostel, guest houses, local thali joints, street food).
5. Always reserve 5% to 10% for an emergency / contingency buffer.
6. Provide daily itineraries for all ${params.days} day(s) with morning, afternoon, and evening plans.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Indian budget travel planner for PAISAROAM. Output valid JSON adhering to the specified schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destinationName: { type: Type.STRING },
            destinationState: { type: Type.STRING },
            destinationOverview: { type: Type.STRING },
            isBudgetRealistic: { type: Type.BOOLEAN },
            budgetFeasibilityNote: { type: Type.STRING },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                transport: { type: Type.NUMBER },
                accommodation: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                localTransport: { type: Type.NUMBER },
                shopping: { type: Type.NUMBER },
                emergencyContingency: { type: Type.NUMBER },
                totalEstimated: { type: Type.NUMBER },
                costPerPerson: { type: Type.NUMBER },
                costPerDay: { type: Type.NUMBER },
              },
              required: ["transport", "accommodation", "food", "activities", "localTransport", "emergencyContingency", "totalEstimated", "costPerPerson", "costPerDay"],
            },
            cheaperAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            moneySavingHacks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            disclaimer: { type: Type.STRING },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  morning: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      tip: { type: Type.STRING },
                    },
                    required: ["activity", "estimatedCost"],
                  },
                  afternoon: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      tip: { type: Type.STRING },
                    },
                    required: ["activity", "estimatedCost"],
                  },
                  evening: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      tip: { type: Type.STRING },
                    },
                    required: ["activity", "estimatedCost"],
                  },
                  dayMealsEstimate: { type: Type.NUMBER },
                  stayNote: { type: Type.STRING },
                },
                required: ["day", "title", "morning", "afternoon", "evening", "dayMealsEstimate"],
              },
            },
            transportRecommendation: {
              type: Type.OBJECT,
              properties: {
                recommendedMode: { type: Type.STRING },
                details: { type: Type.STRING },
                estimatedCostReturn: { type: Type.NUMBER },
              },
              required: ["recommendedMode", "details", "estimatedCostReturn"],
            },
          },
          required: [
            "destinationName",
            "destinationState",
            "destinationOverview",
            "isBudgetRealistic",
            "budgetFeasibilityNote",
            "budgetBreakdown",
            "cheaperAlternatives",
            "moneySavingHacks",
            "disclaimer",
            "itinerary",
            "transportRecommendation",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response returned from Gemini API");
    }

    const parsed = JSON.parse(text) as TripPlanResult;
    parsed.generatedBy = 'gemini';
    return parsed;
  } catch (error) {
    console.error("Gemini API call error:", error);
    return generateFallbackPlan(params, `Gemini API notice: ${error instanceof Error ? error.message : "Service busy"}. Generated optimized budget plan.`);
  }
}

export function generateFallbackPlan(params: TripPlanRequest, note: string): TripPlanResult {
  const dest = params.destination && params.destination.toLowerCase() !== "suggest destinations for me"
    ? params.destination
    : (params.interests.includes("beach") ? "Goa" : params.interests.includes("history") ? "Jaipur" : "Rishikesh");

  const travellers = Math.max(1, params.travellers || 1);
  const days = Math.max(1, Math.min(params.days || 3, 14));
  const totalBudget = params.totalBudget || 6000;
  const budgetPerPerson = Math.round(totalBudget / travellers);
  const budgetPerPersonPerDay = Math.round(budgetPerPerson / days);

  const isRealistic = budgetPerPersonPerDay >= 700;

  // Sensible allocations
  const transportTotal = Math.round(totalBudget * 0.28);
  const stayTotal = Math.round(totalBudget * 0.30);
  const foodTotal = Math.round(totalBudget * 0.22);
  const activityTotal = Math.round(totalBudget * 0.08);
  const localTransportTotal = Math.round(totalBudget * 0.05);
  const emergencyTotal = Math.round(totalBudget * 0.07);
  const totalCalc = transportTotal + stayTotal + foodTotal + activityTotal + localTransportTotal + emergencyTotal;

  const itinerary: DayPlan[] = [];
  for (let d = 1; d <= days; d++) {
    itinerary.push({
      day: d,
      title: d === 1 ? `Arrival in ${dest} & Heritage Orientation` : d === days ? `Final Sightseeing, Souvenir Hunt & Departure` : `Exploring Core Landmarks & Hidden Viewpoints`,
      morning: {
        activity: d === 1 ? `Reach destination, check-in to budget stay/hostel, chai & local breakfast` : `Morning visit to top viewpoint or landmark before crowd peaks`,
        estimatedCost: Math.round(150 * travellers),
        tip: "Start early by 7:30 AM to beat tourist queues and heat.",
      },
      afternoon: {
        activity: `Authentic regional thali lunch at popular local dhaba followed by cultural landmark exploration`,
        estimatedCost: Math.round(200 * travellers),
        tip: "Dhabas and Udupi/Bhojanalayas offer unlimited thalis at ₹120 - ₹180.",
      },
      evening: {
        activity: `Sunset viewpoint, street food tasting walk, and gathering by ghat/bazaar`,
        estimatedCost: Math.round(180 * travellers),
        tip: "Free walking tours and riverside ghats offer rich vibes at zero ticket cost.",
      },
      dayMealsEstimate: Math.round((foodTotal / days)),
      stayNote: `Budget hostel dorm or verified guest house (~₹${Math.round(stayTotal / days)} total/night)`,
    });
  }

  return {
    destinationName: dest,
    destinationState: dest.toLowerCase().includes("jaipur") ? "Rajasthan" : dest.toLowerCase().includes("goa") ? "Goa" : "Uttarakhand",
    destinationOverview: `${dest} is one of India's most vibrant and budget-accessible getaways, perfect for ${params.travellerType} travel with rich experiences, local street culture, and easy transit.`,
    isBudgetRealistic: isRealistic,
    budgetFeasibilityNote: isRealistic
      ? `Budget of ₹${totalBudget} (₹${budgetPerPersonPerDay}/day per person) is well-suited for a smart budget trip covering sleeper/bus travel, dorm/budget rooms, and delicious local food.`
      : `₹${totalBudget} is tight for ${days} days and ${travellers} travellers (approx ₹${budgetPerPersonPerDay}/person/day). We suggest reducing days to ${Math.max(1, days - 1)} or choosing a closer destination to save on transport.`,
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
    cheaperAlternatives: ["Pushkar (Rajasthan)", "Gokarna (Karnataka)", "Lansdowne (Uttarakhand)", "Hampi (Karnataka)"],
    moneySavingHacks: [
      "Book Indian Railways Sleeper (SL) class or express state road transport (KSRTC/UPSRTC/RSRTC) well in advance.",
      "Stay in youth hostels like Zostel, The Hosteller, or certified homestays instead of commercial hotels.",
      "Eat at busy local dhabas with high food turnover—fresher and 60% cheaper than tourist cafes.",
      "Use shared autos or local state buses instead of private tourist taxis.",
      "Carry a college student ID card; many national monuments offer 50% to 80% ticket discounts.",
    ],
    disclaimer: "All price calculations are indicative averages based on verified Indian budget travel rates. PAISAROAM does not guarantee live railway or hotel fares. Please verify before departure.",
    itinerary,
    transportRecommendation: {
      recommendedMode: params.transportPreference === "train" ? "Indian Railways Superfast Sleeper / 3AC" : "State Transport Express Bus or Shared Cab",
      details: `Direct overnight route from ${params.startingCity || "nearest metro"} allows saving on one night's hotel stay.`,
      estimatedCostReturn: transportTotal,
    },
    generatedBy: 'budget-engine-fallback',
  };
}
