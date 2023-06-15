import React from 'react';

export type NodeRowObject = {
  publicKey: string,
  url: string,
  currentNode: boolean,
  trusted: boolean,
  network: string,
  source: string,
  maxBlockDiff: number,
  maxPriceDiff: number
}

export default function NodeRow({ publicKey, url, currentNode, trusted, network, source, maxBlockDiff, maxPriceDiff }: NodeRowObject) {    
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
          <a className="text-blue-500" href={url} target="_blank" rel="noreferrer">Show</a>
        )}
      </td>
    </tr>
  );
};
