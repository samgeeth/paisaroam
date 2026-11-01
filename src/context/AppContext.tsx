import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import {
  Destination,
  TripPackage,
  TravelGuide,
  HomepageContent,
  Announcement,
  TripPlan,
  FeedbackSubmission,
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_TRIP_PACKAGES,
  INITIAL_TRAVEL_GUIDES,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_ANNOUNCEMENTS,
} from '../data/seedData';

type PageRoute =
  | 'home'
  | 'explore'
  | 'destination-detail'
  | 'planner'
  | 'calculator'
  | 'splitter'
  | 'compare'
  | 'guides'
  | 'guide-detail'
  | 'about'
  | 'contact'
  | 'admin';

interface AppContextType {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
  selectedGuideId: string | null;
  setSelectedGuideId: (id: string | null) => void;

  destinations: Destination[];
  tripPackages: TripPackage[];
  travelGuides: TravelGuide[];
  homepageContent: HomepageContent;
  announcements: Announcement[];
  feedbackList: FeedbackSubmission[];
  tripPlans: TripPlan[];

  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  isDataLoading: boolean;
  firestoreConnected: boolean;

  // Actions
  addOrUpdateDestination: (dest: Destination) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  addOrUpdatePackage: (pkg: TripPackage) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  addOrUpdateGuide: (guide: TravelGuide) => Promise<void>;
  deleteGuide: (id: string) => Promise<void>;
  updateHomepageContent: (content: Partial<HomepageContent>) => Promise<void>;
  updateAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  submitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'createdAt'>) => Promise<void>;
  saveTripPlanToDb: (plan: TripPlan) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [tripPackages, setTripPackages] = useState<TripPackage[]>(INITIAL_TRIP_PACKAGES);
  const [travelGuides, setTravelGuides] = useState<TravelGuide[]>(INITIAL_TRAVEL_GUIDES);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([]);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);

  // Check URL hash for routing on initial load and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      if (
        [
          'home',
          'explore',
          'destination-detail',
          'planner',
          'calculator',
          'splitter',
          'compare',
          'guides',
          'guide-detail',
          'about',
          'contact',
          'admin',
        ].includes(hash)
      ) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page changes
  const navigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Test Firestore connection on boot
  useEffect(() => {
    testConnection().then((connected) => {
      setFirestoreConnected(connected);
    });
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const isUserAdmin = Boolean(
        currentUser &&
          currentUser.email &&
          (currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
            currentUser.email.includes('admin'))
      );
      setIsAdmin(isUserAdmin);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time collections
  useEffect(() => {
    const unsubDests = onSnapshot(
      collection(db, 'destinations'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Destination[] = [];
          snap.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as Omit<Destination, 'id'>) });
          });
          setDestinations(loaded);
        }
        setIsDataLoading(false);
      },
      (error) => {
        console.warn('Realtime destinations fallback to initial data:', error);
        setIsDataLoading(false);
      }
    );

    const unsubPackages = onSnapshot(
      collection(db, 'tripPackages'),
      (snap) => {
        if (!snap.empty) {
          const loaded: TripPackage[] = [];
          snap.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as Omit<TripPackage, 'id'>) });
          });
          setTripPackages(loaded);
        }
      },
      (error) => console.warn('Packages snapshot notice:', error)
    );

    const unsubGuides = onSnapshot(
      collection(db, 'travelGuides'),
      (snap) => {
        if (!snap.empty) {
          const loaded: TravelGuide[] = [];
          snap.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as Omit<TravelGuide, 'id'>) });
          });
          setTravelGuides(loaded);
        }
      },
      (error) => console.warn('Guides snapshot notice:', error)
    );

    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Announcement[] = [];
          snap.forEach((doc) => {
            loaded.push({ id: doc.id, ...(doc.data() as Omit<Announcement, 'id'>) });
          });
          setAnnouncements(loaded);
        }
      },
      (error) => console.warn('Announcements snapshot notice:', error)
    );

    // Homepage content doc
    const unsubHome = onSnapshot(
      doc(db, 'homepageContent', 'settings'),
      (docSnap) => {
        if (docSnap.exists()) {
          setHomepageContent(docSnap.data() as HomepageContent);
        }
      },
      (error) => console.warn('Homepage settings notice:', error)
    );

    return () => {
      unsubDests();
      unsubPackages();
      unsubGuides();
      unsubAnnouncements();
      unsubHome();
    };
  }, []);

  // Admin-only listeners (Feedback and TripPlans)
  useEffect(() => {
    if (!isAdmin) return;

    const unsubFeedback = onSnapshot(
      collection(db, 'feedback'),
      (snap) => {
        const loaded: FeedbackSubmission[] = [];
        snap.forEach((doc) => {
          loaded.push({ id: doc.id, ...(doc.data() as Omit<FeedbackSubmission, 'id'>) });
        });
        setFeedbackList(loaded);
      },
      (err) => console.warn('Feedback listener notice:', err)
    );

    const unsubPlans = onSnapshot(
      collection(db, 'tripPlans'),
      (snap) => {
        const loaded: TripPlan[] = [];
        snap.forEach((doc) => {
          loaded.push({ id: doc.id, ...(doc.data() as Omit<TripPlan, 'id'>) });
        });
        setTripPlans(loaded);
      },
      (err) => console.warn('TripPlans listener notice:', err)
    );

    return () => {
      unsubFeedback();
      unsubPlans();
    };
  }, [isAdmin]);

  // Seed initial data to Firestore
  const seedInitialDataToFirestore = async () => {
    try {
      // Seed Destinations
      for (const dest of INITIAL_DESTINATIONS) {
        await setDoc(doc(db, 'destinations', dest.id), {
          ...dest,
          updatedAt: new Date().toISOString(),
        });
      }
      // Seed Packages
      for (const pkg of INITIAL_TRIP_PACKAGES) {
        await setDoc(doc(db, 'tripPackages', pkg.id), {
          ...pkg,
          updatedAt: new Date().toISOString(),
        });
      }
      // Seed Guides
      for (const guide of INITIAL_TRAVEL_GUIDES) {
        await setDoc(doc(db, 'travelGuides', guide.id), {
          ...guide,
          updatedAt: new Date().toISOString(),
        });
      }
      // Seed Announcements
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
      // Seed Homepage
      await setDoc(doc(db, 'homepageContent', 'settings'), INITIAL_HOMEPAGE_CONTENT);
      console.log('Initial sample data successfully seeded to Firestore!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'destinations/batch');
    }
  };

  // Admin Mutations
  const addOrUpdateDestination = async (dest: Destination) => {
    try {
      const docRef = doc(db, 'destinations', dest.id);
      await setDoc(docRef, { ...dest, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `destinations/${dest.id}`);
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'destinations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `destinations/${id}`);
    }
  };

  const addOrUpdatePackage = async (pkg: TripPackage) => {
    try {
      await setDoc(doc(db, 'tripPackages', pkg.id), pkg, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tripPackages/${pkg.id}`);
    }
  };

  const deletePackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tripPackages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tripPackages/${id}`);
    }
  };

  const addOrUpdateGuide = async (guide: TravelGuide) => {
    try {
      await setDoc(doc(db, 'travelGuides', guide.id), guide, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `travelGuides/${guide.id}`);
    }
  };

  const deleteGuide = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'travelGuides', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `travelGuides/${id}`);
    }
  };

  const updateHomepageContent = async (newContent: Partial<HomepageContent>) => {
    try {
      const updated = { ...homepageContent, ...newContent, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'homepageContent', 'settings'), updated, { merge: true });
      setHomepageContent(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'homepageContent/settings');
    }
  };

  const updateAnnouncement = async (ann: Announcement) => {
    try {
      await setDoc(doc(db, 'announcements', ann.id), ann, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `announcements/${ann.id}`);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  };

  // Public Submissions
  const submitFeedback = async (feedback: Omit<FeedbackSubmission, 'id' | 'createdAt'>) => {
    try {
      const id = 'fb-' + Date.now();
      const submission: FeedbackSubmission = {
        ...feedback,
        id,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'feedback', id), submission);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
    }
  };

  const saveTripPlanToDb = async (plan: TripPlan) => {
    try {
      const id = 'plan-' + Date.now();
      const planDoc: TripPlan = {
        ...plan,
        id,
        userId: user?.uid || 'guest',
        userEmail: user?.email || '',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'tripPlans', id), planDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tripPlans');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage: navigate,
        selectedDestinationId,
        setSelectedDestinationId,
        selectedGuideId,
        setSelectedGuideId,
        destinations,
        tripPackages,
        travelGuides,
        homepageContent,
        announcements,
        feedbackList,
        tripPlans,
        user,
        isAdmin,
        isAuthLoading,
        isDataLoading,
        firestoreConnected,
        addOrUpdateDestination,
        deleteDestination,
        addOrUpdatePackage,
        deletePackage,
        addOrUpdateGuide,
        deleteGuide,
        updateHomepageContent,
        updateAnnouncement,
        deleteAnnouncement,
        submitFeedback,
        saveTripPlanToDb,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
