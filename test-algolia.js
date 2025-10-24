// Test script to check Algolia data
import { searchIdeas } from './src/services/algoliaService.js';

console.log('🔍 Testing Algolia search...\n');

// Test different search queries
const testQueries = [
  '', // Empty search to get all data
  'test',
  'idea',
  'cyprus',
  'democracy',
  'leadership',
  'technology'
];

for (const query of testQueries) {
  try {
    console.log(`\n📝 Searching for: "${query || 'ALL DATA'}"`);
    const result = await searchIdeas(query);
    
    if (result.success) {
      console.log(`✅ Found ${result.hits.length} results:`);
      result.hits.forEach((hit, index) => {
        console.log(`  ${index + 1}. ${hit.title}`);
        if (hit.description) {
          console.log(`     Description: ${hit.description.substring(0, 100)}...`);
        }
        if (hit.category) {
          console.log(`     Category: ${hit.category}`);
        }
        if (hit.tags && hit.tags.length > 0) {
          console.log(`     Tags: ${hit.tags.join(', ')}`);
        }
        console.log(`     Votes: ${hit.votes || 0}`);
        console.log('');
      });
    } else {
      console.log(`❌ Search failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

console.log('\n🎉 Test complete!');
