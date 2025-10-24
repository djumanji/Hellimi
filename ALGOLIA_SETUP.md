# Hellimi - Algolia Integration Setup

## Overview
Hellimi now includes Algolia integration for real-time search and idea submission. The app works in both development mode (with mock data) and production mode (with real Algolia).

## Current Status
✅ **Development Mode Active** - The app is currently using mock data for search and submission.

## Setting Up Algolia (Production)

### 1. Create Algolia Account
1. Go to [Algolia.com](https://www.algolia.com)
2. Sign up for a free account (includes 10,000 records and 50,000 operations/month)

### 2. Create Application
1. In your Algolia dashboard, create a new application
2. Note down your **Application ID** and **Search API Key**

### 3. Create Index
1. Go to "Search" → "Indices"
2. Create a new index called `ideas`
3. Configure the index with these attributes:
   - **Searchable attributes**: `title`, `description`, `tags`
   - **Facets**: `category`, `tags`
   - **Sorting**: `votes:desc`, `created_at:desc`

### 4. Configure API Keys
1. Go to "Settings" → "API Keys"
2. Copy your **Application ID** and **Search API Key**
3. For submissions, you'll also need an **Admin API Key** (create one with write permissions)

### 5. Update Configuration
Edit `src/algolia.js` and replace the placeholder values:

```javascript
const ALGOLIA_APP_ID = 'YOUR_ACTUAL_APP_ID';
const ALGOLIA_SEARCH_API_KEY = 'YOUR_ACTUAL_SEARCH_API_KEY';
```

Edit `src/services/algoliaService.js` and update:

```javascript
const ALGOLIA_APP_ID = 'YOUR_ACTUAL_APP_ID';
const ALGOLIA_ADMIN_API_KEY = 'YOUR_ACTUAL_ADMIN_API_KEY';
```

### 6. Test the Integration
1. Restart your development server
2. Try searching for ideas
3. Try submitting a new idea
4. Check your Algolia dashboard to see the data

## Features

### Search Functionality
- **Real-time search** as you type
- **Fuzzy matching** for typos
- **Highlighted results** showing matching text
- **Faceted search** by category and tags
- **Fallback to mock data** if Algolia is not configured

### Idea Submission
- **Automatic indexing** of new ideas
- **User attribution** with author information
- **Categorization** and tagging
- **Vote counting** system
- **Status tracking** (active, pending, etc.)

### Development Mode
- **Mock data** for testing without Algolia
- **Visual indicators** showing development mode
- **Full functionality** testing
- **Easy switching** to production mode

## Data Structure

Ideas are stored with this structure:
```javascript
{
  objectID: "unique_id",
  title: "Idea title",
  description: "Detailed description",
  category: "Category name",
  tags: ["tag1", "tag2"],
  author: "Author name",
  created_at: "2024-01-15T10:30:00Z",
  votes: 0,
  status: "active"
}
```

## Security Notes

- **Search API Key**: Safe to use in frontend (read-only)
- **Admin API Key**: Should be kept secret, ideally used server-side
- **Rate Limiting**: Algolia has built-in rate limiting
- **Data Validation**: Implement validation before submitting to Algolia

## Next Steps

1. **Configure Algolia** with your credentials
2. **Test search functionality** with real data
3. **Add more sophisticated filtering** (date ranges, categories)
4. **Implement voting system** for ideas
5. **Add analytics** to track popular searches
6. **Set up monitoring** for search performance

## Troubleshooting

### Common Issues
- **"No results found"**: Check if your index has data
- **"Search failed"**: Verify API keys are correct
- **"Submission failed"**: Check Admin API key permissions
- **Slow search**: Check your Algolia plan limits

### Debug Mode
The app shows development mode indicators when Algolia is not configured. This helps identify when you're using mock data vs real Algolia.

## Support

For Algolia-specific issues:
- [Algolia Documentation](https://www.algolia.com/doc/)
- [Algolia Community](https://discourse.algolia.com/)

For Hellimi-specific issues:
- Check the console for error messages
- Verify your API keys are correct
- Ensure your index is properly configured
