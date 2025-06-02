import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/game-settings.css";

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_DATABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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

      // Load games from your JSON file
      const gamesRes = await fetch("/games_db.json");

      if (!gamesRes.ok) {
        throw new Error("Failed to load games");
      }

      const gamesData = await gamesRes.json();

      // Load visibility settings from Supabase
      const { data: visibilityData, error: visibilityError } = await supabase
        .from("game_visibility")
        .select("*");

      if (visibilityError) {
        console.warn("Error loading visibility settings:", visibilityError);
      }

      setGames(gamesData);

      // Convert visibility array to object for easier lookup
      // Use game_id consistently (not id)
      const visibilityMap = {};
      gamesData.forEach((game) => {
        visibilityMap[game.game_id] = true; // default to visible
      });

      // Override with saved settings from Supabase
      if (visibilityData) {
        visibilityData.forEach((item) => {
          visibilityMap[item.game_id] = item.is_visible;
        });
      }

      setVisibility(visibilityMap);
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (gameId) => {
    const game = games.find((g) => g.game_id === gameId);
    if (!game) return;

    const newVisibility = !visibility[gameId];

    // Update only the specific game's visibility
    setVisibility((prev) => ({
      ...prev,
      [gameId]: newVisibility
    }));

    try {
      setSaving(true);

      const { error } = await supabase.from("game_visibility").upsert(
        {
          title: game.title,
          game_id: gameId,
          is_visible: newVisibility,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "game_id"
        }
      );

      if (error) throw error;
    } catch (err) {
      // Revert only the changed game on error
      setVisibility((prev) => ({
        ...prev,
        [gameId]: !newVisibility
      }));
      setError(`Failed to update ${game.title}: ${err.message}`);
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
    const updates = [];
    const inserts = [];

    // Get current data from Supabase to determine what to update vs insert
    const { data: existingData } = await supabase
      .from("game_visibility")
      .select("game_id")
      .in(
        "game_id",
        games.map((g) => g.game_id)
      ); // Use game_id

    const existingGameIds = new Set(
      existingData?.map((item) => item.game_id) || []
    );

    games.forEach((game) => {
      if (!visibility[game.game_id]) {
        // Use game_id
        const record = {
          title: game.title || game.game_id, // Use game_id as fallback
          game_id: game.game_id, // Use game_id
          is_visible: true,
          updated_at: new Date().toISOString()
        };

        if (existingGameIds.has(game.game_id)) {
          // Use game_id
          updates.push(record);
        } else {
          inserts.push(record);
        }
      }
    });

    if (updates.length === 0 && inserts.length === 0) return;

    // Optimistic update
    const newVisibility = {};
    games.forEach((game) => {
      newVisibility[game.game_id] = true; // Use game_id
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);

      // Perform updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from("game_visibility")
            .update({
              is_visible: update.is_visible,
              updated_at: update.updated_at
            })
            .eq("game_id", update.game_id);

          if (error) throw error;
        }
      }

      // Perform inserts
      if (inserts.length > 0) {
        const { error } = await supabase
          .from("game_visibility")
          .insert(inserts);

        if (error) throw error;
      }
    } catch (err) {
      // Revert on error
      loadData();
      setError(`Failed to show all games: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectNone = async () => {
    const updates = [];
    const inserts = [];

    // Get current data from Supabase to determine what to update vs insert
    const { data: existingData } = await supabase
      .from("game_visibility")
      .select("game_id")
      .in(
        "game_id",
        games.map((g) => g.game_id)
      ); // Use game_id

    const existingGameIds = new Set(
      existingData?.map((item) => item.game_id) || []
    );

    games.forEach((game) => {
      if (visibility[game.game_id]) {
        // Use game_id
        const record = {
          title: game.title || game.game_id, // Use game_id as fallback
          game_id: game.game_id, // Use game_id
          is_visible: false,
          updated_at: new Date().toISOString()
        };

        if (existingGameIds.has(game.game_id)) {
          // Use game_id
          updates.push(record);
        } else {
          inserts.push(record);
        }
      }
    });

    if (updates.length === 0 && inserts.length === 0) return;

    // Optimistic update
    const newVisibility = {};
    games.forEach((game) => {
      newVisibility[game.game_id] = false; // Use game_id
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);

      // Perform updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from("game_visibility")
            .update({
              is_visible: update.is_visible,
              updated_at: update.updated_at
            })
            .eq("game_id", update.game_id);

          if (error) throw error;
        }
      }

      // Perform inserts
      if (inserts.length > 0) {
        const { error } = await supabase
          .from("game_visibility")
          .insert(inserts);

        if (error) throw error;
      }
    } catch (err) {
      // Revert on error
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
        <h1 className="game-settings__title">
          Game Visibility Settings
        </h1>
        <p className="game-settings__description">
          Control which games appear in recommendations. Changes are saved automatically.
        </p>
      </div>

      {/* Summary and bulk actions */}
      <div className="game-settings__summary">
        <div className="game-settings__summary-row">
          <div className="game-settings__stats">
            <span className="game-settings__stats-number">{getVisibleCount()}</span> of{' '}
            <span className="game-settings__stats-number">{getTotalCount()}</span> games visible
            {saving && <span className="game-settings__saving-indicator">Saving...</span>}
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

      {/* Games list */}
      <div className="game-settings__games-list">
        {games.map((game) => (
          <div
            key={game.game_id}
            className={`game-settings__game-card ${
              visibility[game.game_id] 
                ? 'game-settings__game-card--visible' 
                : 'game-settings__game-card--hidden'
            } ${saving ? 'game-settings__game-card--disabled' : ''}`}
            onClick={() => !saving && handleToggle(game.game_id)}
          >
            <div className="game-settings__game-title">
              {game.title}
            </div>
            {game.description && (
              <div className="game-settings__game-description">
                {game.description}
              </div>
            )}
            {(game.players || game.playtime || game.category) && (
              <div className="game-settings__game-meta">
                {game.players && (
                  <div className="game-settings__game-meta-item">
                    <span>👥</span>
                    <span>{game.players}</span>
                  </div>
                )}
                {game.playtime && (
                  <div className="game-settings__game-meta-item">
                    <span>⏰</span>
                    <span>{game.playtime}</span>
                  </div>
                )}
                {game.category && (
                  <div className="game-settings__game-meta-item">
                    <span>🎲</span>
                    <span>{game.category}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Visual indicator */}
            <div className={`game-settings__visibility-indicator ${
              visibility[game.game_id] 
                ? 'game-settings__visibility-indicator--visible' 
                : 'game-settings__visibility-indicator--hidden'
            }`} />
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="game-settings__empty-state">
          No games found. Make sure your games.json file is accessible.
        </div>
      )}
    </div>
  );
}