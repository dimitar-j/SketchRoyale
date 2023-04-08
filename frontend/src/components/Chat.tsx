import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import Plane from "../assets/Plane.svg";
import { useConnectionContext } from "../context/ConnectionContext";

function Chat() {
  const [newChat, setNewChat] = useState("");
  const { handleNewChat, localGameState, username, localChatMessageState } =
    useConnectionContext();
  const [guessNum, setGuessNum] = useState(3);
  useEffect(() => {
    localGameState.players.map((player) => {
      if (player.username == username) {
        setGuessNum(player.guesses);
      }
    });
  }, [localGameState]);
  const sendChat = () => {
    handleNewChat(newChat);
    setNewChat("");
  };

  const getRemainingGuesses = () => {
    const idx = localGameState.players.findIndex(
      (player) => player.username === username
    );
    return localGameState.players[idx].guesses;
  };

  return (
    <div className="flex flex-col col-span-1 h-full overflow-hidden">
      <div className="font-display text-white text-4xl pl-2 w-full text-center">
        Chat
      </div>
      <div className="bg-[#e7e7e7] h-full p-4 flex flex-col w-full justify-between overflow-auto">
        <div className="flex flex-col gap-2 h-full overflow-auto">
          {localChatMessageState.length > 0 &&
            localChatMessageState.map((c, index) => {
              return (
                <ChatCard
                  key={index}
                  name={c["username"]}
                  chat={c["message"]}
                  correct={c["message"] === localGameState.currentWord}
                ></ChatCard>
              );
            })}
        </div>
        <div>
          <div className="flex gap-2 w-full py-2">
            <input
              placeholder={
                localGameState.currentDrawer == username ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guesses == 0) ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guessedWordCorrectly == true)
                  ? "Unable to guess!"
                  : "Guess a word..."
              }
              className="grow col-span-3 border-2 p-2 min-w-0 border-black focus:outline-blue focus:rounded-none"
              value={newChat}
              onChange={(e) => setNewChat(e.target.value)}
              disabled={
                localGameState.currentDrawer == username ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guesses == 0) ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guessedWordCorrectly == true)
              }
            ></input>
            <button
              className="flex-none w-14 h-14 items-center justify-center col-span-1 font-display bg-red text-white p-2 text-xl disabled:bg-gray-400 disabled:text-black transition duration-200 shadow-md"
              onClick={sendChat}
              disabled={
                newChat === "" ||
                localGameState.currentDrawer == username ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guesses == 0) ||
                (localGameState.players.length > 0 &&
                  localGameState.players.find((p) => p.username === username)!
                    .guessedWordCorrectly == true)
              }
            >
              <img src={Plane}></img>
            </button>
          </div>
          {!(localGameState.currentDrawer == username) && (
            <p>{`Remaining Guesses: ${getRemainingGuesses()}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
