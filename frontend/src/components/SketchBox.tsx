import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Line, Text } from "react-konva";
import { useConnectionContext } from "../context/ConnectionContext";

function SketchBox() {
  const { localGameState, username } = useConnectionContext();
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<Array<{ tool: string; points: number[] }>>(
    []
  );
  const isDrawing = useRef<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    console.log(lines);
  };

  return (
    <div className="flex flex-col col-span-2 justify-center items-center">
      {localGameState.currentDrawer === username ? 

      <div className="font-display text-white text-4xl pl-2">Your Word: {localGameState.currentWord}</div> :
      
      <div className="font-display text-white text-4xl pl-2">{"_ ".repeat(localGameState.currentWord.length)}</div>
      }
      <div
        ref={parentRef}
        className="rounded-md bg-white h-[600px] w-[600px] shadow-2xl"
      >
        <Stage
          width={600}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#FE5A43"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default SketchBox;
