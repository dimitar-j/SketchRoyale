import React from "react";
import Avatar from "../assets/Avatar.svg";

interface Props {
  name: string;
  chat: string;
  correct: boolean;
}

function ChatCard(props: Props) {
  console.log(props);
  return (
    <div
      className={`bg-${
        props.correct ? "[#9cc069]" : "white"
      } shadow-md p-4 flex gap-2 items-center`}
    >
      <img src={Avatar}></img>
      <div className="flex flex-col">
        <div className="font-sans">{props.name}</div>
        <div className="font-sans text-xs">
          {props.correct ? "GUESSED THE CORRECT WORD!" : props.chat}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
