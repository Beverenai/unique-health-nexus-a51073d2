
import React from 'react';

export interface Connection {
  from: string;
  to: string;
  description: string;
}

interface ConnectionListProps {
  connections: Connection[];
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections }) => {
  if (connections.length === 0) return null;
  
  return (
    <div className="pt-4 border-t border-gray-100">
      <h4 className="text-sm font-semibold mb-4 text-gray-800">Systemforbindelser:</h4>
      <div className="space-y-3">
        {connections.map((connection, idx) => (
          <div key={idx} className="flex items-start p-3 bg-white rounded-lg shadow-sm border border-gray-50">
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2"></div>
            <div>
              <span className="text-gray-800">
                <span className="font-medium">{connection.from} → {connection.to}:</span> {connection.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionList;
