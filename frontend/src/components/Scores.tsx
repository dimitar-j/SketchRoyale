import React from "react";
import ScoreCard from "./ScoreCard";

function Scores() {
  const EXAMPLE_SCORES = [
    {
      name: "Brian",
      score: 42,
    },
    {
      name: "Ajay",
      score: 52,
    },
    {
      name: "Jacob",
      score: 63,
    },
    {
      name: "Gabe",
      score: 22,
    },
    {
      name: "Dimitar",
      score: 44,
    },
  ];
  return (
    <div className="flex flex-col col-span-1">
      <div className="font-display text-white text-4xl pl-2 w-full text-center">
        scores
      </div>
      <div className="bg-[#e7e7e7] h-full p-4 flex flex-col gap-2">
        {EXAMPLE_SCORES.map((s, index) => (
          <ScoreCard key={index} name={s.name} score={s.score}></ScoreCard>
        ))}
      </div>
    </div>
  );
}

export default Scores;
