// @ts-nocheck
import { createContext, useContext, useState } from "react"
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { useSyncedStore } from "@syncedstore/react";
import { MappedTypeDescription } from "@syncedstore/core/types/doc";

interface Props {
  children: React.ReactNode | React.ReactNode[]
}

type ConnectionContextType = {
  setUpRoomContext: (data: {username:string, gameId: string}) => Promise<"Success" | "Fail">;
}

const connectionContext = createContext<ConnectionContextType>({} as ConnectionContextType);
export const store = syncedStore({playerList: [], gameStatus: "text"});
const doc = getYjsDoc(store);

export function ConnectionContextProvider({ children }: Props) {
  const [gameRoom, setGameRoom] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const state = useSyncedStore(store);

  async function setUpRoomContext(data: {username: string, gameId: string}) {
    setGameRoom(data.gameId);
    setUsername(data.username);
    const webRtcProvider = new WebrtcProvider(data.gameId, doc, {
      signaling: ['wss://signalling-server-2zwtarwoya-uw.a.run.app'],
      // password: "temp-game-password",
    });
    const result = await connectToServer(addPlayer(data.username));
    if ((result === "Done")) {
      console.log("player added")
      return "Success";
    } else {
      return "Fail";
    }
  };

  function connectToServer(theFunction: Function) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(theFunction());
      }, 2500);
    });
  }

  function addPlayer(username: string) {
    return (() => {
      state.playerList.push(username);
      console.log("player pushed")
      return "Done";
    });
  };

  return (
    <connectionContext.Provider value={{ setUpRoomContext }}>
      {children}
    </connectionContext.Provider>
  )
}

export function useConnectionContext(): ConnectionContextType {
  return useContext(connectionContext);
}

