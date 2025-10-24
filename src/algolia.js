import { liteClient as algoliasearch } from 'algoliasearch/lite';

// Replace these with your actual Algolia credentials
// You can get these from your Algolia dashboard
const ALGOLIA_APP_ID = 'Q6O1I7G6CA';
const ALGOLIA_SEARCH_API_KEY = 'b4c650a8e7db1a262075b0a5955173ea';

// Check if Algolia is properly configured
export const isAlgoliaConfigured = () => {
  return ALGOLIA_APP_ID !== 'YOUR_APP_ID' && 
         ALGOLIA_SEARCH_API_KEY !== 'YOUR_SEARCH_API_KEY' &&
         ALGOLIA_APP_ID.length > 0 && 
         ALGOLIA_SEARCH_API_KEY.length > 0;
};

// Initialize the search client only if configured
let searchClient = null;

if (isAlgoliaConfigured()) {
  try {
    searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
  } catch (error) {
    console.warn('Failed to initialize Algolia search client:', error);
    searchClient = null;
  }
}

export { searchClient };
