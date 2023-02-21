import React from "react";
import { useParams } from "react-router-dom";
import Avatar from "../assets/Avatar.svg";

const EXAMPLE_PLAYERS = [
  "Brian",
  "Dimitar",
  "Ajay",
  "Jacob",
  "Gabe",
  "Brian",
  "Dimitar",
  "Ajay",
  "Jacob",
  "Gabe",
  "Brian",
  "Dimitar",
  "Ajay",
  "Jacob",
  "Gabe",
  "Brian",
  "Dimitar",
  "Ajay",
  "Jacob",
  "Gabe",
];

function Lobby() {
  const { id } = useParams();
  const startGame = () => {
    console.log("START GAME");
  };
  const Card = () => {
    return (
      <div className="mt-6 bg-white rounded-lg p-8 shadow-2xl max-h-96 overflow-y-scroll">
        {EXAMPLE_PLAYERS.map((player, index) => (
          <div
            key={index}
            className="flex flex-row] border-b border-black py-4 gap-4 items-center"
          >
            <img src={Avatar} className=""></img>
            <div className="font-san">{player}</div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="bg-blue w-[100vw] h-[100vh] px-10 lg:px-80 flex flex-col justify-center">
      <div className="font-display text-white text-6xl">Lobby</div>
      <div className="font-sans text-white text-xl">Game ID: {id}</div>
      {Card()}
      <button
        className="bg-red p-4 font-display text-3xl text-white w-[100%] mt-4"
        onClick={startGame}
      >
        START GAME
      </button>
    </div>
  );
}

export default Lobby;
