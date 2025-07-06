import React, { useState } from 'react';
import { Mail, AlertTriangle, Star, CheckSquare, Search, HelpCircle } from 'lucide-react';
import { Email, EmailAnalysis, DashboardStats, ActionItem as ActionItemType } from '../types';
import { Card } from './Card';
import { StatCard } from './StatCard';
import { EmailCard } from './EmailCard';
import { ActionItem } from './ActionItem';
import { PopButton } from './PopButton';
import { ProgressBar } from './ProgressBar';

interface DashboardProps {
  emails: Email[];
  analyses: EmailAnalysis[];
  stats: DashboardStats;
  onEmailClick: (email: Email) => void;
  onStarToggle: (emailId: string) => void;
  onMarkRead: (emailId: string) => void;
  onCompleteAction: (actionId: string) => void;
  onShowHelp?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  emails,
  analyses,
  stats,
  onEmailClick,
  onStarToggle,
  onMarkRead,
  onCompleteAction,
  onShowHelp,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'priority' | 'actions'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'important'>('all');

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterPriority === 'all') return matchesSearch;
    
    const analysis = analyses.find(a => a.emailId === email.id);
    return matchesSearch && analysis?.priority === filterPriority;
  });

  const priorityEmails = emails.filter(email => {
    const analysis = analyses.find(a => a.emailId === email.id);
    return analysis?.priority === 'urgent' || analysis?.priority === 'important';
  });

  const allActionItems = analyses.flatMap(analysis => 
    analysis.actionItems.map(item => ({ ...item, analysis }))
  );

  const pendingActionItems = allActionItems.filter(item => !item.completed);
  const completionRate = allActionItems.length > 0 ? 
    (allActionItems.filter(item => item.completed).length / allActionItems.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Emails"
          value={stats.totalEmails}
          icon={<Mail className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Unread"
          value={stats.unreadEmails}
          icon={<Mail className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="High Priority"
          value={stats.urgentEmails + stats.importantEmails}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          title="Action Items"
          value={stats.actionItems}
          icon={<CheckSquare className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Progress Overview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Task Completion</h3>
          {onShowHelp && (
            <PopButton
              onClick={onShowHelp}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              <HelpCircle className="w-4 h-4" />
            </PopButton>
          )}
        </div>
        <ProgressBar 
          progress={completionRate} 
          color="green" 
          showLabel 
          animated={completionRate < 100}
        />
      </Card>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
          </select>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'inbox', label: 'Inbox', icon: Mail },
            { id: 'priority', label: 'Priority', icon: AlertTriangle },
            { id: 'actions', label: 'Actions', icon: CheckSquare },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'inbox' && (
          <div className="space-y-3">
            {filteredEmails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                analysis={analyses.find(a => a.emailId === email.id)}
                onClick={() => onEmailClick(email)}
                onStar={() => onStarToggle(email.id)}
                onMarkRead={() => onMarkRead(email.id)}
              />
            ))}
            {filteredEmails.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No emails found matching your criteria</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'priority' && (
          <div className="space-y-3">
            {priorityEmails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                analysis={analyses.find(a => a.emailId === email.id)}
                onClick={() => onEmailClick(email)}
                onStar={() => onStarToggle(email.id)}
                onMarkRead={() => onMarkRead(email.id)}
              />
            ))}
            {priorityEmails.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No priority emails at the moment</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-3">
            {pendingActionItems.map(item => (
              <ActionItem
                key={item.id}
                item={item}
                onComplete={() => onCompleteAction(item.id)}
              />
            ))}
            {pendingActionItems.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">All action items completed! 🎉</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};