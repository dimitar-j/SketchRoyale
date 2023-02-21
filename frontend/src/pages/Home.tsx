import React from "react";
import hand from "../assets/hand.svg";

function Home() {
  return (
    <div className="w-[100%] h-[100vh] flex">
      <div className="w-[50%] h-[100vh] bg-blue text-white p-24 flex flex-col justify-center gap-5">
        <div className="font-display text-8xl">Sketch Royale</div>
        <div className="font-sans text-2xl">
          Compete with your friends in this fun and challenging drawing game
        </div>
        <img src={hand} width="75%"></img>
      </div>
      <div className="w-[50%] h-[100vh] bg-red"></div>
    </div>
  );
}

export default Home;
