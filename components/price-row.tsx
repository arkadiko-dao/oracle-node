import React from 'react';

export type PriceRowObject = {
  tokenId: number,
  symbols: string,
  decimals: number,
  arkadikoDecimals: number,
  lastUpdated: string,
  price: string
}

export default function PriceRow({ tokenId, symbols, decimals, lastUpdated, price }: PriceRowObject) {    
  return (
    <tr key={tokenId} className="bg-white">
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
        {arkadikoDecimals}
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
