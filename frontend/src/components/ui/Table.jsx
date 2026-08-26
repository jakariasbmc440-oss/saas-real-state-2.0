import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Table({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  emptyIcon: EmptyIcon,
  loading = false,
  onRowClick
}) {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, i) => (
              <th key={col.key || i} className={`px-6 py-3 font-medium ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                {EmptyIcon && <EmptyIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />}
                <p>{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
