import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { categories } from '../data/categorized-ideas';

export function CategorizedIdeas() {
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set());

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

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-4xl mb-3">Top Ideas by Category</h2>
        <p className="text-gray-600">
          Explore the most popular ideas across different sectors
        </p>
      </div>

      <Tabs defaultValue={categories[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm gap-2"
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="space-y-4">
              {category.ideas.map((idea, index) => (
                <Card
                  key={idea.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <button
                        onClick={() => handleVote(idea.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          votedIdeas.has(idea.id)
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-5 h-5 ${
                            votedIdeas.has(idea.id) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                      <span className="text-sm">
                        {votedIdeas.has(idea.id) ? idea.votes + 1 : idea.votes}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-gray-800 flex-1">{idea.text}</p>
                        {index === 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            🏆 Top Voted
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>by {idea.author}</span>
                        <span>•</span>
                        <span>{idea.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
