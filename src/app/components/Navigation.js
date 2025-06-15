import React from "react";
import { Link, useLocation } from "react-router-dom";
import LibraryGame from "../components/LibraryGame";
import Quiz from "../../pages/quiz";

const Navigation = ({ showLinks }) => {
  const location = useLocation();
  const isLibraryPage = location.pathname === "/library";
  const isQuizPage = location.pathname === "/quiz";
  return (
    <div className="nav">
      <div className="nav-logo">
        <Link to="/" className="logo">
          <img src="/GameFinderLogo.png" alt="EavBoardGameFinder"></img>
        </Link>
      </div>
      {showLinks !== false && (
        <div className="nav-links"> 
          {!isQuizPage && (
            <Link to="/quiz" element={<Quiz />}>
              Recommend A Game For Me
            </Link>
          )}
          {!isLibraryPage && (
            <Link to="/library" element={<LibraryGame />}>
              View Library
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;
