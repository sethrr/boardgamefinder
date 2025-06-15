import React from "react";
import { Link } from "react-router-dom";
import "../../src/app/styles/home.css";
import Navigation from "../app/components/Navigation";

const Home = () => {
  return (
    <main className="main">
      <Navigation showLinks={false}/>

      <div className="home-container">
        <div className="cards-container">
          <Link to="/library" className="card-link">
            <div className="card">
              <div className="card-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-32 -24 64 50"
                  fill="currentColor"
                >
                  <path
                    stroke="none"
                    fill="#d4a17b"
                    d="M-1 24.85 Q-6.75 21.5 -19.05 21 -21.85 20.9 -25.05 20.95 L-26.95 21 -27.3 21 -27.95 21 -28 21 -28.3 21 -28.95 21 -29.95 20.75 -30.7 20.05 -31 19 -31 -17 Q-31 -17.85 -30.4 -18.4 -29.85 -19 -29 -19 L-26 -19 -26 11 Q-26 12.2 -25.15 13.1 L-25.05 13.2 Q-24.25 13.95 -23.1 14 L-18.05 14.3 Q-6.65 15.25 -1.3 17.8 L0 18.1 1.35 17.8 Q6.4 15.35 16.95 14.35 L23.15 14 Q24.15 13.95 24.95 13.3 L25.15 13.1 Q26 12.2 26 11 L26 -19 29 -19 Q29.85 -19 30.45 -18.4 31 -17.85 31 -17 L31 19 30.75 20.05 30 20.75 28.95 21 28.3 21 28 21 27.95 21 27.3 21 26.95 21 24.95 20.95 17.95 21.05 Q6.55 21.7 1.05 24.85 L0 25.1 -1 24.85 M0 13.1 Q-5.75 10.25 -21 9.1 L-22 9 -22 -23 -20.9 -22.9 Q-10.85 -22.1 -6.25 -21 -2.65 -20.15 -0.2 -19 L0 -18.9 0.25 -19 Q2.7 -20.15 6.3 -21 10.15 -21.9 22 -23 L22 9 17.95 9.4 Q5.35 10.45 0 13.1"
                  />
                </svg>
              </div>
              <h2 className="card-title">View Our Board Game Library</h2>
              <p className="card-description">
                Browse our complete collection of board games. Filter by
                category, player count, or difficulty.
              </p>
            </div>
          </Link>

          <Link to="/quiz" className="card-link">
            <div className="card">
              <div className="card-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-30 -32 60 64"
                  fill="currentColor"
                >
                  <path
                    stroke="none"
                    fill="#d4a17b"
                    d="M2.9 -30.2 L24.05 -17.7 Q25.45 -16.9 26.2 -15.5 27 -14.15 27 -12.55 L27 12.5 Q27 14.1 26.2 15.5 25.45 16.85 24.05 17.65 L2.9 30.2 Q1.5 31 -0.05 31 -1.6 31 -2.95 30.2 L-24.1 17.65 Q-25.45 16.85 -26.25 15.5 -27 14.1 -27 12.5 L-27 -12.55 Q-27 -14.15 -26.25 -15.45 -25.45 -16.9 -24.1 -17.7 L-2.95 -30.2 Q-1.6 -31 -0.05 -31 1.5 -31 2.9 -30.2 M2.8 1.5 L1.6 2.8 Q1.2 4 -0.2 4 L-1 3.9 Q-1.8 3.6 -2.1 2.8 -2.4 2.1 -2.1 1.3 -1.5 0 0 -1.3 1.8 -3.3 1.8 -4 1.6 -6 -0.2 -6 -1.3 -6 -2 -5.1 -2.4 -4.4 -3.1 -4.1 L-4.6 -4.2 Q-5.3 -4.6 -5.6 -5.3 -5.9 -6.1 -5.5 -6.8 -3.9 -10 -0.2 -10 2.8 -10 4.5 -7.9 5.8 -6.2 5.8 -4 5.8 -1.5 2.8 1.5 M-4.8 0.05 L-4.9 0.25 Q-5.6 2.15 -4.9 3.85 L-4.85 4 -4.6 4.5 Q-5.2 5.45 -5.2 7 L-5.2 9 Q-5.2 13 -1.2 13 L0.8 13 Q4.8 13 4.8 9 L4.8 7 Q4.8 5.4 4.2 4.45 L5 3.55 4.95 3.65 Q9 -0.45 8.8 -4 8.8 -7.25 6.9 -9.7 L6.85 -9.75 Q4.3 -13 -0.2 -13 -5.7 -13 -8.1 -8.3 -9.2 -6.4 -8.4 -4.25 L-8.35 -4.1 Q-7.7 -2.5 -6.1 -1.6 -5.2 -1.1 -4.25 -0.95 L-4.8 0.05 M1.8 9 Q1.8 10 0.8 10 L-1.2 10 Q-2.2 10 -2.2 9 L-2.2 7 Q-2.2 6 -1.2 6 L0.8 6 Q1.8 6 1.8 7 L1.8 9"
                  />
                </svg>
              </div>
              <h2 className="card-title">Need A Game Recommendation?</h2>
              <p className="card-description">
                Take our AI quiz and get personalized recommendations from our
                library based on your preferences.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
