import React from "react";

function Lobby() {
  const Card = () => {
    return <div>card</div>;
  };
  return (
    <div className="bg-blue w-[100vw] h-[100vh] py-20 px-10 lg:px-80">
      <div className="font-display text-white text-6xl">Lobby</div>
      <div className="font-sans text-white text-xl">Game ID: </div>
      {Card()}
    </div>
  );
}

export default Lobby;
