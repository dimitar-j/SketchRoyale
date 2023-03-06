import React from "react";
import Chat from "../components/Chat";
import Scores from "../components/Scores";
import SketchBox from "../components/SketchBox";
import NavBar from "../components/NavBar";

// TODO: make Scores and ChatBox responsive to vertical overflow (when there are a bunch of score or chat cards)

function Game() {
  return (
    <div className="bg-blue w-[100vw] h-[100vh]">
      <NavBar />
      <div className=" py-16 px-8 grid grid-cols-4 gap-4 relative">
        <Scores></Scores>
        <SketchBox></SketchBox>
        <Chat></Chat>
      </div>
    </div>
  );
}

export default Game;
