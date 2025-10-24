import { useState } from 'react';
import { Search, ArrowRight, LogIn, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { LiveIdeasStream } from './components/LiveIdeasStream';
import { CategorizedIdeas } from './components/CategorizedIdeas';
import { RegisterDialog, UserData } from './components/RegisterDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
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

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 bg-white rounded-full shadow-sm border border-gray-200 px-6 py-4">
            <Search className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <Input
              type="text"
              placeholder="     What skills do I need to get promoted?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-lg px-0"
            />
            <Button 
              size="icon" 
              className="rounded-full bg-indigo-500 hover:bg-indigo-600 flex-shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Live Streaming Ideas */}
        <LiveIdeasStream isLoggedIn={isLoggedIn} />

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
