import React from "react";

function SketchBox() {
  return (
    <div className="flex flex-col col-span-2">
      <div className="font-display text-white text-4xl pl-2">Your Word: </div>
      <div className="rounded-md bg-white h-full w-full shadow-2xl"></div>
    </div>
  );
}

export default SketchBox;
