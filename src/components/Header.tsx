import React from 'react';
import { Mail, Settings, LogOut, Bell, Undo, Redo } from 'lucide-react';
import { User } from '../types';
import { PopButton } from './PopButton';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSettingsClick: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onSettingsClick,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-900 p-2 rounded-md">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Free Gmail AI Assistant for Work Productivity</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onUndo && (
            <PopButton
              onClick={onUndo}
              disabled={!canUndo}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              <Undo className="w-4 h-4" />
            </PopButton>
          )}
          
          {onRedo && (
            <PopButton
              onClick={onRedo}
              disabled={!canRedo}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              <Redo className="w-4 h-4" />
            </PopButton>
          )}
          
          <PopButton
            variant="secondary"
            size="sm"
            className="p-2"
          >
            <Bell className="w-4 h-4" />
          </PopButton>
          
          <PopButton
            onClick={onSettingsClick}
            variant="secondary"
            size="sm"
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </PopButton>
          
          <div className="flex items-center space-x-3">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            )}
            <PopButton
              onClick={onLogout}
              variant="danger"
              size="sm"
              className="p-2"
            >
              <LogOut className="w-4 h-4" />
            </PopButton>
          </div>
        </div>
      </div>
    </div>
  );
};