import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";

function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-blue flex justify-center items-center">
      <ReactLoading type="bubbles" color="white" height={200} width={200} />
    </div>
  );
}
export default LoadingScreen;
