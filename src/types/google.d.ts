declare global {
  interface Window {
    googleAuthCallback: (response: any) => void;
  }
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }

      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
      }

      interface TokenClient {
        requestAccessToken(): void;
        callback: (response: TokenResponse) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
    }
  }
}

// Make sure this file is treated as a module
export {}; 