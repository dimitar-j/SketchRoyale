import React from "react";
import { useSyncedStore } from "@syncedstore/react";
import { store } from "../components/SyncedStore";

export default function TestToDoList() {
  const state = useSyncedStore(store);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== "Enter") return;
    const target = event.target as HTMLInputElement;
    // Add a todo item using the text added in the textfield
    state.todos.push({ completed: false, title: target.value });
    target.value = "";
  }

  return (
    <div>
      <p>Todo items:</p>
      <ul>
        {state.todos.map((todo, i) => {
          return (
            <li key={i} style={{ textDecoration: todo.completed ? "line-through" : "" }}>
              <label>
                <input type="checkbox" readOnly checked={todo.completed} onClick={() => (todo.completed = !todo.completed)} />
                {todo.title}
              </label>
            </li>
          );
        })}
      </ul>
      <input
        placeholder="Enter a todo item and hit enter"
        type="text"
        onKeyDown={handleKeyPress}
        style={{ width: "200px", maxWidth: "100%" }}
      />
    </div>
  );
}

