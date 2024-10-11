import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutationDeleteChat } from "@/app/hooks/useMutationDeleteChat";

const ItemsList: React.FC<{ items?: any[]; selectedId: string; onSelectId: (id: string) => void }> = ({ items = [], selectedId, onSelectId }) => {
  const { mutateAsync } = useMutationDeleteChat();

  return (
    <>
      {items.map(item => (
        <div key={item.id} className={`flex flex-row w-full my-1 ${selectedId === item.id ? 'border-2 border-primary bg-primary text-white' : 'border-2 border-primary hover:bg-gray-200'}`}>
          <div className="flex flex-row w-full">
            <button
              className="my-1 py-1 pl-1 w-full"
              onClick={() => onSelectId(item.id)}
            >
              {item.createdAt}
            </button>
            <button className={`m-1 rounded-full ${selectedId === item.id ? 'hover:bg-gray-300' : 'hover:bg-gray-400'}`} onClick={() => {mutateAsync(item.id);}}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ItemsList;