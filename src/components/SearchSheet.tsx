import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, Clock } from 'lucide-react';

interface SearchSheetProps {
  isVisible: boolean;
  searchQuery: string;
  searchResults: string[];
  topSectors: string[];
  isSearching: boolean;
  onResultClick: (result: string) => void;
  onSectorClick: (sector: string) => void;
  onClose: () => void;
}

export const SearchSheet: React.FC<SearchSheetProps> = ({
  isVisible,
  searchQuery,
  searchResults,
  topSectors,
  isSearching,
  onResultClick,
  onSectorClick,
  onClose
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sheetRef.current) return;

    const ctx = gsap.context(() => {
      if (isVisible) {
        // Sheet entrance animation
        gsap.fromTo(sheetRef.current, 
          {
            y: -20,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              // Animate results in with stagger
              if (resultsRef.current) {
                const resultItems = resultsRef.current.querySelectorAll('.result-item');
                gsap.fromTo(resultItems,
                  {
                    opacity: 0,
                    y: 10
                  },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    stagger: 0.05,
                    ease: "power2.out"
                  }
                );
              }

              // Animate tags in after results
              if (tagsRef.current) {
                const tagItems = tagsRef.current.querySelectorAll('.tag-item');
                gsap.fromTo(tagItems,
                  {
                    opacity: 0,
                    scale: 0.8
                  },
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.15,
                    stagger: 0.03,
                    ease: "back.out(1.2)",
                    delay: 0.1
                  }
                );
              }
            }
          }
        );

        // Overlay fade in
        gsap.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        // Sheet exit animation
        gsap.to(sheetRef.current, {
          y: -20,
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in"
        });

        // Overlay fade out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    });

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Search Sheet */}
      <div
        ref={sheetRef}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
        style={{ maxHeight: '70vh' }}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1 text-gray-900 text-lg">
            {searchQuery || 'Search for action items...'}
          </div>
          {isSearching && (
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Results Section */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div ref={resultsRef} className="p-2">
              {searchResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="result-item flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  onClick={() => onResultClick(result)}
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {result}
                  </span>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="p-6 text-center">
              <div className="text-gray-500 mb-2">No results found for "{searchQuery}"</div>
              <div className="text-sm text-gray-400">
                Try a different search term or check the popular sectors below
              </div>
            </div>
          ) : null}
        </div>

        {/* Popular Sectors */}
        {topSectors.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <div className="text-sm text-gray-600 mb-3 font-medium">Popular sectors:</div>
            <div ref={tagsRef} className="flex flex-wrap gap-2">
              {topSectors.map((sector) => (
                <button
                  key={sector}
                  className="tag-item px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                  onClick={() => onSectorClick(sector)}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
