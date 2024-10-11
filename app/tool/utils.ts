import type { Schema } from "@/amplify/data/resource";

export const sortHistory = (history: Schema["ChatHistory"]["type"][]) => {
  return [...history].sort((a, b) => {
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });
};

export const formatHistory = (sortedHistory: Schema["ChatHistory"]["type"][]) => {
  return sortedHistory.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt || '').toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/').replace(/, /g, ' ')
  }));
};