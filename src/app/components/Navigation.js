import React from "react";
import { Link, useLocation } from "react-router-dom";
import LibraryGame from "../components/LibraryGame";
import Quiz from "../../pages/quiz";

const Navigation = ({ showLinks }) => {
  const location = useLocation();

  return (
    <div className="site-container">
      <div className="nav">
        <div className="nav-logo">
          <Link to="/" className="logo">
            <img src="/GameFinderLogo.png" alt="EavBoardGameFinder"></img>
          </Link>
        </div>
     
          <div className="nav-links">
           
              <Link className="nav-links-link" to="/quiz" element={<Quiz />}>
                Recommend A Game For Me
              </Link>
           
              <Link className="nav-links-link" to="/library" element={<LibraryGame />}>
                View Library
              </Link>

              <a className="nav-button next-button" href="https://discord.gg/tWaqEBJj">Join Our Discord</a>

          </div>
      
      </div>
    </div>
  );
};

export default Navigation;
