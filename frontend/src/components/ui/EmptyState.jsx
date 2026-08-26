import React from 'react';
import Button from './Button.jsx';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
      {Icon && (
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
