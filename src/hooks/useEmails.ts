import { useState, useEffect, useCallback } from 'react';
import { Email, EmailAnalysis, DashboardStats } from '../types';
import { openRouterService } from '../services/openRouterService';
import { gmailService } from '../services/gmailService';

export const useEmails = (token: string | null) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [analyses, setAnalyses] = useState<EmailAnalysis[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmails: 0,
    unreadEmails: 0,
    urgentEmails: 0,
    importantEmails: 0,
    actionItems: 0,
    completedActions: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Fetch real emails from Gmail API
      const gmailEmails = await gmailService.getEmails(token, 20);
      
      // Transform Gmail data to our Email format
      const emails: Email[] = gmailEmails.map(email => ({
        id: email.id,
        threadId: email.threadId,
        subject: email.subject,
        from: email.from,
        to: email.to,
        body: email.body,
        snippet: email.snippet,
        timestamp: email.timestamp,
        isRead: email.isRead,
        isStarred: email.isStarred,
        labels: email.labels,
      }));

      setEmails(emails);
      
      // Analyze emails with OpenRouter - properly handle async operations
      const analysisResults: EmailAnalysis[] = [];
      
      for (const email of emails) {
        try {
          const analysis = await openRouterService.analyzeEmail({
            emailContent: email.body,
            subject: email.subject,
            from: email.from
          });
          
          analysisResults.push({
            id: Math.random().toString(36).substr(2, 9),
            emailId: email.id,
            ...analysis,
            actionItems: analysis.actionItems.map(item => ({
              ...item,
              id: Math.random().toString(36).substr(2, 9),
              completed: false,
              emailId: email.id
            }))
          });
        } catch (error) {
          console.error(`Failed to analyze email ${email.id}:`, error);
          // Continue with other emails even if one fails
        }
      }

      setAnalyses(analysisResults);
      
      // Calculate stats
      const totalEmails = emails.length;
      const unreadEmails = emails.filter(e => !e.isRead).length;
      const urgentEmails = analysisResults.filter(a => a.priority === 'urgent').length;
      const importantEmails = analysisResults.filter(a => a.priority === 'important').length;
      const allActionItems = analysisResults.flatMap(a => a.actionItems);
      const actionItems = allActionItems.filter(item => !item.completed).length;
      const completedActions = allActionItems.filter(item => item.completed).length;

      setStats({
        totalEmails,
        unreadEmails,
        urgentEmails,
        importantEmails,
        actionItems,
        completedActions,
      });
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // Test OpenRouter connection first
      openRouterService.testConnection().then(isConnected => {
        console.log('OpenRouter connection test result:', isConnected);
        if (isConnected) {
          fetchEmails();
        } else {
          setError('AI analysis service is unavailable. Please check your OpenRouter API key.');
        }
      });
    }
  }, [fetchEmails]);

  const markAsRead = async (emailId: string) => {
    if (!token) return;
    
    try {
      await gmailService.markAsRead(token, emailId);
      setEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ));
    } catch (error) {
      console.error('Failed to mark email as read:', error);
    }
  };

  const toggleStar = async (emailId: string) => {
    if (!token) return;
    
    try {
      const email = emails.find(e => e.id === emailId);
      if (email) {
        await gmailService.toggleStar(token, emailId, email.isStarred);
        setEmails(prev => prev.map(email => 
          email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
        ));
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const completeActionItem = (actionId: string) => {
    setAnalyses(prev => prev.map(analysis => ({
      ...analysis,
      actionItems: analysis.actionItems.map(item =>
        item.id === actionId ? { ...item, completed: true } : item
      ),
    })));
  };

  return {
    emails,
    analyses,
    stats,
    loading,
    error,
    fetchEmails,
    markAsRead,
    toggleStar,
    completeActionItem,
  };
};