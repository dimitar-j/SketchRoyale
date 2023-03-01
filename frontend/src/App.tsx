import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestToDoList from './pages/TestToDoList'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestToDoList />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App