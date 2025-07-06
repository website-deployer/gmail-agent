import React from 'react';
import { X, Keyboard, Zap, Mail, CheckSquare } from 'lucide-react';
import { Card } from './Card';
import { PopButton } from './PopButton';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl + Z', action: 'Undo last action' },
    { key: 'Ctrl + Y', action: 'Redo last action' },
    { key: 'Ctrl + F', action: 'Focus search' },
    { key: 'Escape', action: 'Close modal/Clear search' },
    { key: '1, 2, 3', action: 'Switch between tabs' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden" variant="elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Help & Documentation</h2>
            <PopButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              <X className="w-5 h-5" />
            </PopButton>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-96">
            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Features</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Email Analysis</h4>
                    <p className="text-gray-600 text-sm">AI-powered summarization, priority detection, and sentiment analysis for all your emails.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckSquare className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Action Item Extraction</h4>
                    <p className="text-gray-600 text-sm">Automatically identifies tasks, deadlines, and action items from your email content.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-blue-500" />
                <span>Keyboard Shortcuts</span>
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-mono text-sm">{shortcut.key}</span>
                    <span className="text-gray-600 text-sm">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips & Tricks</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• Use the search bar to quickly find specific emails or senders</p>
                <p>• Filter by priority to focus on urgent and important emails</p>
                <p>• Complete action items to track your progress</p>
                <p>• Star important emails for quick access</p>
                <p>• Check the settings to customize AI analysis preferences</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <PopButton 
              onClick={onClose}
              variant="primary"
            >
              Got it!
            </PopButton>
          </div>
        </div>
      </Card>
    </div>
  );
};