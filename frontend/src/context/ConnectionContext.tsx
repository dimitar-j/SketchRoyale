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

  const setupRoomContext = (data: { username: string, gameId: string }) => {
    // connect to websocket
    const newWs = new WebSocket("ws://localhost:8080");
    newWs.onopen = () => {
      console.log("connected");

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

  return (
    <connectionContext.Provider value={{ setupRoomContext, localGameState }}>
      {children}
    </connectionContext.Provider>
  )
}

export function useConnectionContext(): ConnectionContextType {
  return useContext(connectionContext);
}
