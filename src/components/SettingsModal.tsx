import React, { useState } from 'react';
import { X, Bell, Shield, Zap, Save, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { PopButton } from './PopButton';
import { openRouterService } from '../services/openRouterService';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState({
    urgent: true,
    important: true,
    regular: false,
  });

  const [aiSettings, setAiSettings] = useState({
    autoAnalysis: true,
    confidenceThreshold: 0.8,
    actionItemDetection: true,
  });

  const [privacy, setPrivacy] = useState({
    shareAnalytics: false,
    secureStorage: true,
  });

  const [cacheInfo, setCacheInfo] = useState({
    size: openRouterService.getCacheSize(),
    cleared: false
  });

  const handleClearCache = () => {
    openRouterService.clearCache();
    setCacheInfo({ size: 0, cleared: true });
    setTimeout(() => setCacheInfo(prev => ({ ...prev, cleared: false })), 2000);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        checked ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
        checked ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden" variant="elevated">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
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
            {/* Notifications */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{key} emails</span>
                    <ToggleSwitch 
                      checked={value} 
                      onChange={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Settings */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto-analysis</span>
                  <ToggleSwitch 
                    checked={aiSettings.autoAnalysis} 
                    onChange={() => setAiSettings(prev => ({ ...prev, autoAnalysis: !prev.autoAnalysis }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Action item detection</span>
                  <ToggleSwitch 
                    checked={aiSettings.actionItemDetection} 
                    onChange={() => setAiSettings(prev => ({ ...prev, actionItemDetection: !prev.actionItemDetection }))}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Confidence threshold</span>
                    <span className="text-gray-500 text-sm">{Math.round(aiSettings.confidenceThreshold * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.1"
                    value={aiSettings.confidenceThreshold}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-700">Cache size</span>
                    <p className="text-gray-500 text-sm">{cacheInfo.size} cached analyses</p>
                  </div>
                  <PopButton
                    onClick={handleClearCache}
                    variant={cacheInfo.cleared ? 'success' : 'secondary'}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{cacheInfo.cleared ? 'Cleared!' : 'Clear Cache'}</span>
                  </PopButton>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Share analytics</span>
                  <ToggleSwitch 
                    checked={privacy.shareAnalytics} 
                    onChange={() => setPrivacy(prev => ({ ...prev, shareAnalytics: !prev.shareAnalytics }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Secure storage</span>
                  <ToggleSwitch 
                    checked={privacy.secureStorage} 
                    onChange={() => setPrivacy(prev => ({ ...prev, secureStorage: !prev.secureStorage }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <PopButton 
              variant="primary" 
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </PopButton>
          </div>
        </div>
      </Card>
    </div>
  );
};