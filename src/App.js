import { useState } from "react";
import "./card.css";
import GameFinder from "./GameFinder";

function App() {
  const [activeFinder, setActiveFinder] = useState(false);

  const handleToggle = () => {
    setActiveFinder((prevState) => !prevState); // Toggles the state
  };

  return (
    <main className="main">
      <div className="logo">
        <img src="/GameFinderLogo.png" alt="EavBoardGameFinder"></img>
      </div>
      {!activeFinder ? (
        <div className="finder-container">
        <div className="question-slide">
        <div className="intro-container">
          <h1> Looking for a game? We can help.</h1>
          <p> Fill out a few questions and we will recommend a game for you to play. </p>
          <button className="nav-button next-button" onClick={handleToggle}>Let's Go!</button>
        </div>
        </div>
        </div>
      ) : (
        <>
          <GameFinder />
          <button className="nav-button next-button start-over" onClick={handleToggle}>
            Start Over
          </button>
        </>
      )}
    </main>
  );
}

export default App;
