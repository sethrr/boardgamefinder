import { useState, useEffect } from "react";
import "../app/styles/card.css";
import GameFinder from "../app/components/GameFinder";
import Navigation from "../app/components/Navigation";
import EventCallout from "../app/components/eventCallout";


function Quiz() {
  return (
    <main className="main">
      <Navigation />
      <EventCallout />
      <GameFinder />
    </main>
  );
}

export default Quiz;
