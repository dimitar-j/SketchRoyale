import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
// import TestToDoList from ' ./pages/TestToDoList'
import { ConnectionContextProvider } from "./context/ConnectionContext";


function App() {
  return (
    <>
      <ConnectionContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby/:id" element={<Lobby />} />
            <Route path="/game/:id" element={<Game />} />
            {/* <Route path="/test" element={<TestToDoList />} /> */}
          </Routes>
        </BrowserRouter>
      </ConnectionContextProvider>
    </>
  );
}

export default App;
