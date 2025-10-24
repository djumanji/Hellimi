// Test script to check the structure of Algolia data
import { searchClient } from './src/algolia.js';

console.log('🔍 Checking Algolia Data Structure...\n');

try {
  const { results } = await searchClient.search([
    {
      indexName: 'ideas',
      query: '',
      params: {
        hitsPerPage: 3,
        attributesToRetrieve: ['*'] // Get all attributes
      }
    }
  ]);
  
  console.log('✅ Found data in your Algolia index!');
  console.log(`📊 Total results: ${results[0].nbHits}`);
  console.log(`📄 Showing first 3 results:\n`);
  
  results[0].hits.forEach((hit, index) => {
    console.log(`--- Result ${index + 1} ---`);
    console.log('Object ID:', hit.objectID);
    console.log('All attributes:');
    Object.keys(hit).forEach(key => {
      if (key !== 'objectID') {
        console.log(`  ${key}: ${JSON.stringify(hit[key])}`);
      }
    });
    console.log('');
  });
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('🎉 Data structure check complete!');
