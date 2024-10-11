import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from "react-syntax-highlighter";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative">
      <CopyToClipboard text={value} onCopy={handleCopy}>
        <button className={`absolute top-1 right-1 px-2 py-1 text-sm text-white rounded ${isCopied ? "bg-primary" : "bg-gray-700 hover:bg-gray-600"}`}>{isCopied ? "Copied!" : "Copy"}</button>
      </CopyToClipboard>
      <SyntaxHighlighter className="rounded-md" language={language} style={atomOneDark}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;