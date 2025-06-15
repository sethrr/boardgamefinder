import { useState, useEffect } from "react";
import "../app/styles/card.css";
import GameFinder from "../app/components/GameFinder";
import Navigation from "../app/components/Navigation";

function Quiz() {

  return (
    <main className="main">
     <Navigation />
      <GameFinder />
    </main>
  );
}

export default Quiz;
