import React from 'react';

export const PriceRow: React.FC = ({ tokenId, symbols, decimals, lastUpdated, price }) => {
  return (
    <tr id={symbols} className="bg-white">
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        #{tokenId}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {symbols}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {decimals}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {lastUpdated}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {price}
      </td>
    </tr>
  );
};
