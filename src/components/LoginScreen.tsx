import React from 'react';
import { Mail, Zap, Shield, Brain } from 'lucide-react';
import { Card } from './Card';
import { PopButton } from './PopButton';
import { LoadingSpinner } from './LoadingSpinner';

interface LoginScreenProps {
  onLogin: () => void;
  loading: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loading }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gmail AI Assistant</h1>
          <p className="text-gray-600">Transform your email experience with AI-powered insights</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-3 rounded-md">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">AI-Powered Analysis</h3>
                  <p className="text-gray-600 text-sm">Smart email summarization and priority detection</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-3 rounded-md">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">Action Items</h3>
                  <p className="text-gray-600 text-sm">Automatic extraction of tasks and deadlines</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-3 rounded-md">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Read-only access with OAuth 2.0 security</p>
                </div>
              </div>
            </div>

            <PopButton
              onClick={onLogin}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" color="gray" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Connect Gmail Account</span>
                </div>
              )}
            </PopButton>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};