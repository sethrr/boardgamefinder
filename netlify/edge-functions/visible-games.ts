/* eslint-disable import/no-anonymous-default-export */
// @ts-nocheck
import { Context } from "https://edge.netlify.com"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export default async (request: Request, context: Context) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  try {
    // Get Supabase credentials from Netlify environment
    const supabaseUrl = Deno.env.get("REACT_APP_SUPABASE_DATABASE_URL") || context.site?.url
    const supabaseKey = Deno.env.get("REACT_APP_SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found in environment")
    }

    // Create Supabase client with options to disable caching
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })

    console.log("Loading visibility data from Supabase...")
    console.log("Supabase URL:", supabaseUrl)
    console.log("Supabase Key exists:", !!supabaseKey)
    console.log("Request timestamp:", new Date().toISOString())
    
    // Add a timestamp to help debug caching issues
    const queryTimestamp = Date.now()
    
    // Test basic connection first with cache busting
    const { data: testData, error: testError, count } = await supabase
      .from("game_visibility")
      .select("*", { count: "exact", head: true })
      .limit(1)

    if (testError) {
      console.error("Supabase connection test failed:", testError)
      throw new Error(`Database connection error: ${testError.message} (Code: ${testError.code})`)
    }

    console.log("Supabase connection successful, table has", count, "rows at", new Date().toISOString())
    
    // Get visibility preferences from Supabase with explicit ordering to avoid cache
    const { data: visibilityData, error: visError } = await supabase
      .from("game_visibility")
      .select("game_id, is_visible, updated_at")
      .eq("is_visible", true)
      .order("updated_at", { ascending: false })

    if (visError) {
      console.error("Supabase query error:", visError)
      throw new Error(`Database query error: ${visError.message} (Code: ${visError.code})`)
    }

    console.log(`Found ${visibilityData?.length || 0} visible games in database at ${new Date().toISOString()}`)
    console.log("Visible game IDs from DB:", visibilityData?.map(v => v.game_id) || [])
    console.log("Visible game ID types from DB:", visibilityData?.map(v => typeof v.game_id) || [])

    // Load complete games database from your JSON file
    const gamesUrl = `${new URL(request.url).origin}/games_db.json?t=${queryTimestamp}`
    
    console.log("Loading games from JSON:", gamesUrl)
    
    const gamesResponse = await fetch(gamesUrl, {
      // Disable caching for the JSON fetch as well
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!gamesResponse.ok) {
      throw new Error(`Failed to load games database: ${gamesResponse.status} ${gamesResponse.statusText}`)
    }
    
    const allGames = await gamesResponse.json()
    console.log(`Loaded ${allGames.length} total games from JSON`)
    
    // Debug: Check the first few games from JSON
    console.log("Sample game IDs from JSON:", allGames.slice(0, 5).map(g => g.game_id))
    console.log("Sample game ID types from JSON:", allGames.slice(0, 5).map(g => typeof g.game_id))

    // Create set of visible game IDs for fast lookup
    // Handle both string and number types by normalizing to strings
    const visibleGameIds = new Set(
      visibilityData?.map(v => String(v.game_id)) || []
    )
    
    console.log("Normalized visible game IDs (as strings):", Array.from(visibleGameIds))
    
    // Filter games based on visibility settings
    const visibleGames = allGames.filter(game => {
      if (visibleGameIds.size === 0) {
        // No visibility preferences set - show all games
        return true
      }
      // Normalize game.game_id to string for comparison
      const gameIdStr = String(game.game_id)
      const isVisible = visibleGameIds.has(gameIdStr)
      
      // Debug logging for first few games
      if (allGames.indexOf(game) < 5) {
        console.log(`Game ${game.game_id} (${typeof game.game_id} -> "${gameIdStr}") is visible: ${isVisible}`)
      }
      
      return isVisible
    })

    console.log(`Returning ${visibleGames.length} visible games`)

    const response = {
      games: visibleGames,
      total_visible: visibleGames.length,
      total_available: allGames.length,
      visibility_rules_count: visibilityData?.length || 0,
      query_timestamp: queryTimestamp,
      server_time: new Date().toISOString(),
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        // Prevent caching of the response
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })

  } catch (error) {
    console.error("Function error:", error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check function logs for more information",
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  }
}

export const config = {
  path: "/api/visible-games"
}