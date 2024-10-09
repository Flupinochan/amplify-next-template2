"use client";

import React from "react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

Amplify.configure(outputs);
const client = generateClient<Schema>();

const Center: React.FC = () => {
  const [todos, setTodos] = useState<Array<Schema["ChatHistory"]["type"]>>([]);
  const [uuid, setUuid] = useState<string>(uuidv4());

  function listTodos() {
    client.models.ChatHistory.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.ChatHistory.create({
      id: "test",
      email: "text@gmail.com",
      messages: window.prompt("Chat content")!,
    });
  }

  function chatOpenAI() {
    client.queries.ChatOpenAI({ 
      id: "test",
      email: "text@gmail.com",
      messages: "Hello World",
    });
  }

  return (
    <div className="w-1/2 flex flex-col justify-center items-center p-3 m-3 border-primary border-2">
      Center
      <Button onClick={createTodo}>Create Todo</Button>
      <div>{uuid}</div>
      <Button onClick={chatOpenAI}>Chat OpenAI</Button>
      <div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.messages}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Center;
