import React from "react";
import Chat from "../components/Chat";
import Scores from "../components/Scores";
import SketchBox from "../components/SketchBox";

// TODO: make Scores and ChatBox responsive to vertical overflow (when there are a bunch of score or chat cards)

function Game() {
  return (
    <div className="bg-blue w-[100vw] h-[100vh] py-16 grid grid-cols-4 gap-4 relative">
      <Scores></Scores>
      <SketchBox></SketchBox>
      <Chat></Chat>
    </div>
  );
}

export default Game;
