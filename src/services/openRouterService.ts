const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnalysisRequest {
  emailContent: string;
  subject: string;
  from: string;
}

interface AnalysisResult {
  summary: string;
  priority: 'urgent' | 'important' | 'regular';
  sentiment: 'positive' | 'neutral' | 'negative';
  actionItems: Array<{
    text: string;
    priority: 'high' | 'medium' | 'low';
    deadline?: string;
  }>;
  intent: string;
  confidence: number;
  keywords: string[];
}

class OpenRouterService {
  private cache = new Map<string, AnalysisResult>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimitDelay = 1000; // 1 second between requests

  private async makeRequest(prompt: string, retries = 3): Promise<string> {
    // Check if API key is available
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key is not configured. Please create a .env file with VITE_OPENROUTER_API_KEY=your_actual_api_key');
    }

    console.log('OpenRouter API Key available:', !!OPENROUTER_API_KEY);
    console.log('Making request to OpenRouter API...');

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Gmail AI Assistant'
          },
          body: JSON.stringify({
            model: attempt === 0 ? 'anthropic/claude-3-haiku' : 'openai/gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an AI assistant that analyzes emails and provides structured responses in JSON format. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error Response:`, errorText);
          
          if (response.status === 429) {
            // Rate limited, wait and retry
            await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay * (attempt + 1)));
            continue;
          }
          
          if (response.status === 404) {
            throw new Error(`API endpoint not found. Please verify your API key and model availability. Status: ${response.status}`);
          }
          
          if (response.status === 401) {
            throw new Error(`Authentication failed. Please verify your OpenRouter API key. Status: ${response.status}`);
          }
          
          throw new Error(`API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const data: OpenRouterResponse = await response.json();
        console.log('OpenRouter API Response:', data);
        return data.choices[0]?.message?.content || '';
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === retries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    throw new Error('All retry attempts failed');
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queue request failed:', error);
        }
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
      }
    }

    this.isProcessing = false;
  }

  private queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  async analyzeEmail({ emailContent, subject, from }: AnalysisRequest): Promise<AnalysisResult> {
    const cacheKey = `${subject}-${from}-${emailContent.substring(0, 100)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const prompt = `
Analyze the following email and provide a JSON response with this exact structure:

{
  "summary": "Brief summary of the email content",
  "priority": "urgent|important|regular",
  "sentiment": "positive|neutral|negative",
  "actionItems": [
    {
      "text": "Action item description",
      "priority": "high|medium|low",
      "deadline": "ISO date string or null"
    }
  ],
  "intent": "Brief description of sender's intent",
  "confidence": 0.95,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Email to analyze:
Subject: ${subject}
From: ${from}
Content: ${emailContent}

Respond only with valid JSON, no additional text.
    `;

    try {
      const response = await this.queueRequest(() => this.makeRequest(prompt));
      const analysis = JSON.parse(response) as AnalysisResult;
      
      // Cache the result
      this.cache.set(cacheKey, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Email analysis failed:', error);
      
      // Return fallback analysis
      return {
        summary: 'Unable to analyze email content at this time.',
        priority: 'regular',
        sentiment: 'neutral',
        actionItems: [],
        intent: 'unknown',
        confidence: 0.1,
        keywords: []
      };
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }

  // Test function to verify API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('Respond with "OK"');
      console.log('OpenRouter connection test successful:', response);
      return true;
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }
}

export const openRouterService = new OpenRouterService();