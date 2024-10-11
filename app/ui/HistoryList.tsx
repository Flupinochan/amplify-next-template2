import React from 'react';
import type { Schema } from "@/amplify/data/resource";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import CodeBlock from './CodeBlock';

interface HistoryListProps {
  history: Schema["ChatHistory"]["type"][];
}

// DynamoDBのMapは、String型のObjectを返すため、抽出する必要がある
const renderMessage = (msg: string, itemId: string, index: number) => {
  console.log(msg);
  // 末尾から、type=の値を取得
  const typeMatch = msg.match(/type=(\w+)}$/);
  const type = typeMatch ? typeMatch[1] : 'unknown';

  // 1.行頭から{additional_kwargs={}, を削除
  const withoutAdditional = msg.replace(/^{additional_kwargs={}, /, '');
  // 2.末尾から, type=xxx}を削除
  const withoutType = withoutAdditional.replace(/, type=\w+}$/, '');
  // 3.text=を削除
  const textMatch = withoutType.match(/^text=/);
  const text = textMatch ? withoutType.substring(textMatch[0].length) : '';

  return (
    <div key={`${itemId}-${text}-${index}`} className={`p-2 rounded-lg mb-2 ${type === 'human' ? 'bg-blue-200' : 'bg-green-200'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        className={`markdown break-words`}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const inline = node?.properties?.inline || false;
            return !inline && match ? (
              <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <>
      {sortedHistory.map((item) => (
        <div key={item.id} className="mb-2">
          <div>{item.messages.map((msg, index) => renderMessage(msg ?? '', item.id, index))}</div>
        </div>
      ))}
    </>
  );
};

export default HistoryList;
