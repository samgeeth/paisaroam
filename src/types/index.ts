export interface Destination {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East';
  budgetPerPerson: number; // e.g. 3500
  idealDays: number; // e.g. 3
  bestSeason: string; // e.g. "October to March"
  travellerTypes: Array<'Solo' | 'Friends' | 'Family' | 'Couples'>;
  categories: Array<'Historical' | 'Beach' | 'Hill Station' | 'Adventure' | 'Nature' | 'City' | 'Spiritual' | 'Weekend'>;
  heroImage: string;
  images: string[];
  description: string;
  highlights: string[];
  transportEstimate: number; // Indicative return from nearest hub
  stayEstimate: number; // Per night budget stay
  foodEstimate: number; // Per day food
  activityEstimate: number; // Entry fees & sight pass
  isFeatured?: boolean;
  isPublished: boolean;
  isSampleData?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripPackage {
  id: string;
  title: string;
  destinationName: string;
  days: number;
  estimatedCost: number;
  tag: string; // e.g. "Student Favourite", "Under ₹3,000"
  description: string;
  imageUrl: string;
  highlights: string[];
  isPublished: boolean;
  isSampleData?: boolean;
  createdAt?: string;
}

export interface TravelGuide {
  id: string;
  title: string;
  slug: string;
  category: 'Weekend Trips' | 'Trips under ₹1,000' | 'Trips under ₹2,000' | 'Trips under ₹5,000' | 'Student Travel' | 'Family Travel' | 'Travel Tips' | 'Hidden Destinations';
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  budgetTier: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  isSampleData?: boolean;
  createdAt?: string;
}

export interface HomepageContent {
  heroHeading: string;
  heroSubtitle: string;
  heroImageUrl: string;
  promoBannerText: string;
  promoBannerActive: boolean;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'deal';
  isActive: boolean;
  linkUrl?: string;
  linkText?: string;
  createdAt?: string;
}

export interface TripPlan {
  id?: string;
  userId?: string;
  userEmail?: string;
  startingCity: string;
  destination: string;
  days: number;
  travellers: number;
  totalBudget: number;
  travellerType: string;
  travelStyle: string;
  transportPreference: string;
  interests: string[];
  planDetails: any;
  createdAt?: string;
}

export interface FeedbackSubmission {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
  category?: 'query' | 'feedback' | 'partnership' | 'suggestion';
  status?: 'new' | 'reviewed' | 'resolved';
  createdAt?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  payerId: string;
  participantIds: string[];
  category: 'Transport' | 'Stay' | 'Food' | 'Activities' | 'Shopping' | 'Other';
  date: string;
}

export interface FriendMember {
  id: string;
  name: string;
  color?: string;
}

export interface Settlement {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}
