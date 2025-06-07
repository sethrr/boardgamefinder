import { useState, useEffect } from "react";
import "../app/styles/card.css";
import GameFinder from "../app/components/GameFinder";
import { Link } from "react-router-dom";
function Quiz() {
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
        <div className="game-settings">
          <div className="question-slide">
            <div className="intro-container">
              <h1> Looking for a game? We can help.</h1>
              <p>
                {" "}
                Fill out a few questions and we will recommend a game for you to
                play.{" "}
              </p>
              <button className="nav-button next-button" onClick={handleToggle}>
                Let's Go!
              </button>
            </div>
          </div>
          <div className="settings-container">
            <Link className="nav-button next-button settings" to="/settings">
              See Settings
            </Link>
          </div>
        </div>
      ) : (
        <>
          <GameFinder />
          <button
            className="nav-button next-button start-over"
            onClick={handleToggle}
          >
            Start Over
          </button>
       
        </>
      )}
    </main>
  );
}

export default Quiz;
