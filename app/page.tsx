"use client";

import Left from "./components/Left";
import Center from "./components/Center";
import Right from "./components/Right";

export default function App() {
  return (
          <main className="flex flex-row justify-center items-center">
            <Left />
            <Center />
            <Right />
          </main>
  );
}
