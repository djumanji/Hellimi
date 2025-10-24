import { useState } from 'react';
import { Search, ArrowRight, LogIn, LogOut, Send } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { CategorizedIdeas } from './components/CategorizedIdeas';
import { RegisterDialog, UserData } from './components/RegisterDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { searchIdeas, submitIdea } from './services/algoliaService';
import { isAlgoliaConfigured } from './algolia';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      // The searchIdeas function now handles both Algolia and mock data automatically
      const searchResult = await searchIdeas(searchQuery);
      
      if (searchResult.success) {
        const results = searchResult.hits.map(hit => hit.title);
        setSearchResults(results);
        setHasSearched(true);
        
        if (results.length === 0) {
          toast.info("No existing ideas found. You can submit this as a new idea!");
        } else {
          toast.success(`Found ${results.length} idea${results.length === 1 ? '' : 's'}`);
        }
      } else {
        console.error('Search error:', searchResult.error);
        toast.error('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    }
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
        <div className="relative mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            {hasSearched && searchResults.length === 0 ? 'Submit your Idea' : 'Search for Ideas'}
          </h2>
          <div className="flex items-center gap-4 bg-gray-50 rounded-full shadow-sm border border-gray-200 px-6 py-4">
            <Search className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <Input
              type="text"
              placeholder={hasSearched && searchResults.length === 0 
                ? "Be nice. We don't accept racist or discriminatory suggestions."
                : "What skills do I need to get promoted?"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 shadow-none focus-visible:ring-0 text-lg px-3 bg-transparent"
            />
            <Button 
              size="icon" 
              onClick={hasSearched && searchResults.length === 0 ? handleSubmitIdea : handleSearch}
              className={`rounded-full flex-shrink-0 ${
                hasSearched && searchResults.length === 0 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {hasSearched && searchResults.length === 0 ? (
                <Send className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Search Results */}
          {hasSearched && searchResults.length > 0 && (
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
          {hasSearched && searchResults.length === 0 && (
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
