import React from "react";
import Avatar from "../assets/Avatar.svg";

interface Props {
  name: string;
  chat: string;
}

function ChatCard(props: Props) {
  return (
    <div className="bg-white shadow-md p-4 flex gap-2 items-center">
      <img src={Avatar}></img>
      <div className="flex flex-col">
        <div className="font-sans">{props.name}</div>
        <div className="font-sans text-xs">{props.chat}</div>
      </div>
    </div>
  );
}

export default ChatCard;
