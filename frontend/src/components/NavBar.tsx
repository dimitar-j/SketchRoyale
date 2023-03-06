import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "../assets/Home.svg";

function NavBar () {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    return (
        <div>
            <img src={Home} className="h-10 z-50 fixed top-5 left-5 isolate-auto"onClick={goHome}></img>
        </div>
    );
} 

export default NavBar;