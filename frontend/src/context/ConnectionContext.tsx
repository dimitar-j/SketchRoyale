import { createContext, useContext, useState } from "react"

interface Props {
  children: React.ReactNode | React.ReactNode[]
};

type serverResponse = {
  gameId: number,
  host: string,
  players: [{username: string}],
  gameState: string,
  chatMessages: []
};

type ConnectionContextType = {
  setupRoomContext: (data: {username: string, gameId: string}) => void;
  localGameState: serverResponse;
  resetLocalVars: () => void;
};

const connectionContext = createContext<ConnectionContextType>({} as ConnectionContextType);

export function ConnectionContextProvider({ children }: Props) {
  const [localGameState, setLocalGameState] = useState<serverResponse>({
    gameId: 0,
    host: "", 
    players: [{username: ""}], 
    gameState: "", 
    chatMessages: []
  });
  const [ws, setWs] = useState<WebSocket | null>(null);

  const setupRoomContext = (data: { username: string, gameId: string }) => {
    // connect to websocket
    const newWs = new WebSocket("wss://ws-server-2zwtarwoya-uw.a.run.app");
    newWs.onopen = () => {
      console.log("connected");
      setWs(newWs);

      const joinMessage = {
        type: 'join',
        message: {
          gameId: data.gameId,
          username: data.username
        }
      };
      newWs.send(JSON.stringify(joinMessage));
    }

    newWs.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Response received from WS: ", response);
      if (response.type === "join-message") {
        setLocalGameState(response.message);
      }
    }
  }

  const resetLocalVars = () => {
    setLocalGameState({
      gameId: 0,
      host: "",
      players: [{username: ""}],
      gameState: "",
      chatMessages: []
    });
    if (ws){
      ws.close();
    }
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
