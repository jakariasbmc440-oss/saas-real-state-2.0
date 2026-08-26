import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const types = {
    success: {
      icon: CheckCircle,
      colors: 'bg-green-50 text-green-800 border-green-200',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircle,
      colors: 'bg-red-50 text-red-800 border-red-200',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      colors: 'bg-amber-50 text-amber-800 border-amber-200',
      iconColor: 'text-amber-500'
    },
    info: {
      icon: Info,
      colors: 'bg-blue-50 text-blue-800 border-blue-200',
      iconColor: 'text-blue-500'
    }
  };

  const { icon: Icon, colors, iconColor } = types[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg shadow-sm animate-in slide-in-from-right-full duration-300 ${colors}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <p className="text-sm font-medium pr-6">{message}</p>
      <button 
        onClick={onClose}
        className={`ml-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
