"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

interface Todo {
  id: string;
  message: string;
  description: string;
}

const page = () => {
  const [message, setMessage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const httpUrl = "http://localhost:5000";
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8008");
    setWs(ws);

    ws.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);
      const { type, message, description, id } = parsedData;

      if (type === "todo") {
        setTodos((prev) => [
          ...prev,
          {
            id,
            message,
            description,
          },
        ]);
      }
    };
  }, []);

  const addTodo = async () => {
    if (!ws) {
      return;
    }
    const res: any = await axios.post(`${httpUrl}/todo`, {
      message,
      description,
    });

    ws.send(
      JSON.stringify({
        type: "todo",
        id: res.data.todo.id,
        message: res.data.todo.message,
        description: res.data.todo.description,
      })
    );
  };

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center flex-col">
      <input
        type="text"
        placeholder="enter todo message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="text"
        placeholder="enter todo description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTodo}>add todo</button>
      <br />
      <br />
      <p>all my todos</p>
      {todos.map((todo) => (
        <div key={todo.id}>
          <p>todoId: {todo.id}</p>
          <p>todo message: {todo.message}</p>
          <p>todo description: {todo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
