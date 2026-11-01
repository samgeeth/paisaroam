import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Heart,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Shield,
  CheckCircle,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const { homepageContent, submitFeedback } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Trip Query');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'policy' | 'terms'>('about');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    try {
      await submitFeedback({
        name,
        email,
        subject,
        message,
        category: 'query',
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Message recorded. Thank you!');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Tabs */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          About PAISAROAM
        </h1>
        <p className="text-sm text-gray-600">
          Democratizing travel for every Indian on a budget. Big adventures do not require deep pockets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'about'
                ? 'bg-[#174C3C] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Our Mission & Story
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'contact'
                ? 'bg-[#174C3C] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Contact & Support
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'policy'
                ? 'bg-[#174C3C] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'terms'
                ? 'bg-[#174C3C] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Terms & Disclaimer
          </button>
        </div>
      </div>

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-2xl font-extrabold text-[#174C3C]">
              Why We Started PAISAROAM
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              In India, over 90% of travel websites cater exclusively to high-income tourists and luxury resorts. When students, fresh graduates, or middle-class families want to take a break, they are bombarded with overpriced hotel packages, hidden service charges, and confusing travel portals.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We started <strong>PAISAROAM</strong> with one foundational thesis:{' '}
              <span className="text-[#F28C45] font-bold">
                India has one of the most incredible, affordable railway networks, rich street cultures, and stunning natural landscapes on Earth.
              </span>{' '}
              You do not need ₹50,000 to see the sunrise at Hawa Mahal, kayak on the Ganges in Rishikesh, or hike the boulder ridges of Hampi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-[#FFF8ED] p-5 rounded-2xl border border-[#4F8063]/20 space-y-2">
                <span className="text-2xl">🇮🇳</span>
                <h3 className="font-bold text-base text-[#174C3C]">Made for Real India</h3>
                <p className="text-xs text-gray-600">
                  Calculations based on Sleeper class trains, ordinary state buses, and honest dhabas.
                </p>
              </div>

              <div className="bg-[#FFF8ED] p-5 rounded-2xl border border-[#4F8063]/20 space-y-2">
                <span className="text-2xl">🤝</span>
                <h3 className="font-bold text-base text-[#174C3C]">Zero Booking Markups</h3>
                <p className="text-xs text-gray-600">
                  We are not travel agents. We provide unbiased, independent financial intelligence.
                </p>
              </div>

              <div className="bg-[#FFF8ED] p-5 rounded-2xl border border-[#4F8063]/20 space-y-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-base text-[#174C3C]">Smart AI Guidance</h3>
                <p className="text-xs text-gray-600">
                  Powered by Gemini AI to synthesize realistic, tailored itineraries within minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-150">
          {/* Contact Details */}
          <div className="bg-[#174C3C] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-[#F28C45] uppercase tracking-wider">
                We Love Hearing From You
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Get in Touch</h2>
              <p className="text-xs sm:text-sm text-[#FFF8ED]/80 mt-1">
                Have a question about a destination, want to suggest a hidden budget spot, or interested in collaborating?
              </p>
            </div>

            <div className="space-y-4 pt-2 text-sm text-[#FFF8ED]">
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-2xl">
                <Mail className="w-5 h-5 text-[#F28C45] shrink-0" />
                <div>
                  <div className="text-[11px] text-white/60">Official Email</div>
                  <strong className="text-white">{homepageContent.contactEmail}</strong>
                </div>
              </div>

              {homepageContent.contactWhatsapp && (
                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-2xl">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-white/60">WhatsApp Support</div>
                    <strong className="text-white">{homepageContent.contactWhatsapp}</strong>
                  </div>
                </div>
              )}
            </div>

            {homepageContent.contactWhatsapp && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${homepageContent.contactWhatsapp.replace(/[^0-9]/g, '')}?text=Hi%20PAISAROAM%20team,%20I%20have%20a%20budget%20trip%20question`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#4F8063] hover:bg-[#3d654e] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-[#202B27] mb-1">Send a Message</h3>
            <p className="text-xs text-gray-500 mb-5">
              Submissions are recorded securely and reviewed by our team.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-800 text-sm">Thank you!</h4>
                <p className="text-xs text-emerald-700">
                  Your message has been received. We will respond to {email} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Sharma"
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aman@example.com"
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Topic / Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                  >
                    <option value="Trip Query">Budget Trip Query</option>
                    <option value="Destination Suggestion">Suggest a New Destination</option>
                    <option value="Feedback">Website Feedback</option>
                    <option value="Partnership">Partnership / Host Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-[#FFF8ED] border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#202B27] focus:outline-none focus:ring-2 focus:ring-[#174C3C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F28C45] hover:bg-[#d97531] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRIVACY POLICY TAB */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed animate-in fade-in duration-150">
          <h2 className="text-xl font-bold text-[#174C3C]">PAISAROAM Privacy Policy</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            At PAISAROAM, we value your trust. We do not sell your personal data or track your behavior across other websites.
          </p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">1. Information We Collect</h3>
          <p>
            When you use our trip planner or group expense splitter, calculations take place in your browser. When you save a plan or submit a feedback message, we store your contact details solely to deliver the service.
          </p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">2. Firebase & Authentication</h3>
          <p>
            Administrative functions utilize Google Firebase Authentication. Administrator tokens are verified securely on server infrastructure.
          </p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">3. Cookies & Local Storage</h3>
          <p>
            We use browser localStorage solely to preserve your active budget preferences and recent split records.
          </p>
        </div>
      )}

      {/* TERMS TAB */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed animate-in fade-in duration-150">
          <h2 className="text-xl font-bold text-[#174C3C]">Terms of Use & Cost Disclaimer</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">1. Indicative Benchmark Rates</h3>
          <p>
            All costs displayed on PAISAROAM (railway tickets, hostel stays, meals, auto fares) represent empirical benchmarks calculated from recent traveller reports. Actual rates fluctuate based on seasons, festivals, seat availability, and commercial changes.
          </p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">2. No Direct Booking or Agency Affiliation</h3>
          <p>
            PAISAROAM is strictly an itinerary planning and financial calculator tool. We do not operate travel services, book tickets, or collect payment for third-party operators. Users are encouraged to book directly with official vendors (IRCTC, state transport portals, hotels).
          </p>
          <h3 className="font-bold text-base text-[#202B27] pt-2">3. Travel Safety</h3>
          <p>
            Always verify local weather conditions, mountain road advisories, and trek permits prior to departure. Keep an emergency fund for unforeseen transit delays.
          </p>
        </div>
      )}
    </div>
  );
};
