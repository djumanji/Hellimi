import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getTopSectors, searchIdeasBySector, getAllIdeas } from '../services/algoliaService';

interface Idea {
  objectID: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  votes: number;
  created_at: string;
}

export function CategorizedIdeas() {
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set());
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sectors and initial ideas on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load sectors
        const sectorList = await getTopSectors();
        console.log('Loaded sectors:', sectorList);
        setSectors(['All', ...sectorList]); // Add "All" option
        
        // Load all ideas by default
        await loadIdeasForSector('All');
      } catch (error) {
        console.error('Error loading initial data:', error);
        setSectors(['All', 'Culture', 'Economy', 'Environment', 'Governance', 'Social Policy']);
        await loadIdeasForSector('All');
      }
    };
    loadInitialData();
  }, []);

  // Load ideas when sector changes
  useEffect(() => {
    if (selectedSector) {
      loadIdeasForSector(selectedSector);
    }
  }, [selectedSector]);

  const loadIdeasForSector = async (sector: string) => {
    setLoading(true);
    try {
      let result;
      if (sector === 'All') {
        result = await getAllIdeas();
      } else {
        result = await searchIdeasBySector(sector);
      }
      
      if (result.success) {
        setIdeas(result.hits);
        console.log(`Loaded ${result.hits.length} ideas for sector: ${sector}`);
      } else {
        console.error('Error loading ideas:', result.error);
        // Don't clear ideas on error, keep current ones
        if (ideas.length === 0) {
          setIdeas([]);
        }
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
      // Don't clear ideas on error, keep current ones
      if (ideas.length === 0) {
        setIdeas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (ideaId: string) => {
    setVotedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  const handleSectorClick = (sector: string) => {
    setSelectedSector(sector);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-4xl mb-3">Top Ideas by Sector</h2>
        <p className="text-gray-600">
          Explore the most popular ideas across different sectors
        </p>
      </div>

      {/* Sector Tags */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {sectors.map((sector) => (
          <Button
            key={sector}
            variant={selectedSector === sector ? "default" : "outline"}
            onClick={() => handleSectorClick(sector)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedSector === sector
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {sector}
          </Button>
        ))}
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading ideas...</p>
          </div>
        ) : ideas.length > 0 ? (
          ideas.map((idea, index) => (
            <Card
              key={idea.objectID}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <button
                    onClick={() => handleVote(idea.objectID)}
                    className={`p-2 rounded-lg transition-colors ${
                      votedIdeas.has(idea.objectID)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-5 h-5 ${
                        votedIdeas.has(idea.objectID) ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                  <span className="text-sm">
                    {votedIdeas.has(idea.objectID) ? idea.votes + 1 : idea.votes}
                  </span>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-gray-800 flex-1">{idea.title}</p>
                    {index === 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        🏆 Top Voted
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span>by {idea.author}</span>
                    <span>•</span>
                    <span>{formatTimestamp(idea.created_at)}</span>
                  </div>
                  {idea.description && (
                    <p className="text-sm text-gray-600">{idea.description}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No ideas found for sector "{selectedSector}".</p>
            <p className="text-sm text-gray-400">Try selecting a different sector or "All" to see all ideas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
