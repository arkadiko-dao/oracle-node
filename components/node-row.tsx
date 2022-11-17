import React, { useEffect, useState } from 'react';

export const NodeRow: React.FC = ({ publicKey, url, currentNode, trusted, network, source, maxBlockDiff, maxPriceDiff }) => {
    
  return (
    <tr key={publicKey} className="bg-white">
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {trusted ? "✅" : "❌"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {publicKey}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {network}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {source}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {maxBlockDiff}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {maxPriceDiff * 100}%
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {currentNode ? (
          "Current"
        ):(
          <a className="text-blue-500" href={url}>Show</a>
        )}
      </td>
    </tr>
  );
};
