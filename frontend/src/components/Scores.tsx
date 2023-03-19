import React from "react";
import ScoreCard from "./ScoreCard";
import { useConnectionContext } from "../context/ConnectionContext";

function Scores() {
  const { localGameState, username } = useConnectionContext(); 
  
  console.log(localGameState.players.map((player) => ("username:" + player.username + "score:" + player.score)));
  return (
    <div className="flex flex-col col-span-1">
      <div className="font-display text-white text-4xl pl-2 w-full text-center">
        scores
      </div>
      <div className="bg-[#e7e7e7] h-full p-4 flex flex-col gap-2">
        {localGameState.players.map((s, index) => (
          <ScoreCard key={index} name={s.username} score={s.score}></ScoreCard>
        ))}
      </div>
    </div>
  );
}

export default Scores;
