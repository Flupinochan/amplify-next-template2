import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div>
      <h1 className="flex flex-col justify-center items-center text-4xl text-primary font-bold p-4 pt-12">
        Chatbot
      </h1>
      <menu className="flex flex-row justify-center items-center space-x-12 text-3xl text-primary p-4">
        <Link href="https://tailwindcss.com/">TailwindCSS</Link>
        <Link href="https://nextjs.org/">Next.js</Link>
        <Link href="https://www.langchain.com/">Langchain</Link>
        <Link href="https://docs.amplify.aws/nextjs/">Amplify</Link>
      </menu>
    </div>
  );
};

export default Header;
