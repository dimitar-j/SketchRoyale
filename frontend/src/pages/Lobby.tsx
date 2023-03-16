import React from "react";
import { useParams } from "react-router-dom";
import Avatar from "../assets/Avatar.svg";
import { useConnectionContext } from "../context/ConnectionContext";
import NavBar from "../components/NavBar";

function Lobby() {
  const { id } = useParams();
  const { localGameState } = useConnectionContext(); 
  const startGame = () => {
    console.log("START GAME");
  };
 
  
  const Card = () => {
    console.log(localGameState);
    return (
      <div className="mt-6 bg-white rounded-lg p-8 shadow-2xl max-h-96 overflow-y-scroll">
        {localGameState.players.map((player: {username: string}, index:number) => (
          <div
            key={index}
            className="flex flex-row] border-b border-black py-4 gap-4 items-center"
          >
            <img src={Avatar} className=""></img>
            <div className="font-san">{player.username}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-blue w-[100vw] h-[100vh] px-10 lg:px-80 flex flex-col justify-center">
      <NavBar />
      <div className="font-display text-white text-6xl">Lobby</div>
      <div className="font-sans text-white text-xl">Game ID: {id}</div>
      {Card()}
      <button
        className="bg-red p-4 font-display text-3xl text-white w-full mt-4"
        onClick={startGame}
      >
        START GAME
      </button>
    </div>
  );
}

export default Lobby;
