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
  players: [
    {
      username: string;
      score: number;
      guesses: number;
      guessedWordCorrectly: boolean;
    }
  ];
  gameState: string;
  drawingBoard: { points: number[] }[];
};

type chatMessageType = {
  username: string;
  message: string;
};

type ConnectionContextType = {
  joinRoomContext: (data: {
    username: string;
    gameId: string;
    type: string;
  }) => void;
  localGameState: serverResponse;
  startGame: () => void;
  resetLocalVars: () => void;
  sendDrawing: () => void;
  handleDrawing: (drawing: Array<{ points: number[] }>) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  username: String;
  drawerConfirmed: () => void;
  handleNewChat: (chat: string) => void;
  localChatMessageState: chatMessageType[];
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
    players: [
      { username: "", score: 0, guesses: 0, guessedWordCorrectly: false },
    ],
    gameState: "",
    drawingBoard: [],
  });
  const [localChatMessageState, setLocalChatMessageState] = useState<
    chatMessageType[]
  >([] as any);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<String>("");
  const [primary, setPrimary] = useState(0);
  const servers = [
    "ws://136.159.5.25:8080",
    "ws://136.159.5.25:8081",
    "ws://136.159.5.25:8082",
  ];

  const connectToServer = (index: number, gameId: string, username: string) => {
    // connect to websocket
    // const newWs = new WebSocket("wss://ws-server-2zwtarwoya-uw.a.run.app");
    const newWs = new WebSocket(servers[index]);
    console.log(`Attempting to connect to ${servers[index]}`);
    newWs.onopen = () => {
      setWs(newWs);
      setPrimary(index);

      const data = {
        type: "introduce",
        message: {
          gameId,
          username,
        },
      };
      // send join message
      console.log("data", data);
      newWs.send(JSON.stringify(data));
    };

    newWs.onerror = (error) => {
      console.log("WebSocket Error: ", error);
      connectToServer((index + 1) % servers.length, gameId, username);
    };

    newWs.onclose = () => {
      console.log("Primary server has disconnected");
      connectToServer((index + 1) % servers.length, gameId, username);
    };

    newWs.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Response received from WS: ", response);
      if (response.type === "join-message") {
        const {
          gameId,
          host,
          currentDrawer,
          currentWord,
          players,
          gameState,
          chatMessages,
          drawingBoard,
        } = response.message;
        setLocalGameState({
          gameId,
          host,
          currentDrawer,
          currentWord,
          players,
          gameState,
          drawingBoard,
        });
        setLocalChatMessageState(chatMessages);
      }
      if (response.type === "game-error") {
        alert(response.message);
        resetLocalVars();
        setLoading(false);
        navigate("/");
      }
    };

    window.addEventListener("beforeunload", () => {
      if (newWs && newWs.readyState === WebSocket.OPEN) {
        const closeMessage = {
          type: "close",
          message: {
            gameId,
            username,
          },
        };
        newWs.send(JSON.stringify(closeMessage));
        newWs.close();
      }
    });
  };

  const joinRoomContext = (data: {
    username: string;
    gameId: string;
    type: string;
  }) => {
    // connect to websocket
    // const newWs = new WebSocket("wss://ws-server-2zwtarwoya-uw.a.run.app");
    const newWs = new WebSocket(servers[primary]);
    newWs.onopen = () => {
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

    newWs.onclose = () => {
      console.log("Primary server has disconnected");
      connectToServer(
        (primary + 1) % servers.length,
        data.gameId,
        data.username
      );
    };

    newWs.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Response received from WS: ", response);
      if (response.type === "join-message") {
        const {
          gameId,
          host,
          currentDrawer,
          currentWord,
          players,
          gameState,
          chatMessages,
          drawingBoard,
        } = response.message;
        setLocalGameState({
          gameId,
          host,
          currentDrawer,
          currentWord,
          players,
          gameState,
          drawingBoard,
        });
        setLocalChatMessageState(chatMessages);
      }
      if (response.type === "game-error") {
        alert(response.message);
        resetLocalVars();
        setLoading(false);
        navigate("/");
      }
    };

    window.addEventListener("beforeunload", () => {
      if (newWs && newWs.readyState === WebSocket.OPEN) {
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

  const startGame = () => {
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
  };

  const drawerConfirmed = () => {
    console.log("host pressed confirm button");
    if (ws && ws.readyState === WebSocket.OPEN) {
      const confirmMessage = {
        type: "drawer-confirm-word",
        message: {
          gameId: gameId,
          username: username,
        },
      };
      ws.send(JSON.stringify(confirmMessage));
    }
  };

  const sendDrawing = () => {
    console.log("sending drawing to server");
    if (ws && ws.readyState === WebSocket.OPEN) {
      const data = {
        type: "draw",
        message: {
          gameId,
          drawing: localGameState.drawingBoard,
        },
      };
      ws.send(JSON.stringify(data));
    }
  };

  const handleDrawing = (drawing: Array<{ points: number[] }>) => {
    setLocalGameState({ ...localGameState, drawingBoard: drawing });
  };

  const handleNewChat = (chat: string) => {
    console.log("sending new chat to server", chat);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const data = {
        type: "chat",
        message: {
          username,
          gameId,
          chat,
        },
      };
      ws.send(JSON.stringify(data));
    }
  };

  const resetLocalVars = () => {
    setLocalGameState({
      gameId: 0,
      host: "",
      currentDrawer: "",
      currentWord: "",
      players: [
        { username: "", score: 0, guesses: 0, guessedWordCorrectly: false },
      ],
      gameState: "",
      drawingBoard: [],
    });
    setLocalChatMessageState([] as any);
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
      value={{
        joinRoomContext,
        localGameState,
        startGame,
        resetLocalVars,
        username,
        loading,
        setLoading,
        drawerConfirmed,
        sendDrawing,
        handleDrawing,
        handleNewChat,
        localChatMessageState,
      }}
    >
      {children}
    </connectionContext.Provider>
  );
}

export function useConnectionContext(): ConnectionContextType {
  return useContext(connectionContext);
}
