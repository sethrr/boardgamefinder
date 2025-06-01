import { useState, useEffect } from "react";
import "../app/styles/card.css";
import GameSettings from "../app/components/GameSettings";

function Settings() {

  return (
    <main className="main">
      <div className="logo">
        <img src="/GameFinderLogo.png" alt="EavBoardGameFinder"></img>
      </div>
      <GameSettings />
    </main>
  );
}

export default Settings;
