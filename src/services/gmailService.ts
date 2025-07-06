interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body?: {
      data?: string;
    };
    parts?: Array<{
      mimeType: string;
      body: {
        data?: string;
      };
    }>;
  };
}

interface GmailListResponse {
  messages: Array<{
    id: string;
    threadId: string;
  }>;
  nextPageToken?: string;
}

class GmailService {
  private baseUrl = 'https://gmail.googleapis.com/gmail/v1/users/me';

  async getEmails(token: string, maxResults: number = 20): Promise<any[]> {
    try {
      // First, get the list of message IDs
      const listResponse = await fetch(
        `${this.baseUrl}/messages?maxResults=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!listResponse.ok) {
        throw new Error(`Failed to fetch emails: ${listResponse.status}`);
      }

      const listData: GmailListResponse = await listResponse.json();
      
      if (!listData.messages) {
        return [];
      }

      // Fetch full message details for each email
      const emailPromises = listData.messages.map(message => 
        this.getMessageDetails(token, message.id)
      );

      const emails = await Promise.all(emailPromises);
      return emails.filter(email => email !== null);
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private async getMessageDetails(token: string, messageId: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/messages/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch message ${messageId}:`, response.status);
        return null;
      }

      const message: GmailMessage = await response.json();
      
      // Extract email details
      const headers = message.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const to = headers.find(h => h.name === 'To')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      // Extract body content
      let body = '';
      if (message.payload.body?.data) {
        body = this.decodeBody(message.payload.body.data);
      } else if (message.payload.parts) {
        // Find the text/plain part
        const textPart = message.payload.parts.find(part => 
          part.mimeType === 'text/plain'
        );
        if (textPart?.body?.data) {
          body = this.decodeBody(textPart.body.data);
        }
      }

      return {
        id: message.id,
        threadId: message.threadId,
        subject,
        from,
        to: to.split(',').map(email => email.trim()),
        body,
        snippet: message.snippet,
        timestamp: new Date(date).getTime(),
        isRead: !message.labelIds.includes('UNREAD'),
        isStarred: message.labelIds.includes('STARRED'),
        labels: message.labelIds.filter(label => 
          !['INBOX', 'UNREAD', 'STARRED'].includes(label)
        ),
      };
    } catch (error) {
      console.error(`Error fetching message ${messageId}:`, error);
      return null;
    }
  }

  private decodeBody(data: string): string {
    try {
      // Gmail API returns base64url encoded data
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
      console.error('Error decoding message body:', error);
      return '';
    }
  }

  async markAsRead(token: string, messageId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/messages/${messageId}/modify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            removeLabelIds: ['UNREAD'],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark message as read: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async toggleStar(token: string, messageId: string, isStarred: boolean): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/messages/${messageId}/modify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [isStarred ? 'removeLabelIds' : 'addLabelIds']: ['STARRED'],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to toggle star: ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      throw error;
    }
  }
}

export const gmailService = new GmailService(); 