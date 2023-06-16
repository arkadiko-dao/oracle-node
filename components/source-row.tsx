import React from 'react';

export type SourceRowObject = {
  source: string,
  currentNode: boolean,
  stx: number,
  btc: number,
  usda: number,
  usdaStx: number,
  diko: number,
  atAlex: number,
  atAlexV2: number
}

export default function SourceRow({ source, currentNode, stx, btc, usda, usdaStx, diko, atAlex, atAlexV2 }: SourceRowObject) {    
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
        ${usdaStx}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${diko}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${atAlex}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        ${atAlexV2}
      </td>
    </tr>
  );
};
