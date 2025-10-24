import { useState } from 'react';
import { Search, ArrowRight, LogIn, LogOut, Send } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { CategorizedIdeas } from './components/CategorizedIdeas';
import { RegisterDialog, UserData } from './components/RegisterDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Simulate search - in a real app, this would call an API
    const mockResults = [
      "Leadership skills development",
      "Technical certification programs",
      "Mentorship opportunities",
      "Cross-functional project experience"
    ];
    
    // Filter results based on search query
    const filteredResults = mockResults.filter(result => 
      result.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredResults);
    setHasSearched(true);
    
    if (filteredResults.length === 0) {
      toast.info("No existing ideas found. You can submit this as a new idea!");
    }
  };

  const handleSubmitIdea = () => {
    if (!searchQuery.trim()) return;
    
    if (!isLoggedIn) {
      setRegisterDialogOpen(true);
      return;
    }
    
    // Simulate idea submission
    toast.success(`Idea submitted: "${searchQuery}"`);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Found {searchResults.length} ideas:</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* No Results - Submit Option */}
          {hasSearched && searchResults.length === 0 && (
            <div className="mt-4 bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 mb-2">
                No existing ideas found for "{searchQuery}"
              </p>
              <p className="text-xs text-yellow-700">
                Click the green button to submit this as a new idea, or try a different search term.
              </p>
            </div>
          )}
        </div>


        {/* Categorized Ideas Section */}
        <CategorizedIdeas />

        {/* Marketing Content */}
        <div className="text-center mt-20">
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
            HR teams spend 57% of their time on manual tasks.
            <br />
            Get time back with fast, reliable support that
            <br />
            transforms HR from reactive to proactive.
          </p>
          <Button 
            variant="outline" 
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 rounded-full px-8"
          >
            Learn more
          </Button>
        </div>
        </div>
      </div>
    </>
  );
}
