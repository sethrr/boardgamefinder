import React, { useState, useEffect } from "react";
import axios from "axios"; // Using axios for better error handling

const GameFetcher = ({ gameIds }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameIds || gameIds.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const idString = gameIds.join(",");
        const response = await axios.get(
          `https://boardgamegeek.com/xmlapi2/thing??type=boardgame&stats=1&id=${idString}?historical=1`,
          {
            headers: { Accept: "application/xml" },
            transformResponse: [(data) => data] // Keep raw XML
          }
        );

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const gameItems = Array.from(xmlDoc.querySelectorAll("item"));

        const parsedGames = gameItems.map((item) => {
          const getValue = (selector, attr = "value") =>
            item.querySelector(selector)?.getAttribute(attr) || null;

          return {
            id: item.getAttribute("id"),
            type: item.getAttribute("type"),
            name: getValue("name"),
            thumbnail: item.querySelector("thumbnail")?.textContent,
            description: item.querySelector("description")?.textContent,
            minPlayers: getValue("minplayers"),
            maxPlayers: getValue("maxplayers"),
            minplaytime: getValue("minplaytime "),
            maxplaytime: getValue("maxplaytime "),
            complexityRating: getValue("averageweight")
          };
        });

        setGames(parsedGames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameIds]);

  if (loading) return <div>Loading game data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="game-list-container">
      <h2 className="game-recommendation-title">Here's what we recommend:</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id}>
            <div className="game">
              <img
                src={game.thumbnail}
                alt={`${game.name} thumbnail`}
                style={{ maxWidth: "100px" }}
              />
              <div className="game-details">
                <h3>{game.name}</h3>
                <p>
                  <strong>Playtime:</strong> {game.minplaytime} -{" "}
                  {game.maxplaytime} minutes
                </p>
                <p>
                  <strong>Players:</strong> {game.minPlayers} -{" "}
                  {game.maxPlayers}
                </p>
                <p>
                  <strong>Complexity Rating:</strong> {game.complexityRating} /
                  5
                </p>
                <details>
                  <summary>Game Description</summary>
                  <p>{game.description}</p>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameFetcher;
