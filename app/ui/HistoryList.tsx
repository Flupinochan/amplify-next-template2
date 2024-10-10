import React from 'react';
import type { Schema } from "@/amplify/data/resource";

interface HistoryListProps {
  history: Schema["ChatHistory"]["type"][];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  return (
    <>
      {history.map((item) => (
        <div key={item.id} className="mb-2">
          <div>{item.messages.map((msg, index) => {
            const textMatch = msg?.match(/text=([^,}]+)/);
            const typeMatch = msg?.match(/type=([^,}]+)/);
            const text = textMatch ? textMatch[1] : '';
            const type = typeMatch ? typeMatch[1] : '';
            return (
              <div key={`${item.id}-${text}-${index}`} className={`p-2 rounded-lg mb-2 ${type === 'human' ? 'bg-blue-200' : 'bg-green-200'}`}>
                {text}
              </div>
            );
          })}</div>
        </div>
      ))}
    </>
  );
};

export default HistoryList;