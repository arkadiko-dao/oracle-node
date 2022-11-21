import React from 'react';

export const SourceRow: React.FC = ({ source, currentNode, stx, btc, usda, diko, atAlex }) => {
  return (
    <tr key={source} className="bg-white">
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {source}
        {currentNode ? (
          <span className="mb-3 text-sm text-gray-400">
            {' '} (current)
          </span>
        ): null}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${stx}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${btc}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${usda}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${diko}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${atAlex}
      </td>
    </tr>
  );
};
