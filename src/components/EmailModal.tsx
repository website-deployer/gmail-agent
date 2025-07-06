import React from 'react';
import { X, Star, Reply, Forward, Archive, Trash2 } from 'lucide-react';
import { Email, EmailAnalysis } from '../types';
import { Card } from './Card';
import { PopButton } from './PopButton';

interface EmailModalProps {
  email: Email;
  analysis?: EmailAnalysis;
  onClose: () => void;
  onStar: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  email,
  analysis,
  onClose,
  onStar,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden" variant="elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{email.subject}</h2>
            <PopButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              <X className="w-5 h-5" />
            </PopButton>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-medium text-sm">
                    {email.from.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{email.from}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(email.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <PopButton
                onClick={onStar}
                variant={email.isStarred ? 'warning' : 'secondary'}
                size="sm"
                className="p-2"
              >
                <Star className={`w-4 h-4 ${email.isStarred ? 'fill-current' : ''}`} />
              </PopButton>
              <PopButton variant="secondary" size="sm" className="p-2">
                <Reply className="w-4 h-4" />
              </PopButton>
              <PopButton variant="secondary" size="sm" className="p-2">
                <Forward className="w-4 h-4" />
              </PopButton>
              <PopButton variant="secondary" size="sm" className="p-2">
                <Archive className="w-4 h-4" />
              </PopButton>
              <PopButton variant="danger" size="sm" className="p-2">
                <Trash2 className="w-4 h-4" />
              </PopButton>
            </div>
          </div>

          {analysis && (
            <div className="mb-6 space-y-4">
              <Card className="p-4" variant="outlined">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Summary</p>
                    <p className="text-gray-900">{analysis.summary}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Priority & Sentiment</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        analysis.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        analysis.priority === 'important' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {analysis.priority}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {analysis.sentiment} • {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {analysis.actionItems.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm font-medium mb-2">Action Items</p>
                    <div className="space-y-2">
                      {analysis.actionItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.priority === 'high' ? 'bg-red-500' :
                            item.priority === 'medium' ? 'bg-purple-500' :
                            'bg-green-500'
                          }`} />
                          <span className="text-gray-900 text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          <div className="overflow-y-auto max-h-96">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};