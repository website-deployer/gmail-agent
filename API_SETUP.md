# API Setup Guide

## OpenRouter API Key Setup

To enable AI email analysis, you need to set up your OpenRouter API key:

### 1. Get Your OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### 2. Create Environment File
Create a file named `.env` in your project root with this content:

```
VITE_OPENROUTER_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your real OpenRouter API key.

### 3. Restart Your Development Server
After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Alternative AI Services

If you prefer not to use OpenRouter, you can modify the service to use:

- **OpenAI**: Replace the API endpoint and use your OpenAI API key
- **Anthropic Claude**: Use Claude API for analysis
- **Local Models**: Use Ollama or similar local AI services

## Troubleshooting

- **"API key not configured"**: Make sure your `.env` file exists and has the correct API key
- **"Authentication failed"**: Verify your API key is correct and has sufficient credits
- **"Rate limited"**: The service will automatically retry with delays
- **"Model unavailable"**: The free model may be temporarily unavailable, try again later

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API keys secure and rotate them regularly 