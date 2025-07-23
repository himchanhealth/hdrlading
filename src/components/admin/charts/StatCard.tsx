import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      change: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    green: {
      icon: 'text-green-600',
      change: 'text-green-600',
      bg: 'bg-green-50'
    },
    yellow: {
      icon: 'text-yellow-600',
      change: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    red: {
      icon: 'text-red-600',
      change: 'text-red-600',
      bg: 'bg-red-50'
    },
    purple: {
      icon: 'text-purple-600',
      change: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    gray: {
      icon: 'text-gray-600',
      change: 'text-gray-600',
      bg: 'bg-gray-50'
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      case 'neutral':
        return '→';
      default:
        return '';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`w-8 h-8 rounded-full ${colorClasses[color].bg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${colorClasses[color].icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {change && (
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(change.type)}`}>
              <span>{getChangeIcon(change.type)}</span>
              <span>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-gray-500">vs 지난 달</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;