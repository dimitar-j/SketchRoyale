import React from "react";
import Chat from "../components/Chat";
import Scores from "../components/Scores";
import SketchBox from "../components/SketchBox";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useConnectionContext } from "../context/ConnectionContext";
// TODO: make Scores and ChatBox responsive to vertical overflow (when there are a bunch of score or chat cards)

function Game() {
  const { localGameState, username } = useConnectionContext();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(localGameState);
    if (localGameState.gameId == 0){
      navigate("/");
    }
  }, [localGameState]);
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
