import React, { useState, useEffect } from "react";
import hand from "../assets/hand.svg";
import { useConnectionContext } from "../context/ConnectionContext";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function Home() {
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [hostname, setHostname] = useState("");
  const { setupRoomContext, joinRoomContext, localGameState, loading, setLoading } = useConnectionContext();
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Loading: ${loading}`);
  }, [loading]);

  const joinGame = () => {
    setLoading(true);
    const data = {
      gameId,
      username,
    };
    joinRoomContext(data);
    setGameId("");
    setUsername("");
  };

  async function generateGameId() {
    var minm = 100000;
    var maxm = 999999;
    const id = Math.floor(Math
      .random() * (maxm - minm + 1)) + minm;
    console.log(id);
    console.log(id.toString());
    return id.toString();
  }

  const createGame = async () => {
    setLoading(true);
    const data = {
      gameId: await generateGameId(),
      username: hostname,
    };
    setupRoomContext(data);
    setGameId("");
    setHostname("");
    console.log("Creating Game");
  };

  useEffect(() => {
    if (localGameState.gameState === "lobby"){
      setLoading(false);
      navigate("/lobby/" + localGameState.gameId);
    }
  }, [localGameState])

  const Banner = () => {
    return (
      <div className="w-1/2 h-[100vh] bg-blue text-white p-24 flex flex-col justify-center gap-5">
        <div className="font-display text-8xl">Sketch Royale</div>
        <div className="font-sans text-2xl">
          Compete with your friends in this fun and challenging drawing game
        </div>
        <div className="flex justify-center">
          <img src={hand} width="75%"></img>
        </div>
      </div>
    );
  };

  const Card = () => {
    return (
      <div className="w-1/2 h-[100vh] bg-red flex justify-center items-center">
        <div className="bg-white rounded-lg flex felx-col p-8 h-fit flex-col gap-3 shadow-xl">
          <div className="font-display text-black text-4xl">Join Game</div>
          <input
            placeholder="Game ID"
            className="border-2 p-2 border-black focus:outline-blue focus:rounded-none"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          ></input>
          <input
            placeholder="Username"
            className="border-2 p-2 border-black focus:outline-blue focus:rounded-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button
            className="font-display bg-red text-white p-2 text-xl disabled:bg-gray-200 disabled:text-black transition duration-200"
            onClick={joinGame}
            disabled={username === "" || gameId === ""}
          >
            JOIN
          </button>
          <div className="text-sans color-black text-center">or</div>
          <div className="font-display text-black text-4xl">Create Game</div>
          <input
            placeholder="Username"
            className="border-2 p-2 border-black focus:outline-blue focus:rounded-none"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          ></input>
          <button
            className="font-display bg-blue text-white p-2 text-xl disabled:bg-gray-200 disabled:text-black transition duration-200"
            onClick={createGame}
            disabled={hostname === ""}
          >
            CREATE GAME
          </button>
        </div>
      </div>
    );
  };

  return (
    loading ? <LoadingScreen /> :
      <div className="w-full h-[100vh] flex">
        {Banner()}
        {Card()}
      </div>
  );
}

export default Home;
