export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  snippet: string;
  timestamp: number;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface EmailAnalysis {
  id: string;
  emailId: string;
  summary: string;
  priority: 'urgent' | 'important' | 'regular';
  sentiment: 'positive' | 'neutral' | 'negative';
  actionItems: ActionItem[];
  intent: string;
  confidence: number;
  keywords: string[];
}

export interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  completed: boolean;
  emailId: string;
}

export interface DashboardStats {
  totalEmails: number;
  unreadEmails: number;
  urgentEmails: number;
  importantEmails: number;
  actionItems: number;
  completedActions: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

export interface AppHistory {
  past: any[];
  present: any;
  future: any[];
}