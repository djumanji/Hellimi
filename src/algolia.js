import { liteClient as algoliasearch } from 'algoliasearch/lite';

// Replace these with your actual Algolia credentials
// You can get these from your Algolia dashboard
const ALGOLIA_APP_ID = 'YOUR_APP_ID';
const ALGOLIA_SEARCH_API_KEY = 'YOUR_SEARCH_API_KEY';

// Initialize the search client
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

export { searchClient };

// For development/testing, we'll use mock data if Algolia isn't configured
export const isAlgoliaConfigured = () => {
  return ALGOLIA_APP_ID !== 'YOUR_APP_ID' && ALGOLIA_SEARCH_API_KEY !== 'YOUR_SEARCH_API_KEY';
};
