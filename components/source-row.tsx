import React from 'react';

export type SourceRowObject = {
  source: string,
  currentNode: boolean,
  prices: any
}

export default function SourceRow({ source, currentNode, prices }: SourceRowObject) {    
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

      {Object.keys(prices).map((symbol) => (
        <th key={symbol} scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
          {prices[symbol]}
        </th>
      ))}
    </tr>
  );
};
