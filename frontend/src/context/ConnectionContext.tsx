import { createContext, useContext, useState } from "react"

interface Props {
  children: React.ReactNode | React.ReactNode[]
};

type serverResponse = {
  gameId: number,
  host: string,
  players: [{ username: string }],
  gameState: string,
  chatMessages: []
};

type ConnectionContextType = {
  setupRoomContext: (data: { username: string, gameId: string }) => void;
  localGameState: serverResponse;
  resetLocalVars: () => void;
};


const connectionContext = createContext<ConnectionContextType>({} as ConnectionContextType);

export function ConnectionContextProvider({ children }: Props) {
  const [localGameState, setLocalGameState] = useState<serverResponse>({
    gameId: 0,
    host: "",
    players: [{ username: "" }],
    gameState: "",
    chatMessages: []
  });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  
  const setupRoomContext = (data: { username: string, gameId: string }) => {
    // connect to websocket
    const newWs = new WebSocket("wss://ws-server-2zwtarwoya-uw.a.run.app");
    // const newWs = new WebSocket("ws://localhost:8080");
    newWs.onopen = () => {
      console.log("connected");
      setWs(newWs);
      setGameId(data.gameId);
      setUsername(data.username);

      const joinMessage = {
        type: 'join',
        message: {
          gameId: data.gameId,
          username: data.username
        }
      };
      newWs.send(JSON.stringify(joinMessage));
    }

    newWs.onerror = (error) => {
      console.log("WebSocket Error: ", error);
    }

    newWs.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Response received from WS: ", response);
      if (response.type === "join-message") {
        setLocalGameState(response.message);
      }

    }

    window.addEventListener('beforeunload', () => {
      console.log('abcd');
      if (newWs && newWs.readyState === WebSocket.OPEN) {
        console.log("abc")
        const closeMessage = {
          type: 'close',
          message: {
            gameId: data.gameId,
            username: data.username
          }
        }
        newWs.send(JSON.stringify(closeMessage));
        newWs.close();
      }
    });
  }

  const resetLocalVars = () => {
    setLocalGameState({
      gameId: 0,
      host: "",
      players: [{ username: "" }],
      gameState: "",
      chatMessages: []
    });
    if (ws && ws.readyState === WebSocket.OPEN) {
      const closeMessage = {
        type: 'close',
        message: {
          gameId: gameId,
          username: username
        }
      }
      ws.send(JSON.stringify(closeMessage));
      ws.close();
    }
  }

  function removePlayer(username: string) {
    return (() => {
      state.playerList = state.playerList.filter((player) => player !== username);
      // console.log("player removed");
      return "Done";
    });
  }

  return (
    <connectionContext.Provider value={{ setupRoomContext, localGameState, resetLocalVars }}>
      {children}
    </connectionContext.Provider>
  )
}

export function useConnectionContext(): ConnectionContextType {
  return useContext(connectionContext);
}
