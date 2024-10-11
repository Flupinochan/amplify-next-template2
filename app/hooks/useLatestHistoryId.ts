import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const useLatestHistoryId = () => {
  const history = useSelector((state: RootState) => state.history.history);
  if (history.length === 0) {
    return '';
  }

  const latestHistory = history.reduce((prev, current) => {
    const prevDate = prev.createdAt!;
    const currentDate = current.createdAt!;
    return (currentDate > prevDate) ? current : prev;
  });
  const latestId = latestHistory.id;

  return latestId
};

export default useLatestHistoryId;