import { algoliasearch } from 'algoliasearch';

// Replace with your actual Algolia credentials
const ALGOLIA_APP_ID = 'Q6O1I7G6CA';
const ALGOLIA_ADMIN_API_KEY = 'YOUR_ADMIN_API_KEY'; // You'll need to get this from Algolia dashboard

// Check if Algolia is configured for search (only needs App ID)
const isSearchConfigured = () => {
  return ALGOLIA_APP_ID !== 'YOUR_APP_ID' && 
         ALGOLIA_APP_ID.length > 0;
};

// Check if Algolia is configured for admin operations (needs both App ID and Admin Key)
const isAdminConfigured = () => {
  return ALGOLIA_APP_ID !== 'YOUR_APP_ID' && 
         ALGOLIA_ADMIN_API_KEY !== 'YOUR_ADMIN_API_KEY' &&
         ALGOLIA_APP_ID.length > 0 && 
         ALGOLIA_ADMIN_API_KEY.length > 0;
};

// Initialize the admin client only if configured
let adminClient = null;
let ideasIndex = null;

if (isAdminConfigured()) {
  try {
    adminClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
    ideasIndex = adminClient.initIndex('ideas');
  } catch (error) {
    console.warn('Failed to initialize Algolia admin client:', error);
  }
}

// Function to get search index (lazy initialization)
const getSearchIndex = async () => {
  if (ideasIndex) return ideasIndex;
  
  if (isSearchConfigured()) {
    try {
      const { searchClient } = await import('../algolia.js');
      if (searchClient) {
        // Create a mock index object that uses the search client
        return {
          search: async (params) => {
            const { results } = await searchClient.search([{
              indexName: 'ideas',
              ...params
            }]);
            return results[0];
          }
        };
      }
    } catch (error) {
      console.warn('Failed to initialize Algolia search client:', error);
    }
  }
  
  return null;
};

export const submitIdea = async (ideaData) => {
  // If Algolia admin is not configured, simulate submission
  if (!isAdminConfigured() || !ideasIndex) {
    console.log('Algolia not configured, simulating idea submission');
    return { 
      success: true, 
      result: { objectID: Date.now().toString() },
      idea: {
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
      }
    };
  }

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
  // If Algolia is not configured, use mock data
  if (!isSearchConfigured()) {
    console.log('Algolia not configured, using mock search data');
    const mockResults = mockIdeas.filter(idea => 
      idea.title.toLowerCase().includes(query.toLowerCase()) ||
      idea.description.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, hits: mockResults };
  }

  try {
    const searchIndex = await getSearchIndex();
    if (!searchIndex) {
      console.log('Failed to get search index, using mock data');
      const mockResults = mockIdeas.filter(idea => 
        idea.title.toLowerCase().includes(query.toLowerCase()) ||
        idea.description.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, hits: mockResults };
    }

    const searchParams = {
      query,
      hitsPerPage: 10,
      attributesToRetrieve: ['ID', 'Action Item', 'Sector', 'Lead/Key Stakeholders', 'Timeline'],
      attributesToHighlight: ['Action Item', 'Sector'],
      ...filters
    };

    const { hits } = await searchIndex.search(searchParams);
    
    // Transform the data to match our expected format
    const transformedHits = hits.map(hit => ({
      objectID: hit.objectID,
      title: hit['Action Item'] || 'Untitled Action Item',
      description: `Sector: ${hit.Sector || 'Unknown'} | Timeline: ${hit.Timeline || 'Unknown'} | Lead: ${hit['Lead/Key Stakeholders'] || 'Unknown'}`,
      category: hit.Sector || 'General',
      tags: [hit.Sector, hit.Timeline].filter(Boolean),
      author: hit['Lead/Key Stakeholders'] || 'Unknown',
      votes: 0,
      created_at: new Date().toISOString(),
      // Keep original data for reference
      originalData: hit
    }));
    
    return { success: true, hits: transformedHits };
  } catch (error) {
    console.error('Error searching ideas:', error);
    return { success: false, error: error.message, hits: [] };
  }
};

// Function to get top sectors from Algolia data
export const getTopSectors = async () => {
  if (!isSearchConfigured()) {
    // Return mock sectors for development
    return ['Culture', 'Economy', 'Environment', 'Governance', 'Social Policy'];
  }

  try {
    const searchIndex = await getSearchIndex();
    if (!searchIndex) {
      return ['Culture', 'Economy', 'Environment', 'Governance', 'Social Policy'];
    }

    // Get all records to analyze sectors
    const { hits } = await searchIndex.search('', {
      hitsPerPage: 1000, // Get all records
      attributesToRetrieve: ['Sector']
    });

    // Count sector occurrences
    const sectorCounts = {};
    hits.forEach(hit => {
      const sector = hit.Sector;
      if (sector) {
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
    });

    // Sort by count and get top 5
    const topSectors = Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([sector]) => sector);

    return topSectors.length > 0 ? topSectors : ['Culture', 'Economy', 'Environment', 'Governance', 'Social Policy'];
  } catch (error) {
    console.error('Error getting top sectors:', error);
    return ['Culture', 'Economy', 'Environment', 'Governance', 'Social Policy'];
  }
};

// Function to search ideas by sector
export const searchIdeasBySector = async (sector) => {
  // If Algolia is not configured, use mock data
  if (!isSearchConfigured()) {
    console.log('Algolia not configured, using mock search data by sector');
    const mockResults = mockIdeas.filter(idea => 
      idea.category.toLowerCase() === sector.toLowerCase()
    );
    return { success: true, hits: mockResults };
  }

  try {
    const searchIndex = await getSearchIndex();
    if (!searchIndex) {
      console.log('Failed to get search index, using mock data');
      const mockResults = mockIdeas.filter(idea => 
        idea.category.toLowerCase() === sector.toLowerCase()
      );
      return { success: true, hits: mockResults };
    }

    const searchParams = {
      query: '',
      filters: `Sector:"${sector}"`,
      hitsPerPage: 20,
      attributesToRetrieve: ['ID', 'Action Item', 'Sector', 'Lead/Key Stakeholders', 'Timeline'],
      attributesToHighlight: ['Action Item', 'Sector']
    };

    const { hits } = await searchIndex.search(searchParams);
    
    // Transform the data to match our expected format
    const transformedHits = hits.map(hit => ({
      objectID: hit.objectID,
      title: hit['Action Item'] || 'Untitled Action Item',
      description: `Sector: ${hit.Sector || 'Unknown'} | Timeline: ${hit.Timeline || 'Unknown'} | Lead: ${hit['Lead/Key Stakeholders'] || 'Unknown'}`,
      category: hit.Sector || 'General',
      tags: [hit.Sector, hit.Timeline].filter(Boolean),
      author: hit['Lead/Key Stakeholders'] || 'Unknown',
      votes: Math.floor(Math.random() * 100) + 1, // Random votes for demo
      created_at: new Date().toISOString(),
      // Keep original data for reference
      originalData: hit
    }));
    
    return { success: true, hits: transformedHits };
  } catch (error) {
    console.error('Error searching ideas by sector:', error);
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
