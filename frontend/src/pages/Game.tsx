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
  const { localGameState, username, drawerConfirmed } = useConnectionContext();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(localGameState);
    if (localGameState.gameId == 0) {
      navigate("/");
    }
  }, [localGameState]);

  function handleDrawerConfirm() {
    drawerConfirmed();
  }

  if (localGameState.gameState === "drawer-confirm-word") {
    if (localGameState.currentDrawer === username) {
      return (
        <div className="bg-blue w-[100vw] h-[100vh]">
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex flex-col space-y-6 justify-center items-center bg-white rounded-lg shadow-2xl p-8">
              <div className="text-xl">
                {"You are the drawer! Your word is: "}
              </div>
              <div className="text-3xl font-extrabold">
                {localGameState.currentWord.toUpperCase()}
              </div>
              <div className="w-full">
                <button
                  onClick={handleDrawerConfirm}
                  className="bg-red p-4 font-display text-3xl text-white w-full"
                >
                  GO!
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (localGameState.currentDrawer !== username) {
      return (
        <div className="bg-blue w-[100vw] h-[100vh]">
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex flex-col space-y-6 justify-center items-center bg-white rounded-lg shadow-2xl w-1/4 h-1/4 p-8">
              <div className="text-xl">
                {"Waiting for the drawer to confirm word..."}
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else if (localGameState.gameState === "game") {
    return (
      <div className="bg-blue w-[100vw] h-[100vh]">
        <NavBar />
        <div className=" py-16 px-8 grid grid-cols-4 gap-4 h-full relative">
          <Scores></Scores>
          <SketchBox></SketchBox>
          <Chat></Chat>
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default Game;
