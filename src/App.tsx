import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EmailModal } from './components/EmailModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { NotificationToast } from './components/NotificationToast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useEmails } from './hooks/useEmails';
import { useNotifications } from './hooks/useNotifications';
import { useHistory } from './hooks/useHistory';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Email } from './types';

function App() {
  const { isAuthenticated, user, token, loading: authLoading, login, logout } = useAuth();
  const { emails, analyses, stats, loading: emailsLoading, markAsRead, toggleStar, completeActionItem } = useEmails(token);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const { undo, redo, canUndo, canRedo } = useHistory({
    selectedEmail: null,
    showSettings: false,
    showHelp: false,
    searchQuery: ''
  });
  
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'z',
      ctrlKey: true,
      action: undo,
      description: 'Undo last action'
    },
    {
      key: 'y',
      ctrlKey: true,
      action: redo,
      description: 'Redo last action'
    },
    {
      key: 'Escape',
      action: () => {
        if (selectedEmail) setSelectedEmail(null);
        else if (showSettings) setShowSettings(false);
        else if (showHelp) setShowHelp(false);
      },
      description: 'Close modal'
    },
    {
      key: '1',
      action: () => (document.querySelector('[data-tab="inbox"]') as HTMLElement)?.click(),
      description: 'Switch to inbox'
    },
    {
      key: '2',
      action: () => (document.querySelector('[data-tab="priority"]') as HTMLElement)?.click(),
      description: 'Switch to priority'
    },
    {
      key: '3',
      action: () => (document.querySelector('[data-tab="actions"]') as HTMLElement)?.click(),
      description: 'Switch to actions'
    }
  ]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      markAsRead(email.id);
      addNotification('success', `Marked "${email.subject}" as read`);
    }
  };

  const handleStarToggle = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      toggleStar(emailId);
      addNotification('info', email.isStarred ? 'Removed star' : 'Added star');
    }
  };

  const handleMarkRead = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      markAsRead(emailId);
      addNotification('success', `Marked "${email.subject}" as read`);
    }
  };

  const handleCompleteAction = (actionId: string) => {
    completeActionItem(actionId);
    addNotification('success', 'Action item completed!');
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  // Show loading screen during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="blue" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} loading={authLoading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Header
          user={user!}
          onLogout={logout}
          onSettingsClick={() => setShowSettings(true)}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <div className="px-6">
          {emailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" color="blue" />
                <p className="mt-4 text-gray-600">Analyzing emails with AI...</p>
              </div>
            </div>
          ) : (
            <Dashboard
              emails={emails}
              analyses={analyses}
              stats={stats}
              onEmailClick={handleEmailClick}
              onStarToggle={handleStarToggle}
              onMarkRead={handleMarkRead}
              onCompleteAction={handleCompleteAction}
              onShowHelp={handleShowHelp}
            />
          )}
        </div>
        
        {selectedEmail && (
          <EmailModal
            email={selectedEmail}
            analysis={analyses.find(a => a.emailId === selectedEmail.id)}
            onClose={() => setSelectedEmail(null)}
            onStar={() => handleStarToggle(selectedEmail.id)}
          />
        )}
        
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

        {showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} />
        )}
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}

export default App;