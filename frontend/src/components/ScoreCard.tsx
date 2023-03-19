import React from "react";
import Avatar from "../assets/Avatar.svg";
import { useConnectionContext } from "../context/ConnectionContext";

interface Props {
  name: string;
  score: number;
}

function ScoreCard(props: Props) {
  const { localGameState } = useConnectionContext();

  return (
    <div className="bg-white shadow-md p-4 flex gap-2 items-center">
      <img src={Avatar}></img>
      <div className="flex flex-col" key={props.name}>
        <div className="flex flex-row space-x-2 font-sans">
          <div>
            {props.name}
          </div>
          <div className="flex flex-row space-x-2">
            {props.name === localGameState.host && (
              <img src="/star-solid.svg" width="15" height="15" />
            )}
            {props.name === localGameState.currentDrawer && (
              <img src="/pencil-solid.svg" width="15" height="15"/>
            )}
          </div>
        </div>
        <div className="font-sans text-xs">{props.score}</div>
      </div>
    </div>
  );
}

export default ScoreCard;
