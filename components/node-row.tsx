import React, { useEffect, useState } from 'react';

export const NodeRow: React.FC = ({ publicKey, currentNode, trusted, network, source, maxBlockDiff, maxPriceDiff }) => {
  
  const [className, setClassName] = useState("px-6 py-4 text-sm text-gray-500 whitespace-nowrap");

  useEffect(() => {
    if (currentNode) {
      setClassName("px-6 py-4 text-sm text-gray-500 font-medium whitespace-nowrap")
    }
  }, []);
  
  return (
    <tr key={publicKey} className="bg-white">
      <td className={className}>
        {publicKey}
      </td>
      <td className={className}>
        {trusted}
      </td>
      <td className={className}>
        {network}
      </td>
      <td className={className}>
        {source}
      </td>
      <td className={className}>
        {maxBlockDiff}
      </td>
      <td className={className}>
        {maxPriceDiff}
      </td>
    </tr>
  );
};
