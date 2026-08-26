import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  value,
  trend,
  className = '',
  padding = 'p-6'
}) {
  if (value !== undefined) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding} ${className}`}>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {trend && (
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
}
