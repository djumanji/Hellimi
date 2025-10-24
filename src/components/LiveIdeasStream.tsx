import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, TrendingUp, Users, Target, BookOpen, Rocket, Send } from 'lucide-react';
import { generateMultipleNicknames } from '../utils/nickname-generator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

const activeUsers = [
  'Sarah Chen',
  'Marcus Johnson',
  'Emily Rodriguez',
  'David Kim',
  'Priya Patel'
];

interface LiveIdeasStreamProps {
  isLoggedIn: boolean;
}

const ideasPool = [
  { 
    icon: Lightbulb, 
    text: "Develop technical skills through online courses and certifications",
    color: "text-yellow-600 bg-yellow-50"
  },
  { 
    icon: TrendingUp, 
    text: "Take on cross-functional projects to broaden experience",
    color: "text-green-600 bg-green-50"
  },
  { 
    icon: Users, 
    text: "Build relationships with senior leaders in your department",
    color: "text-blue-600 bg-blue-50"
  },
  { 
    icon: Target, 
    text: "Set clear career goals with your manager during 1-on-1s",
    color: "text-purple-600 bg-purple-50"
  },
  { 
    icon: BookOpen, 
    text: "Mentor junior team members to demonstrate leadership",
    color: "text-indigo-600 bg-indigo-50"
  },
  { 
    icon: Rocket, 
    text: "Volunteer for high-visibility initiatives and presentations",
    color: "text-rose-600 bg-rose-50"
  },
  { 
    icon: Lightbulb, 
    text: "Request feedback regularly and act on improvement areas",
    color: "text-orange-600 bg-orange-50"
  },
  { 
    icon: TrendingUp, 
    text: "Document your achievements and impact for performance reviews",
    color: "text-teal-600 bg-teal-50"
  },
];

export function LiveIdeasStream({ isLoggedIn }: LiveIdeasStreamProps) {
  const [ideas, setIdeas] = useState<typeof ideasPool>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [ideaInput, setIdeaInput] = useState('');
  
  // Generate random nicknames for logged-out users (memoized to keep them consistent)
  const anonymousUsers = useMemo(() => generateMultipleNicknames(5), []);
  
  // Use real names if logged in, otherwise use generated nicknames
  const userPool = isLoggedIn ? activeUsers : anonymousUsers;

  const handleIdeaSubmit = () => {
    if (!ideaInput.trim()) {
      toast.error('Please enter an idea');
      return;
    }

    console.log('New idea submitted:', ideaInput);
    setIdeaInput('');
    toast.success('Your idea has been submitted!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleIdeaSubmit();
    }
  };

  useEffect(() => {
    // Shuffle ideas
    const shuffled = [...ideasPool].sort(() => Math.random() - 0.5);
    setIdeas(shuffled);
    
    // Start streaming ideas
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < shuffled.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate people typing
    const updateTypingUsers = () => {
      if (visibleCount >= ideas.length) {
        setTypingUsers([]);
        return;
      }

      // Randomly add/remove typing users
      const numTyping = Math.floor(Math.random() * 3) + 1; // 1-3 people typing
      const shuffledUsers = [...userPool].sort(() => Math.random() - 0.5);
      setTypingUsers(shuffledUsers.slice(0, numTyping));
    };

    updateTypingUsers();
    const interval = setInterval(updateTypingUsers, 2000);

    return () => clearInterval(interval);
  }, [visibleCount, ideas.length, userPool]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-[300px]">
      {/* Idea Entry Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 bg-gray-50 rounded-full border border-gray-200 px-6 py-4">
          <Input
            type="text"
            placeholder="     Be nice. We don't accept racist or discriminatory suggestions."
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent"
          />
          <Button
            size="icon"
            onClick={handleIdeaSubmit}
            className="rounded-full bg-green-500 hover:bg-green-600 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
        <span className="text-sm text-gray-600">Live Ideas Stream</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {ideas.slice(0, visibleCount).map((idea, index) => {
            const Icon = idea.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ 
                  duration: 0.4,
                  ease: 'easeOut'
                }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${idea.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-gray-700 pt-1">{idea.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleCount < ideas.length && typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 text-sm pl-3"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...`
                : typingUsers.length === 2
                ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                : `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers.length - 2} other${typingUsers.length - 2 > 1 ? 's' : ''} are typing...`
              }
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
