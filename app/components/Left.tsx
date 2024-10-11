import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { sortHistory, formatHistory } from "@/app/tool/utils";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutationDeleteChat } from "@/app/hooks/useMutationDeleteChat";
import ItemsList from "@/app/ui/ItemsList";

const Left: React.FC<{ selectedId: string; onSelectId: (id: string) => void }> = ({ selectedId, onSelectId }) => {
  const history = useSelector((state: RootState) => state.history.history);
  const sortedHistory = sortHistory(history);
  const formatedHistory = formatHistory(sortedHistory);
  const { mutateAsync } = useMutationDeleteChat();

  return (
    <div className="w-1/6 flex flex-col justify-start items-center p-3 m-3 border-primary border-2">
      <div className="mb-2">
        <Button variant="contained" onClick={() => onSelectId(uuidv4())}>NEW CHAT</Button>
      </div>
      <ItemsList items={formatedHistory} selectedId={selectedId} onSelectId={onSelectId} />
    </div>
  );
};

export default Left;
