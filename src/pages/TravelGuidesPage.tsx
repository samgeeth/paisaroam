import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TravelGuide } from '../types';
import {
  BookOpen,
  Clock,
  Tag,
  User,
  ArrowRight,
  X,
  Share2,
  Bookmark,
  Calendar,
} from 'lucide-react';

export const TravelGuidesPage: React.FC = () => {
  const { travelGuides, selectedGuideId, setSelectedGuideId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Student Travel',
    'Weekend Trips',
    'Trips under ₹1,000',
    'Trips under ₹2,000',
    'Trips under ₹5,000',
    'Travel Tips',
    'Family Travel',
    'Hidden Destinations',
  ];

  const filteredGuides = travelGuides.filter((g) => {
    if (g.isPublished === false) return false;
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    return true;
  });

  const activeGuide = travelGuides.find((g) => g.id === selectedGuideId) || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#F28C45]/10 text-[#F28C45] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Frugal Travel Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B27]">
          Travel Guides & Budget Hacks
        </h1>
        <p className="text-sm text-gray-600">
          Field-tested routes, Indian Railways booking secrets, and real rupee spending diaries from college students and smart explorers.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-[#174C3C] text-white shadow-sm'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setSelectedGuideId(guide.id)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 cursor-pointer group flex flex-col justify-between transition-all transform hover:-translate-y-1"
          >
            <div>
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#174C3C]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {guide.category}
                </div>
                <div className="absolute top-3 right-3 bg-[#F28C45] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                  {guide.budgetTier}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTime}</span>
                  <span>•</span>
                  <span>By {guide.author}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#202B27] group-hover:text-[#174C3C] transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs text-[#F28C45] font-bold">
              <span>Read Full Breakdown</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Full Guide Detail Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-[#202B27]">
            <button
              onClick={() => setSelectedGuideId(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-60 sm:h-72 w-full bg-gray-100">
              <img
                src={activeGuide.coverImage}
                alt={activeGuide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center space-x-2 text-xs text-[#F28C45] font-bold">
                  <span>{activeGuide.category}</span>
                  <span>•</span>
                  <span>{activeGuide.budgetTier}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black leading-snug">
                  {activeGuide.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#4F8063]" />
                  <span>Written by <strong className="text-gray-800">{activeGuide.author}</strong></span>
                </div>
                <span>{activeGuide.readTime}</span>
              </div>

              {/* Formatted Content */}
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 whitespace-pre-line text-xs sm:text-sm">
                {activeGuide.content}
              </div>

              {/* Tags */}
              {activeGuide.tags && (
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
                  {activeGuide.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
