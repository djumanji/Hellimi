import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, LogIn, LogOut, Send, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { CategorizedIdeas } from './components/CategorizedIdeas';
import { RegisterDialog, UserData } from './components/RegisterDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { searchIdeas, submitIdea, getTopSectors } from './services/algoliaService';
import { isAlgoliaConfigured } from './algolia';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topSectors, setTopSectors] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load top sectors on component mount
  useEffect(() => {
    const loadTopSectors = async () => {
      try {
        const sectors = await getTopSectors();
        setTopSectors(sectors);
      } catch (error) {
        console.error('Error loading top sectors:', error);
        setTopSectors(['Culture', 'Economy', 'Environment', 'Governance', 'Social Policy']);
      }
    };
    loadTopSectors();
  }, []);

  // Real-time search as user types
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchResult = await searchIdeas(searchQuery);
        
        if (searchResult.success) {
          const results = searchResult.hits.map(hit => hit.title);
          setSearchResults(results);
          setHasSearched(true);
          setShowResults(true);
        } else {
          console.error('Search error:', searchResult.error);
          setSearchResults([]);
          setHasSearched(true);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setHasSearched(true);
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to hide results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRegister = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    setRegisterDialogOpen(false);
    toast.success(`Welcome, ${data.name} ${data.surname}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    toast.info('You have been logged out');
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      setRegisterDialogOpen(true);
    }
  };

  const handleSearch = () => {
    // Search is now handled by useEffect, just show results
    setShowResults(true);
  };

  const handleSectorClick = (sector: string) => {
    setSearchQuery(sector);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setShowResults(false);
  };

  const handleSubmitIdea = async () => {
    if (!searchQuery.trim()) return;
    
    if (!isLoggedIn) {
      setRegisterDialogOpen(true);
      return;
    }
    
    try {
      const ideaData = {
        title: searchQuery,
        description: `User submitted idea: ${searchQuery}`,
        category: 'User Submitted',
        tags: ['user-submitted'],
        author: userData ? `${userData.name} ${userData.surname}` : 'Anonymous'
      };
      
      // The submitIdea function now handles both Algolia and mock data automatically
      const result = await submitIdea(ideaData);
      
      if (result.success) {
        toast.success(`Idea submitted: "${searchQuery}"`);
      } else {
        toast.error('Failed to submit idea. Please try again.');
        console.error('Submission error:', result.error);
      }
      
      // Reset form
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit idea. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (hasSearched && searchResults.length === 0) {
        handleSubmitIdea();
      } else {
        handleSearch();
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Login/Logout Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          {isLoggedIn && userData && (
            <span className="text-sm text-gray-600">
              Hello, {userData.name} {userData.surname}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginClick}
            className="gap-2"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Register
              </>
            )}
          </Button>
        </div>

        {/* Register Dialog */}
        <RegisterDialog
          open={registerDialogOpen}
          onOpenChange={setRegisterDialogOpen}
          onRegister={handleRegister}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <a href="#" className="text-indigo-600 text-sm tracking-wide inline-block mb-4">
            A space for democracy for Cypriots
          </a>
          <h1 className="text-6xl mb-12">Hellimi</h1>
        </div>

        {/* Search and Submit Ideas */}
        <div className="relative mb-8" ref={searchContainerRef}>
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            {hasSearched && searchResults.length === 0 ? 'Submit your Idea' : 'Search for Ideas'}
          </h2>
          <div className="flex items-center gap-4 bg-gray-50 rounded-full shadow-sm border border-gray-200 px-6 py-4">
            <Search className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <Input
              type="text"
              placeholder={hasSearched && searchResults.length === 0 
                ? "Be nice. We don't accept racist or discriminatory suggestions."
                : "Search for action items..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 shadow-none focus-visible:ring-0 text-lg px-3 bg-transparent"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                onClick={clearSearch}
                className="rounded-full flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="icon" 
              onClick={hasSearched && searchResults.length === 0 ? handleSubmitIdea : handleSearch}
              className={`rounded-full flex-shrink-0 ${
                hasSearched && searchResults.length === 0 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : hasSearched && searchResults.length === 0 ? (
                <Send className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Top Sectors Tags */}
          {topSectors.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Popular sectors:</p>
              <div className="flex flex-wrap gap-2">
                {topSectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => handleSectorClick(sector)}
                    className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {showResults && hasSearched && searchResults.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Found {searchResults.length} idea{searchResults.length === 1 ? '' : 's'}:</h3>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{result}</h4>
                    <div className="text-xs text-gray-500">
                      {!isAlgoliaConfigured() && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                          Development Mode
                        </span>
                      )}
                      Click to learn more
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results - Submit Option */}
          {showResults && hasSearched && searchResults.length === 0 && (
            <div className="mt-4 bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 mb-2">
                No existing ideas found for "{searchQuery}"
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                Click the green button to submit this as a new idea, or try a different search term.
              </p>
              {!isAlgoliaConfigured() && (
                <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  🔧 Development Mode: Using mock data. Configure Algolia for real-time search.
                </div>
              )}
            </div>
          )}
        </div>


        {/* Categorized Ideas Section */}
        <CategorizedIdeas />

        </div>
      </div>
    </>
  );
}
