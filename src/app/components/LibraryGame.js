import React, { useState, useEffect } from "react";
import "../styles/game-cards.css";

const LibraryGame = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Filter states
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [playTimeFilter, setPlayTimeFilter] = useState("all");
  const [sortOption, setSortOption] = useState("alphabetical");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_AIRTABLE_TABLE}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data.records || []);
        setFilteredGames(data.records || []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let result = [...games];
    
    // Apply complexity filter
    if (complexityFilter !== "all") {
      result = result.filter(game => 
        game.fields["Weight / Complexity"]?.toLowerCase().includes(complexityFilter)
      );
    }
    
    // Apply play time filter
    if (playTimeFilter !== "all") {
      const [minTime, maxTime] = playTimeFilter.split("-").map(Number);
      result = result.filter(game => {
        const playTime = game.fields["Avg Play Time"];
        if (!playTime) return false;
        
        const times = playTime.match(/\d+/g);
        if (!times || times.length < 2) return false;
        
        const avgTime = (parseInt(times[0]) + parseInt(times[1])) / 2;
        return avgTime >= minTime && avgTime <= maxTime;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.fields["Game Name"]?.localeCompare(b.fields["Game Name"]);
      } else if (sortOption === "owner") {
        return a.fields["Owned By"]?.localeCompare(b.fields["Owned By"]);
      }
      return 0;
    });
    
    setFilteredGames(result);
  }, [games, complexityFilter, playTimeFilter, sortOption]);

  if (isLoading) {
    return <div className="status-message loading">Loading games...</div>;
  }

  if (errorMessage) {
    return <div className="status-message error">Error: {errorMessage}</div>;
  }

  if (games.length === 0) {
    return <div className="status-message empty">No games found</div>;
  }

  return (
    <>
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="complexity">Complexity:</label>
          <select 
            id="complexity"
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
          >
            <option value="all">All Complexities</option>
            <option value="easy">Easy</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="complex">Complex</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="playtime">Play Time:</label>
          <select 
            id="playtime"
            value={playTimeFilter}
            onChange={(e) => setPlayTimeFilter(e.target.value)}
          >
            <option value="all">All Durations</option>
            <option value="0-30">Under 30min</option>
            <option value="30-60">30min - 1hr</option>
            <option value="60-90">1hr - 1.5hr</option>
            <option value="90-120">1.5hr - 2hr</option>
            <option value="120-300">2+ hours</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort">Sort By:</label>
          <select 
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="alphabetical">A-Z</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>
      
      <div className="games-library-container">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-card-header">
                <h2>{game.fields["Game Name"]}</h2>
                <span className="year">{game.fields["Year Published"]}</span>
              </div>

              <div className="game-card-body">
                <div className="info-section">
                  <div>BGG Rating: {game.fields["BGG Rating"]}/10</div>
                </div>

                <div className="info-section">
                  <div>Players: {game.fields["Player Count"] || "Not specified"}</div>
                  <div>Best with {game.fields["Recommended Players"] || "Not specified"}</div>
                </div>

                <div className="info-section">
                  <div>Play Time: {game.fields["Avg Play Time"]}</div>
                </div>

                <div className="info-section">
                  <div>Complexity: {game.fields["Weight / Complexity"]} ({game.fields["Weight"]})</div>
                </div>

                <div className="info-section">
                  <div>Owned by: {game.fields["Owned By"]}</div>
                </div>
              </div>

              <a
                href={game.fields["BGG Link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="bgg-link"
              >
                View on BoardGameGeek
              </a>
            </div>
          ))
        ) : (
          <div className="status-message empty">No games match your filters</div>
        )}
      </div>
    </>
  );
};

export default LibraryGame;