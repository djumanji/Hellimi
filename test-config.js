// Test script to check Algolia configuration
import { isAlgoliaConfigured, searchClient } from './src/algolia.js';

console.log('🔧 Checking Algolia Configuration...\n');

console.log('✅ Algolia Configured:', isAlgoliaConfigured());
console.log('✅ Search Client:', searchClient ? 'Initialized' : 'Not Initialized');

if (searchClient) {
  console.log('\n🔍 Testing direct Algolia search...');
  
  try {
    // Test with a simple search
    const { results } = await searchClient.search([
      {
        indexName: 'ideas',
        query: '',
        params: {
          hitsPerPage: 10
        }
      }
    ]);
    
    console.log('✅ Direct search successful!');
    console.log(`📊 Found ${results[0].hits.length} results:`);
    
    results[0].hits.forEach((hit, index) => {
      console.log(`  ${index + 1}. ${hit.title || hit.objectID}`);
      if (hit.description) {
        console.log(`     Description: ${hit.description.substring(0, 100)}...`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.log('❌ Direct search failed:', error.message);
    
    if (error.message.includes('index')) {
      console.log('💡 This might mean the "ideas" index doesn\'t exist yet.');
      console.log('   Go to your Algolia dashboard and create an index called "ideas".');
    }
  }
} else {
  console.log('❌ Search client not initialized. Check your API keys.');
}

console.log('\n🎉 Configuration test complete!');
