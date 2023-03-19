import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../assets/Avatar.svg";
import { useConnectionContext } from "../context/ConnectionContext";
import NavBar from "../components/NavBar";

function Lobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startGame, localGameState, username } = useConnectionContext();
  const canPlay = localGameState.players.length !== 1;

  const startGameHandler = () => {
    console.log("START GAME");
    // send message to server of type "start-game"
    startGame();
  };

  useEffect(() => {
    if (localGameState.gameId == 0) {
      navigate("/");
    }
    if (
      localGameState.gameState === "game" ||
      localGameState.gameState === "drawer-confirm-word"
    ) {
      navigate("/game/" + localGameState.gameId);
    }
  }, [localGameState]);

  useEffect(() => {
    console.log(username);
  }, []);

  const Card = () => {
    console.log(localGameState);
    return (
      <div className="mt-6 bg-white rounded-lg p-8 shadow-2xl max-h-96 overflow-y-scroll">
        {localGameState.players.map(
          (player: { username: string }, index: number) => (
            <div
              key={index}
              className="flex flex-row] border-b border-black py-4 gap-4 items-center"
            >
              <img src={Avatar} className=""></img>
              <div className="font-san">{player.username}</div>
              {player.username === localGameState.host && (
                <img src="/star-solid.svg" width="15" height="15" />
              )}
            </div>
          )
        )}
      </div>
    );
  };
  return (
    <div className="bg-blue w-[100vw] h-[100vh] px-10 lg:px-80 flex flex-col justify-center">
      <NavBar />
      <div className="font-display text-white text-6xl">Lobby</div>
      <div className="font-sans text-white text-xl">Game ID: {id}</div>
      {Card()}
      {localGameState.host === username && (
        <button
          className={`bg-${
            canPlay ? "red" : "slate-400"
          } p-4 font-display text-3xl text-white w-full mt-4`}
          id="start-button"
          onClick={startGameHandler}
          disabled={!canPlay}
        >
          {canPlay ? `START GAME` : "WAITING FOR PLAYERS TO JOIN"}
        </button>
      )}
      {localGameState.host != username && (
        <div className="bg-red p-4 font-display text-3xl text-white w-full mt-4 text-center">
          Waiting for host to start...
        </div>
      )}
    </div>
  );
}

export default Lobby;
