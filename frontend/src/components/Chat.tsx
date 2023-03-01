import React, { useState } from "react";
import ChatCard from "./ChatCard";
import Plane from "../assets/Plane.svg";

function Chat() {
  const [newChat, setNewChat] = useState("");
  const EXAMPLE_CHATS = [
    {
      name: "Brian",
      chat: "House",
    },
    {
      name: "Ajay",
      chat: "Dog",
    },
    {
      name: "Jacob",
      chat: "Banana",
    },
    {
      name: "Gabe",
      chat: "California",
    },
  ];
  const sendChat = () => {
    setNewChat("");
  };
  return (
    <div className="flex flex-col col-span-1">
      <div className="font-display text-white text-4xl pl-2">Chat</div>
      <div className="bg-[#e7e7e7] h-full p-4 flex flex-col w-full justify-between">
        <div className="flex flex-col gap-2">
          {EXAMPLE_CHATS.map((c, index) => (
            <ChatCard name={c.name} chat={c.chat}></ChatCard>
          ))}
        </div>
        <div className="flex gap-2 w-full">
          <input
            placeholder="Guess a word..."
            className="grow col-span-3 border-2 p-2 min-w-0 border-black focus:outline-blue focus:rounded-none"
            value={newChat}
            onChange={(e) => setNewChat(e.target.value)}
          ></input>
          <button
            className="flex-none w-14 h-14 items-center justify-center col-span-1 font-display bg-red text-white p-2 text-xl disabled:bg-gray-400 disabled:text-black transition duration-200 shadow-md"
            onClick={sendChat}
            disabled={newChat === ""}
          >
            <img src={Plane}></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
