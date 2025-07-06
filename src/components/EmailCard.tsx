import React from 'react';
import { Star, Clock, User } from 'lucide-react';
import { Email, EmailAnalysis } from '../types';
import { Card } from './Card';

interface EmailCardProps {
  email: Email;
  analysis?: EmailAnalysis;
  onClick: () => void;
  onStar: () => void;
  onMarkRead: () => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  analysis,
  onClick,
  onStar,
  onMarkRead,
}) => {
  const priorityColors = {
    urgent: 'border-l-red-500 bg-red-50',
    important: 'border-l-yellow-500 bg-yellow-50',
    regular: 'border-l-gray-300 bg-white',
  };

  const priorityColor = analysis?.priority || 'regular';
  const timeAgo = new Date(email.timestamp).toLocaleTimeString();

  return (
    <Card 
      className={`p-4 cursor-pointer border-l-4 ${priorityColors[priorityColor]} ${
        !email.isRead ? 'bg-blue-50' : 'bg-white'
      }`}
      onClick={onClick}
      hover
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              priorityColor === 'urgent' ? 'bg-red-500' :
              priorityColor === 'important' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`} />
            <span className="text-gray-600 text-sm truncate">{email.from}</span>
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
          
          <h3 className={`font-medium truncate ${
            email.isRead ? 'text-gray-700' : 'text-gray-900'
          }`}>
            {email.subject}
          </h3>
          
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {analysis?.summary || email.snippet}
          </p>
          
          {analysis && (
            <div className="flex items-center space-x-3 mt-2">
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                analysis.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                analysis.priority === 'important' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {analysis.priority}
              </span>
              <span className="text-xs text-gray-400">
                {analysis.sentiment} • {Math.round(analysis.confidence * 100)}% confidence
              </span>
            </div>
          )}
          
          {analysis?.actionItems && analysis.actionItems.length > 0 && (
            <div className="mt-2 text-xs text-blue-600 font-medium">
              {analysis.actionItems.length} action item{analysis.actionItems.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={`p-2 rounded-md transition-colors ${
              email.isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Star className={`w-4 h-4 ${email.isStarred ? 'fill-current' : ''}`} />
          </button>
          
          {!email.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};