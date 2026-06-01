import { useState, useEffect } from "react";
import {
  batchUpdateVisibility,
  fetchAllAirtableRecords,
  isRecordVisible,
  updateRecordVisibility
} from "./fetchAirtable";
import "../styles/game-settings.css";

export default function GameSettings() {
  const [games, setGames] = useState([]);
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const records = await fetchAllAirtableRecords();
      const visibilityMap = {};

      records.forEach((record) => {
        visibilityMap[record.id] = isRecordVisible(record);
      });

      setGames(records);
      setVisibility(visibilityMap);
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (recordId) => {
    const game = games.find((g) => g.id === recordId);
    if (!game) return;

    const newVisibility = !visibility[recordId];

    setVisibility((prev) => ({
      ...prev,
      [recordId]: newVisibility
    }));

    try {
      setSaving(true);
      await updateRecordVisibility(recordId, newVisibility);
    } catch (err) {
      setVisibility((prev) => ({
        ...prev,
        [recordId]: !newVisibility
      }));
      setError(
        `Failed to update ${game.fields["Game Name"]}: ${err.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const getVisibleCount = () => {
    return Object.values(visibility).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return games.length;
  };

  const handleSelectAll = async () => {
    const updates = games
      .filter((game) => !visibility[game.id])
      .map((game) => ({ recordId: game.id, isVisible: true }));

    if (updates.length === 0) return;

    const newVisibility = {};
    games.forEach((game) => {
      newVisibility[game.id] = true;
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);
      await batchUpdateVisibility(updates);
    } catch (err) {
      loadData();
      setError(`Failed to show all games: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectNone = async () => {
    const updates = games
      .filter((game) => visibility[game.id])
      .map((game) => ({ recordId: game.id, isVisible: false }));

    if (updates.length === 0) return;

    const newVisibility = {};
    games.forEach((game) => {
      newVisibility[game.id] = false;
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);
      await batchUpdateVisibility(updates);
    } catch (err) {
      loadData();
      setError(`Failed to hide all games: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={loadData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="game-settings">
      <div className="game-settings__header">
        <h1 className="game-settings__title">Game Visibility Settings</h1>
        <p className="game-settings__description">
          Control which games appear in recommendations. Changes are saved
          automatically to Airtable.
        </p>
      </div>

      <div className="game-settings__summary">
        <div className="game-settings__summary-row">
          <div className="game-settings__stats">
            <span className="game-settings__stats-number">
              {getVisibleCount()}
            </span>{" "}
            of{" "}
            <span className="game-settings__stats-number">
              {getTotalCount()}
            </span>{" "}
            games visible
            {saving && (
              <span className="game-settings__saving-indicator">Saving...</span>
            )}
          </div>
          <div className="game-settings__actions">
            <button
              onClick={handleSelectAll}
              disabled={saving}
              className="game-settings__button game-settings__button--show-all"
            >
              Show All
            </button>
            <button
              onClick={handleSelectNone}
              disabled={saving}
              className="game-settings__button game-settings__button--hide-all"
            >
              Hide All
            </button>
          </div>
        </div>
      </div>

      <div className="game-settings__games-list">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-settings__game-card ${
              visibility[game.id]
                ? "game-settings__game-card--visible"
                : "game-settings__game-card--hidden"
            } ${saving ? "game-settings__game-card--disabled" : ""}`}
            onClick={() => !saving && handleToggle(game.id)}
          >
            <div className="game-settings__game-title">
              {game.fields["Game Name"]}
            </div>
            {(game.fields["Player Count"] ||
              game.fields["Avg Play Time"] ||
              game.fields["Weight / Complexity"]) && (
              <div className="game-settings__game-meta">
                {game.fields["Player Count"] && (
                  <div className="game-settings__game-meta-item">
                    <span>👥</span>
                    <span>{game.fields["Player Count"]}</span>
                  </div>
                )}
                {game.fields["Avg Play Time"] && (
                  <div className="game-settings__game-meta-item">
                    <span>⏰</span>
                    <span>{game.fields["Avg Play Time"]}</span>
                  </div>
                )}
                {game.fields["Weight / Complexity"] && (
                  <div className="game-settings__game-meta-item">
                    <span>🎲</span>
                    <span>{game.fields["Weight / Complexity"]}</span>
                  </div>
                )}
              </div>
            )}

            <div
              className={`game-settings__visibility-indicator ${
                visibility[game.id]
                  ? "game-settings__visibility-indicator--visible"
                  : "game-settings__visibility-indicator--hidden"
              }`}
            />
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="game-settings__empty-state">
          No games found. Check your Airtable configuration.
        </div>
      )}
    </div>
  );
}
