import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ActionItem as ActionItemType } from '../types';
import { Card } from './Card';
import { PopButton } from './PopButton';

interface ActionItemProps {
  item: ActionItemType;
  onComplete: () => void;
}

export const ActionItem: React.FC<ActionItemProps> = ({ item, onComplete }) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-purple-600 bg-purple-50',
    low: 'text-green-600 bg-green-50',
  };

  const priorityIcons = {
    high: AlertCircle,
    medium: Clock,
    low: CheckCircle,
  };

  const PriorityIcon = priorityIcons[item.priority];

  return (
    <Card className={`p-4 ${item.completed ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start space-x-3">
        <PopButton
          onClick={onComplete}
          variant={item.completed ? 'success' : 'secondary'}
          size="sm"
          className="flex-shrink-0"
        >
          <CheckCircle className="w-4 h-4" />
        </PopButton>
        
        <div className="flex-1">
          <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {item.text}
          </p>
          
          <div className="flex items-center space-x-3 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 font-medium ${priorityColors[item.priority]}`}>
              <PriorityIcon className="w-3 h-3" />
              <span>{item.priority}</span>
            </span>
            
            {item.deadline && (
              <span className="text-xs text-gray-500">
                Due: {new Date(item.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};