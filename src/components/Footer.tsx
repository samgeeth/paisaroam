import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Heart, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, homepageContent } = useApp();

  return (
    <footer className="bg-[#174C3C] text-white pt-12 pb-24 lg:pb-12 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F28C45] flex items-center justify-center shadow-inner">
                <span className="text-white font-extrabold text-lg">₹</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                PAISA<span className="text-[#F28C45]">ROAM</span>
              </span>
            </div>
            <p className="text-sm text-[#FFF8ED]/80 leading-relaxed max-w-sm">
              Big Adventures. Small Budgets. Built to help Indian students, young friends, and middle-class families discover authentic trips without getting ripped off.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center text-xs bg-white/10 px-3 py-1 rounded-full text-[#FFF8ED]">
                <Shield className="w-3.5 h-3.5 text-[#F28C45] mr-1.5" />
                100% Free & Transparent
              </span>
              <span className="inline-flex items-center text-xs bg-white/10 px-3 py-1 rounded-full text-[#FFF8ED]">
                🇮🇳 Designed for India
              </span>
            </div>
          </div>

          {/* Planning Tools */}
          <div>
            <h4 className="text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-4">
              Planning Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFF8ED]/80">
              <li>
                <button
                  onClick={() => setCurrentPage('planner')}
                  className="hover:text-white transition-colors"
                >
                  Smart AI Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('calculator')}
                  className="hover:text-white transition-colors"
                >
                  Interactive Budget Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('splitter')}
                  className="hover:text-white transition-colors"
                >
                  Group Expense Splitter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('compare')}
                  className="hover:text-white transition-colors"
                >
                  Trip Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('explore')}
                  className="hover:text-white transition-colors"
                >
                  Explore Destinations
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div>
            <h4 className="text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-4">
              Guides & Stories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFF8ED]/80">
              <li>
                <button
                  onClick={() => setCurrentPage('guides')}
                  className="hover:text-white transition-colors"
                >
                  Weekend Getaways
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('guides')}
                  className="hover:text-white transition-colors"
                >
                  Trips Under ₹2,000
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('guides')}
                  className="hover:text-white transition-colors"
                >
                  Student Travel Hacks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="hover:text-white transition-colors"
                >
                  About PAISAROAM
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (Editable from Admin) */}
          <div>
            <h4 className="text-xs font-bold text-[#F28C45] uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FFF8ED]/80">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#F28C45] shrink-0" />
                <span className="truncate">{homepageContent.contactEmail}</span>
              </li>
              {homepageContent.contactPhone && (
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#F28C45] shrink-0" />
                  <span>{homepageContent.contactPhone}</span>
                </li>
              )}
              {homepageContent.contactWhatsapp && (
                <li className="pt-1">
                  <a
                    href={`https://wa.me/${homepageContent.contactWhatsapp.replace(/[^0-9]/g, '')}?text=Hi%20PAISAROAM%20team,%20I%20have%20a%20budget%20trip%20query`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-[#4F8063] hover:bg-[#3d654e] text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </a>
                </li>
              )}
              <li className="pt-2">
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="text-xs text-[#FFF8ED]/60 hover:text-[#FFF8ED] underline flex items-center space-x-1"
                >
                  <span>Website Admin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-[#FFF8ED]/70 leading-relaxed bg-black/15 p-4 rounded-xl">
          <p className="font-semibold text-white/90 mb-1">
            Important Travel Estimate Disclaimer:
          </p>
          <p>
            PAISAROAM is a travel discovery, budget calculation, and itinerary planning platform. All monetary figures and accommodation/transport estimates are realistic, community-vetted benchmarks intended to guide planning. PAISAROAM does not sell confirmed tickets, make bookings, or guarantee railway or airline tariffs. Always check official IRCTC, state transport, and property booking portals before embarking on your journey.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8ED]/60">
          <p>© {new Date().getFullYear()} PAISAROAM. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <button onClick={() => setCurrentPage('about')} className="hover:text-white">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('about')} className="hover:text-white">Terms of Use</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('about')} className="hover:text-white">Cost Methodology</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
