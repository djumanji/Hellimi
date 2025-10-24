import { algoliasearch } from 'algoliasearch';

// Replace with your actual Algolia credentials
const ALGOLIA_APP_ID = 'YOUR_APP_ID';
const ALGOLIA_ADMIN_API_KEY = 'YOUR_ADMIN_API_KEY';

// Initialize the admin client (only for server-side operations)
const adminClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const ideasIndex = adminClient.initIndex('ideas');

export const submitIdea = async (ideaData) => {
  try {
    const ideaObject = {
      objectID: Date.now().toString(),
      title: ideaData.title || ideaData.query,
      description: ideaData.description || '',
      category: ideaData.category || 'General',
      tags: ideaData.tags || [],
      author: ideaData.author || 'Anonymous',
      created_at: new Date().toISOString(),
      votes: 0,
      status: 'active',
      ...ideaData
    };

    const result = await ideasIndex.saveObject(ideaObject);
    return { success: true, result, idea: ideaObject };
  } catch (error) {
    console.error('Error submitting idea to Algolia:', error);
    return { success: false, error: error.message };
  }
};

export const searchIdeas = async (query, filters = {}) => {
  try {
    const searchParams = {
      query,
      hitsPerPage: 10,
      attributesToRetrieve: ['title', 'description', 'category', 'tags', 'votes', 'created_at'],
      attributesToHighlight: ['title', 'description'],
      ...filters
    };

    const { hits } = await ideasIndex.search(searchParams);
    return { success: true, hits };
  } catch (error) {
    console.error('Error searching ideas:', error);
    return { success: false, error: error.message, hits: [] };
  }
};

// Mock data for development/testing
export const mockIdeas = [
  {
    objectID: '1',
    title: 'Leadership skills development',
    description: 'Programs and resources for developing leadership capabilities in Cyprus',
    category: 'Professional Development',
    tags: ['leadership', 'management', 'skills'],
    votes: 15,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    objectID: '2',
    title: 'Technical certification programs',
    description: 'IT and technical certification opportunities for Cypriot professionals',
    category: 'Education',
    tags: ['technology', 'certification', 'IT'],
    votes: 8,
    created_at: '2024-01-14T15:20:00Z'
  },
  {
    objectID: '3',
    title: 'Mentorship opportunities',
    description: 'Connecting experienced professionals with newcomers in Cyprus',
    category: 'Networking',
    tags: ['mentorship', 'networking', 'career'],
    votes: 12,
    created_at: '2024-01-13T09:15:00Z'
  },
  {
    objectID: '4',
    title: 'Cross-functional project experience',
    description: 'Opportunities to work on diverse projects across different departments',
    category: 'Professional Development',
    tags: ['projects', 'collaboration', 'experience'],
    votes: 6,
    created_at: '2024-01-12T14:45:00Z'
  }
];
