import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type serverResponse = {
  gameId: number;
  host: string;
  currentDrawer: string;
  currentWord: string;
  players: [{ username: string , score: number, guesses: number, guessedWordCorrectly: boolean}];
  gameState: string;
  chatMessages: [];
  drawingBoard: [];
};

type ConnectionContextType = {
  joinRoomContext: (data: { username: string; gameId: string; type: string; }) => void;
  localGameState: serverResponse;
  startGame: () => void;
  resetLocalVars: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  username: String;
};

const connectionContext = createContext<ConnectionContextType>(
  {} as ConnectionContextType
);

export function ConnectionContextProvider({ children }: Props) {
  const [localGameState, setLocalGameState] = useState<serverResponse>({
    gameId: 0,
    host: "",
    currentDrawer: "",
    currentWord: "",
    players: [{ username: "" , score: 0, guesses: 0, guessedWordCorrectly: false}],
    gameState: "",
    chatMessages: [],
    drawingBoard: [],
  });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<String>("");

  const joinRoomContext = (data: { username: string; gameId: string; type: string; }) => {
    // connect to websocket
    // const newWs = new WebSocket("wss://ws-server-2zwtarwoya-uw.a.run.app");
    const newWs = new WebSocket("ws://localhost:8080");
    newWs.onopen = () => {
      console.log("connected");
      setWs(newWs);
      setGameId(data.gameId);
      setUsername(data.username);

      if (data.type === "join") {
      // create join message
        const joinMessage = {
          type: "join",
          message: {
            gameId: data.gameId,
            username: data.username,
          },
        };
        // send join message
        newWs.send(JSON.stringify(joinMessage));
      }
      if (data.type === "create") {
      // create create message
        const createMessage = {
          type: "create-room",
          message: {
            gameId: data.gameId,
            username: data.username,
          },
        };
        // send create message
        newWs.send(JSON.stringify(createMessage));
      }
    };

    newWs.onerror = (error) => {
      console.log("WebSocket Error: ", error);
    };

    newWs.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Response received from WS: ", response);
      if (response.type === "join-message") {
        setLocalGameState(response.message);
      }
      if (response.type === "game-error") {
        console.log(response.message);
        alert(response.message);
        resetLocalVars();
        setLoading(false);
        navigate("/");
      }
    };

    window.addEventListener("beforeunload", () => {
      console.log("abcd");
      if (newWs && newWs.readyState === WebSocket.OPEN) {
        console.log("abc");
        const closeMessage = {
          type: "close",
          message: {
            gameId: data.gameId,
            username: data.username,
          },
        };
        newWs.send(JSON.stringify(closeMessage));
        newWs.close();
      }
    });
  };

  const startGame = () =>{
    if (ws && ws.readyState === WebSocket.OPEN) {
      const startMessage = {
        type: "start-game",
        message: {
          gameId: gameId,
          username: username,
        },
      };
      ws.send(JSON.stringify(startMessage));
    }
  }

  const resetLocalVars = () => {
    setLocalGameState({
      gameId: 0,
      host: "",
      currentDrawer: "",
      currentWord: "",
      players: [{ username: "" , score: 0, guesses: 0, guessedWordCorrectly: false,}],
      gameState: "",
      chatMessages: [],
      drawingBoard: [],
    });
    if (ws && ws.readyState === WebSocket.OPEN) {
      const closeMessage = {
        type: "close",
        message: {
          gameId: gameId,
          username: username,
        },
      };
      ws.send(JSON.stringify(closeMessage));
      ws.close();
    }
  };

  return (
    <connectionContext.Provider
      value={{ joinRoomContext, localGameState, startGame, resetLocalVars, username, loading, setLoading }}
    >
      {children}
    </connectionContext.Provider>
  );
}

export function useConnectionContext(): ConnectionContextType {
  return useContext(connectionContext);
}
