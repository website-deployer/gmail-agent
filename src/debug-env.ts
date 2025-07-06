// Debug file to check environment variables
console.log('Environment Variables Debug:');
console.log('VITE_OPENROUTER_API_KEY:', import.meta.env.VITE_OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('VITE_GOOGLE_CLIENT_SECRET:', import.meta.env.VITE_GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

// Check if the API key looks valid (should be a long string)
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
if (apiKey) {
  console.log('API Key length:', apiKey.length);
  console.log('API Key starts with:', apiKey.substring(0, 10) + '...');
} 