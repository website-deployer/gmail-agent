interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}



class GoogleAuthService {
  private clientId: string;
  private scope: string;
  private tokenClient: any = null;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.scope = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    
    if (!this.clientId) {
      console.error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.');
    }
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.initializeTokenClient();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
  }

  private initializeTokenClient(): void {
    // Check if Google Identity Services is available
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      const googleOAuth = (window as any).google.accounts.oauth2;
      
      this.tokenClient = googleOAuth.initTokenClient({
        client_id: this.clientId,
        scope: this.scope,
        callback: (response: any) => {
          // This will be handled by the login method
          console.log('Token received:', response);
        },
      });
    } else {
      console.error('Google Identity Services not loaded');
    }
  }

  async login(): Promise<{ user: GoogleUser; token: string }> {
    if (!this.tokenClient) {
      throw new Error('Google OAuth client not initialized');
    }

    return new Promise((resolve, reject) => {
      // Store the resolve/reject functions to use in callback
      (window as any).googleAuthCallback = (response: any) => {
        if (response.error) {
          reject(new Error(`OAuth error: ${response.error}`));
          return;
        }
        
        this.getUserInfo(response.access_token)
          .then(user => {
            resolve({ user, token: response.access_token });
          })
          .catch(reject);
      };

      // Override the callback to use our stored function
      this.tokenClient!.callback = (window as any).googleAuthCallback;
      
      // Request the token
      this.tokenClient!.requestAccessToken();
    });
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await response.json();
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    };
  }

  async logout(): Promise<void> {
    // Revoke the token
    const token = localStorage.getItem('gmail_token');
    if (token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to revoke token:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('gmail_token');
    localStorage.removeItem('gmail_user');
  }

  isTokenValid(token: string): boolean {
    // Basic token validation - in production, you might want to check expiration
    return !!token && token.length > 0;
  }
}

export const googleAuthService = new GoogleAuthService(); 