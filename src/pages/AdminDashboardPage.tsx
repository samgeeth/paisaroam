import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signInAdminWithGoogle, logOutAdmin, ADMIN_EMAIL } from '../lib/firebase';
import { Destination, TripPackage, TravelGuide, HomepageContent, Announcement } from '../types';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Smartphone,
  ExternalLink,
  MapPin,
  Package,
  BookOpen,
  LayoutTemplate,
  Bell,
  MessageSquare,
  Database,
  X,
  Camera,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    isAdmin,
    destinations,
    tripPackages,
    travelGuides,
    homepageContent,
    announcements,
    feedbackList,
    addOrUpdateDestination,
    deleteDestination,
    addOrUpdatePackage,
    deletePackage,
    addOrUpdateGuide,
    deleteGuide,
    updateHomepageContent,
    updateAnnouncement,
    deleteAnnouncement,
    seedInitialDataToFirestore,
    setCurrentPage,
  } = useApp();

  // Navigation tab for admin
  type AdminTab =
    | 'destinations'
    | 'packages'
    | 'guides'
    | 'homepage'
    | 'announcements'
    | 'feedback'
    | 'system';

  const [activeTab, setActiveTab] = useState<AdminTab>('destinations');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dev bypass toggle for local sandbox testing
  const [devAdminOverride, setDevAdminOverride] = useState(false);

  // Edit / Add modal states
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isNewDest, setIsNewDest] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit / Add Package states
  const [editingPackage, setEditingPackage] = useState<TripPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);

  // Edit / Add Guide states
  const [editingGuide, setEditingGuide] = useState<TravelGuide | null>(null);
  const [isNewGuide, setIsNewGuide] = useState(false);

  // Homepage form state
  const [homepageForm, setHomepageForm] = useState<HomepageContent>(homepageContent);

  // Announcement form state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isNewAnnouncement, setIsNewAnnouncement] = useState(false);

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const isAuthorized = isAdmin || devAdminOverride;

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const loggedUser = await signInAdminWithGoogle();
      if (
        loggedUser.email &&
        loggedUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
      ) {
        setAuthError(
          `Logged in as ${loggedUser.email}, but only the configured administrator (${ADMIN_EMAIL}) has admin rights.`
        );
      } else {
        showToast('Welcome Administrator!');
      }
    } catch (err: unknown) {
      console.error(err);
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google sign-in popup closed or cancelled. Use one-tap verification if in iframe.'
      );
    }
  };

  // --- DESTINATION CRUD ---
  const openNewDestination = () => {
    setIsNewDest(true);
    setEditingDest({
      id: 'dest-' + Date.now(),
      name: '',
      state: '',
      region: 'North',
      budgetPerPerson: 3000,
      idealDays: 3,
      bestSeason: 'October to March',
      travellerTypes: ['Friends', 'Solo'],
      categories: ['Historical', 'City'],
      heroImage:
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      images: [],
      description: '',
      highlights: ['Local street food walk', 'Heritage monument visit', 'Scenic sunset viewpoint'],
      transportEstimate: 800,
      stayEstimate: 1200,
      foodEstimate: 700,
      activityEstimate: 300,
      isFeatured: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
    });
  };

  const saveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest || !editingDest.name || !editingDest.state) {
      alert('Please fill out destination name and state');
      return;
    }
    setIsSaving(true);
    try {
      await addOrUpdateDestination(editingDest);
      setEditingDest(null);
      showToast(isNewDest ? 'Destination created & published!' : 'Destination updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to save destination. Check Firestore connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteDestination = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDestination(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Destination deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete destination.');
    }
  };

  // --- PACKAGE CRUD ---
  const openNewPackage = () => {
    setIsNewPackage(true);
    setEditingPackage({
      id: 'pkg-' + Date.now(),
      title: '',
      destinationName: destinations[0]?.name || 'Jaipur',
      days: 3,
      estimatedCost: 3000,
      tag: 'Weekend Deal',
      description: '',
      imageUrl: destinations[0]?.heroImage || '',
      highlights: ['Return sleeper tickets', 'Clean hostel dorm', 'Core sightseeing'],
      isPublished: true,
    });
  };

  const savePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editingPackage.title) return;
    setIsSaving(true);
    try {
      await addOrUpdatePackage(editingPackage);
      setEditingPackage(null);
      showToast('Trip package saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save package');
    } finally {
      setIsSaving(false);
    }
  };

  // --- GUIDE CRUD ---
  const openNewGuide = () => {
    setIsNewGuide(true);
    setEditingGuide({
      id: 'guide-' + Date.now(),
      title: '',
      slug: 'guide-' + Date.now(),
      category: 'Student Travel',
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1598977123418-454555aa166b?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      content: '',
      budgetTier: 'Under ₹2,000',
      tags: ['Budget', 'Travel'],
      author: 'Admin',
      isPublished: true,
    });
  };

  const saveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide || !editingGuide.title) return;
    setIsSaving(true);
    try {
      await addOrUpdateGuide(editingGuide);
      setEditingGuide(null);
      showToast('Travel guide published!');
    } catch (err) {
      console.error(err);
      alert('Failed to save guide');
    } finally {
      setIsSaving(false);
    }
  };

  // --- HOMEPAGE UPDATE ---
  const saveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateHomepageContent(homepageForm);
      showToast('Homepage hero, banners & contacts updated live!');
    } catch (err) {
      console.error(err);
      alert('Failed to update homepage');
    } finally {
      setIsSaving(false);
    }
  };

  // --- ANNOUNCEMENT CRUD ---
  const openNewAnnouncement = () => {
    setIsNewAnnouncement(true);
    setEditingAnnouncement({
      id: 'ann-' + Date.now(),
      title: 'Site Notice',
      message: '',
      type: 'deal',
      isActive: true,
      linkText: 'Check Spots',
      linkUrl: '#explore',
    });
  };

  const saveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.message) return;
    setIsSaving(true);
    try {
      await updateAnnouncement(editingAnnouncement);
      setEditingAnnouncement(null);
      showToast('Announcement banner updated live!');
    } catch (err) {
      console.error(err);
      alert('Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIN SCREEN IF NOT AUTHORIZED ---
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#174C3C] text-[#F28C45] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#202B27]">PAISAROAM Mobile Admin</h1>
            <p className="text-xs text-gray-500 mt-1">
              Authorized Website Administrator Access Portal
            </p>
          </div>

          <div className="p-3.5 bg-[#FFF8ED] rounded-2xl border border-[#4F8063]/30 text-xs text-gray-700 space-y-1 text-left">
            <span className="font-bold text-[#174C3C] block">Owner Security Policy:</span>
            <span>Only configured owner <strong>Sangeeth</strong> (<strong className="text-gray-900">{ADMIN_EMAIL}</strong> • <strong>+91 7569283697</strong>) can modify destinations, prices, articles, and hero banners.</span>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs text-left">
              {authError}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#174C3C] hover:bg-[#0F3328] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-transform active:scale-95 flex items-center justify-center space-x-2 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              <span>Sign In with Owner Google Account</span>
            </button>

            {/* Emergency / Dev Verification Toggle for Preview iframe */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setDevAdminOverride(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#F28C45]" />
                <span>Verify & Test Admin Control as {ADMIN_EMAIL}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-400">
            Protected by Firebase Authentication & Firestore ABAC Rules
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED MOBILE ADMIN DASHBOARD ---
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#174C3C] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top border border-emerald-500">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Mobile Bar: Owner Identity & Quick Public Preview */}
      <div className="bg-[#174C3C] text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F28C45] text-white flex items-center justify-center font-black text-lg shrink-0">
            ₹
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-base sm:text-lg">PAISAROAM Mobile Admin</h1>
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-[#FFF8ED]/80 truncate max-w-sm">
              Logged in: <strong>Sangeeth ({user?.email || ADMIN_EMAIL})</strong> • <strong>+91 7569283697</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors border border-white/20"
          >
            <Eye className="w-3.5 h-3.5 text-[#F28C45]" />
            <span>Preview Public Site</span>
          </button>

          <button
            onClick={async () => {
              setDevAdminOverride(false);
              await logOutAdmin();
            }}
            className="bg-black/30 hover:bg-black/40 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Navigation Tabs (Touch Scrollable) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'destinations'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#F28C45]" />
          <span>Destinations ({destinations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'packages'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4 text-[#F28C45]" />
          <span>Trip Packages ({tripPackages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'guides'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#F28C45]" />
          <span>Guides & Blog ({travelGuides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'homepage'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <LayoutTemplate className="w-4 h-4 text-[#F28C45]" />
          <span>Homepage Hero & Info</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'announcements'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Bell className="w-4 h-4 text-[#F28C45]" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'feedback'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#F28C45]" />
          <span>Feedback / Queries ({feedbackList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
            activeTab === 'system'
              ? 'bg-[#174C3C] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Database className="w-4 h-4 text-[#F28C45]" />
          <span>Database & Mobile Sync</span>
        </button>
      </div>

      {/* --- TAB 1: DESTINATIONS MANAGER --- */}
      {activeTab === 'destinations' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202B27]">Manage Destinations</h2>
            <button
              onClick={openNewDestination}
              className="bg-[#F28C45] hover:bg-[#d97531] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-14 h-14 object-cover rounded-xl shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-sm text-[#202B27] truncate">{dest.name}</h3>
                      {dest.isPublished === false && (
                        <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{dest.state} • {dest.idealDays}d</div>
                    <div className="text-xs font-bold text-[#174C3C]">
                      ₹{dest.budgetPerPerson} / person
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-gray-400 text-[10px]">
                    Stay: ₹{dest.stayEstimate} • Food: ₹{dest.foodEstimate}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsNewDest(false);
                        setEditingDest({ ...dest });
                      }}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      title="Edit Destination"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(dest.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: PACKAGES MANAGER --- */}
      {activeTab === 'packages' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202B27]">Trip Packages & Bundles</h2>
            <button
              onClick={openNewPackage}
              className="bg-[#F28C45] hover:bg-[#d97531] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tripPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-[#202B27]">{pkg.title}</h3>
                    <span className="text-[10px] bg-[#F28C45]/20 text-[#F28C45] font-bold px-2 py-0.5 rounded">
                      {pkg.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {pkg.destinationName} • {pkg.days} Days • ₹{pkg.estimatedCost} total
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsNewPackage(false);
                      setEditingPackage({ ...pkg });
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePackage(pkg.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: GUIDES MANAGER --- */}
      {activeTab === 'guides' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202B27]">Travel Guides & Articles</h2>
            <button
              onClick={openNewGuide}
              className="bg-[#F28C45] hover:bg-[#d97531] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Write Guide</span>
            </button>
          </div>

          <div className="space-y-3">
            {travelGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-[#202B27]">{guide.title}</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                      {guide.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    By {guide.author} • {guide.budgetTier} • {guide.readTime}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsNewGuide(false);
                      setEditingGuide({ ...guide });
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGuide(guide.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: HOMEPAGE HERO & BRANDING EDITOR --- */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200 space-y-6 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-[#202B27]">Homepage Hero & Contact Info</h2>
            <p className="text-xs text-gray-500">
              Update headline copy, WhatsApp link, and promo banners without touching code.
            </p>
          </div>

          <form onSubmit={saveHomepage} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Hero Heading (Main Title)
              </label>
              <input
                type="text"
                required
                value={homepageForm.heroHeading}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroHeading: e.target.value })}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#174C3C] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Hero Subtitle (Mission / Tagline statement)
              </label>
              <textarea
                rows={3}
                value={homepageForm.heroSubtitle}
                onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Promo Alert Banner Message
              </label>
              <input
                type="text"
                value={homepageForm.promoBannerText}
                onChange={(e) =>
                  setHomepageForm({ ...homepageForm, promoBannerText: e.target.value })
                }
                className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={homepageForm.contactEmail}
                  onChange={(e) =>
                    setHomepageForm({ ...homepageForm, contactEmail: e.target.value })
                  }
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={homepageForm.contactPhone}
                  onChange={(e) =>
                    setHomepageForm({ ...homepageForm, contactPhone: e.target.value })
                  }
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={homepageForm.contactWhatsapp}
                  onChange={(e) =>
                    setHomepageForm({ ...homepageForm, contactWhatsapp: e.target.value })
                  }
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#174C3C] hover:bg-[#0F3328] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-[#F28C45]" />
              <span>{isSaving ? 'Saving...' : 'Save Homepage Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* --- TAB 5: ANNOUNCEMENTS MANAGER --- */}
      {activeTab === 'announcements' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202B27]">Site-Wide Top Alert Banners</h2>
            <button
              onClick={openNewAnnouncement}
              className="bg-[#F28C45] hover:bg-[#d97531] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#202B27]">{ann.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ann.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{ann.message}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsNewAnnouncement(false);
                      setEditingAnnouncement({ ...ann });
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: FEEDBACK & INQUIRIES --- */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200 space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-[#202B27]">User Feedback & Inquiries</h2>
            <p className="text-xs text-gray-500">
              Messages submitted through the public Contact and Feedback forms.
            </p>
          </div>

          {feedbackList.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">
              No feedback submissions received yet.
            </p>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((fb, idx) => (
                <div key={fb.id || idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-[#174C3C] text-sm">{fb.name}</strong>
                    <span className="text-gray-400">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{fb.email} • Subject: {fb.subject}</div>
                  <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-xl border border-gray-100">
                    "{fb.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 7: DATABASE & MOBILE SYNC --- */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200 space-y-6 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-[#202B27]">Database Sync & Android Phone Controls</h2>
            <p className="text-xs text-gray-500">
              Manage live Firestore collections and install this dashboard as a standalone Android app.
            </p>
          </div>

          {/* Seed Initial Data Button */}
          <div className="p-4 bg-[#FFF8ED] rounded-2xl border border-[#4F8063]/30 space-y-3">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-[#F28C45]" />
              <h3 className="font-bold text-sm text-[#174C3C]">
                Sync Initial India Sample Data to Cloud Firestore
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Push all 10+ vetted Indian destinations (Jaipur, Udaipur, Goa, Manali, Rishikesh, Hampi, Varanasi, Jaisalmer, Lonavala, Gokarna), travel guides, and trip packages straight to your Firestore database.
            </p>
            <button
              onClick={async () => {
                setIsSaving(true);
                try {
                  await seedInitialDataToFirestore();
                  showToast('Initial India destinations & guides synced to Firestore!');
                } catch (err) {
                  console.error(err);
                  alert('Sync notice: check Firestore security rules.');
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="bg-[#174C3C] hover:bg-[#0F3328] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Syncing...' : 'Sync Sample Data to Firestore'}</span>
            </button>
          </div>

          {/* Android Mobile Management Guide */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-[#174C3C]" />
              <h3 className="font-bold text-sm text-[#202B27]">
                How to Manage PAISAROAM from Your Android Phone
              </h3>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-700 leading-relaxed">
              <li>Open Chrome on your Android smartphone and navigate to your deployed domain (e.g. <code>https://paisaroam.com/#admin</code>).</li>
              <li>Tap the three dots (<strong>⋮</strong>) in the top-right corner of Chrome.</li>
              <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</li>
              <li>A native PAISAROAM icon will be pinned to your home screen! Tap it anytime to add destinations, update ticket rates, or change hero banners on the go.</li>
            </ol>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT / ADD DESTINATION (PHONE-FIRST FORM) --- */}
      {editingDest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 space-y-5 relative text-[#202B27]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-lg text-[#174C3C]">
                {isNewDest ? 'Add New Destination' : `Edit ${editingDest.name}`}
              </h3>
              <button
                onClick={() => setEditingDest(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveDestination} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={editingDest.name}
                    onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#174C3C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editingDest.state}
                    onChange={(e) => setEditingDest({ ...editingDest, state: e.target.value })}
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#174C3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Budget / Person (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingDest.budgetPerPerson}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        budgetPerPerson: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#F28C45]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Ideal Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editingDest.idealDays}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, idealDays: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Region</label>
                  <select
                    value={editingDest.region}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, region: e.target.value as any })
                    }
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-2 py-2 text-xs font-bold text-gray-800"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                    <option value="East">East</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              </div>

              {/* Price Benchmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Transport (₹)</label>
                  <input
                    type="number"
                    value={editingDest.transportEstimate}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        transportEstimate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Stay / Night (₹)</label>
                  <input
                    type="number"
                    value={editingDest.stayEstimate}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, stayEstimate: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Food / Day (₹)</label>
                  <input
                    type="number"
                    value={editingDest.foodEstimate}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, foodEstimate: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Activities (₹)</label>
                  <input
                    type="number"
                    value={editingDest.activityEstimate}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        activityEstimate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-bold"
                  />
                </div>
              </div>

              {/* Photograph URL */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Cover Photo URL (Phone Gallery / Web link)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingDest.heroImage}
                    onChange={(e) => setEditingDest({ ...editingDest, heroImage: e.target.value })}
                    className="flex-1 bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    placeholder="https://..."
                  />
                  {editingDest.heroImage && (
                    <img
                      src={editingDest.heroImage}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Best Season */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Best Months</label>
                <input
                  type="text"
                  value={editingDest.bestSeason}
                  onChange={(e) => setEditingDest({ ...editingDest, bestSeason: e.target.value })}
                  placeholder="e.g. October to March"
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingDest.description}
                  onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                  className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingDest.isPublished}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#174C3C]"
                  />
                  <span>Published Live</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingDest.isFeatured}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#F28C45]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingDest(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#174C3C] hover:bg-[#0F3328] text-white font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#F28C45]" />
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Destination'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">Confirm Deletion</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this destination from PAISAROAM? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDestination}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
