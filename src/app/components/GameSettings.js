import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_DATABASE_URL,
  process.env.SUPABASE_ANON_KEY,
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
      const gamesRes = await fetch('/games_db.json');
      
      if (!gamesRes.ok) {
        throw new Error('Failed to load games');
      }

      const gamesData = await gamesRes.json();

      // Load visibility settings from Supabase
      const { data: visibilityData, error: visibilityError } = await supabase
        .from('game_visibility')
        .select('*');

      if (visibilityError) {
        console.warn('Error loading visibility settings:', visibilityError);
      }

      setGames(gamesData);

      // Convert visibility array to object for easier lookup
      // Use game_id consistently (not id)
      const visibilityMap = {};
      gamesData.forEach(game => {
        visibilityMap[game.game_id] = true; // default to visible
      });

      // Override with saved settings from Supabase
      if (visibilityData) {
        visibilityData.forEach(item => {
          visibilityMap[item.game_id] = item.is_visible;
        });
      }

      setVisibility(visibilityMap);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (gameId) => {
    // Use game_id instead of id
    const game = games.find(g => g.game_id === gameId);
    if (!game) return;

    const newVisibility = !visibility[gameId];

    // Update only the specific game's visibility
    setVisibility(prev => ({
      ...prev,
      [gameId]: newVisibility
    }));

    try {
      setSaving(true);
      
      const { error } = await supabase.from("game_visibility").upsert({
        title: game.title,
        game_id: gameId,
        is_visible: newVisibility,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (err) {
      // Revert only the changed game on error
      setVisibility(prev => ({
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
      .from('game_visibility')
      .select('game_id')
      .in('game_id', games.map(g => g.game_id)); // Use game_id

    const existingGameIds = new Set(existingData?.map(item => item.game_id) || []);

    games.forEach(game => {
      if (!visibility[game.game_id]) { // Use game_id
        const record = {
          title: game.title || game.game_id, // Use game_id as fallback
          game_id: game.game_id, // Use game_id
          is_visible: true,
          updated_at: new Date().toISOString()
        };

        if (existingGameIds.has(game.game_id)) { // Use game_id
          updates.push(record);
        } else {
          inserts.push(record);
        }
      }
    });

    if (updates.length === 0 && inserts.length === 0) return;

    // Optimistic update
    const newVisibility = {};
    games.forEach(game => {
      newVisibility[game.game_id] = true; // Use game_id
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);
      
      // Perform updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from('game_visibility')
            .update({ 
              is_visible: update.is_visible,
              updated_at: update.updated_at 
            })
            .eq('game_id', update.game_id);
          
          if (error) throw error;
        }
      }

      // Perform inserts
      if (inserts.length > 0) {
        const { error } = await supabase
          .from('game_visibility')
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
      .from('game_visibility')
      .select('game_id')
      .in('game_id', games.map(g => g.game_id)); // Use game_id

    const existingGameIds = new Set(existingData?.map(item => item.game_id) || []);

    games.forEach(game => {
      if (visibility[game.game_id]) { // Use game_id
        const record = {
          title: game.title || game.game_id, // Use game_id as fallback
          game_id: game.game_id, // Use game_id
          is_visible: false,
          updated_at: new Date().toISOString()
        };

        if (existingGameIds.has(game.game_id)) { // Use game_id
          updates.push(record);
        } else {
          inserts.push(record);
        }
      }
    });

    if (updates.length === 0 && inserts.length === 0) return;

    // Optimistic update
    const newVisibility = {};
    games.forEach(game => {
      newVisibility[game.game_id] = false; // Use game_id
    });
    setVisibility(newVisibility);

    try {
      setSaving(true);
      
      // Perform updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { error } = await supabase
            .from('game_visibility')
            .update({ 
              is_visible: update.is_visible,
              updated_at: update.updated_at 
            })
            .eq('game_id', update.game_id);
          
          if (error) throw error;
        }
      }

      // Perform inserts
      if (inserts.length > 0) {
        const { error } = await supabase
          .from('game_visibility')
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Game Visibility Settings
        </h1>
        <p className="text-gray-600">
          Control which games appear in recommendations. Changes are saved automatically.
        </p>
      </div>

      {/* Summary and bulk actions */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{getVisibleCount()}</span> of{' '}
            <span className="font-semibold">{getTotalCount()}</span> games visible
            {saving && <span className="ml-2 text-blue-600">Saving...</span>}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleSelectAll}
              disabled={saving}
              className="text-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded"
            >
              Show All
            </button>
            <button
              onClick={handleSelectNone}
              disabled={saving}
              className="text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded"
            >
              Hide All
            </button>
          </div>
        </div>
      </div>

      {/* Games list */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid gap-0">
          {games.map((game, index) => (
            <div
              key={game.game_id} // Use game_id for React key
              className={`flex items-center p-4 ${
                index !== games.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              <label className="flex items-center space-x-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={visibility[game.game_id] ?? true} // Use game_id
                  onChange={() => handleToggle(game.game_id)} // Use game_id
                  disabled={saving}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {game.title}
                  </div>
                  {game.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {game.description}
                    </div>
                  )}
                  {(game.players || game.playtime || game.category) && (
                    <div className="flex space-x-4 mt-2 text-xs text-gray-400">
                      {game.players && (
                        <span>👥 {game.players}</span>
                      )}
                      {game.playtime && (
                        <span>⏰ {game.playtime}</span>
                      )}
                      {game.category && (
                        <span>🎲 {game.category}</span>
                      )}
                    </div>
                  )}
                </div>
              </label>
              
              {/* Visual indicator */}
              <div className={`w-3 h-3 rounded-full ml-3 ${
                visibility[game.game_id] ? 'bg-green-400' : 'bg-gray-300'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {games.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No games found. Make sure your games.json file is accessible.
        </div>
      )}
    </div>
  );
}