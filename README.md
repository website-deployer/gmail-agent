# Gmail AI Assistant

An AI-powered Gmail assistant that provides smart email analysis, priority detection, and action item extraction using OpenRouter AI and Gmail API.

## Features

- 🔐 **Gmail OAuth Integration** - Secure authentication with your Gmail account
- 🤖 **AI Email Analysis** - Smart summarization and priority detection
- 📋 **Action Item Extraction** - Automatic task identification and deadlines
- ⭐ **Email Management** - Mark as read, star emails, and organize
- 📊 **Dashboard Analytics** - Email statistics and insights
- ⌨️ **Keyboard Shortcuts** - Power user navigation

## Prerequisites

- Node.js 18+ and npm
- Gmail account
- OpenRouter API key
- Google Cloud Project with Gmail API enabled

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd MailAgent
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# OpenRouter API Key (for AI email analysis)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Gmail OAuth Credentials
VITE_GOOGLE_CLIENT_ID=your_gmail_oauth_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_gmail_oauth_client_secret_here
```

### 3. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API**
4. Create OAuth 2.0 credentials:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5173/`
     - `http://localhost:5173/callback`
     - `https://yourdomain.com/`
     - `https://yourdomain.com/callback`

### 4. OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add it to your `.env` file

### 5. Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## API Keys Required

### 1. OpenRouter API Key
- **Purpose**: AI-powered email analysis
- **Scopes**: Email summarization, priority detection, action item extraction
- **Model**: `openrouter/cypher-alpha:free`

### 2. Gmail OAuth Credentials
- **Purpose**: Gmail account access and email operations
- **Scopes**: 
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`

## Security Notes

- Never commit your `.env` file to version control
- Use HTTPS for all production URLs
- The client secret should be kept secure (not exposed in frontend)
- All domains must be verified through Google Search Console

## Development

The app uses:
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Identity Services** for OAuth
- **Gmail API** for email operations
- **OpenRouter API** for AI analysis

## Troubleshooting

### Common Issues

1. **"Google Client ID not configured"**
   - Ensure `VITE_GOOGLE_CLIENT_ID` is set in `.env`
   - Verify the client ID in Google Cloud Console

2. **"OpenRouter API key is not configured"**
   - Ensure `VITE_OPENROUTER_API_KEY` is set in `.env`
   - Verify the API key is valid

3. **OAuth redirect errors**
   - Check authorized redirect URIs in Google Cloud Console
   - Ensure domains are verified

4. **Gmail API errors**
   - Verify Gmail API is enabled in Google Cloud Console
   - Check OAuth consent screen configuration

## License

MIT License - see LICENSE file for details.
