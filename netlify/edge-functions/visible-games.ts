import { Context } from "@netlify/edge-functions"
import { createClient } from "@supabase/supabase-js"

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || context.site?.url
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found in environment")
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Loading visibility data from Supabase...")
    
    // Get visibility preferences from Supabase
    const { data: visibilityData, error: visError } = await supabase
      .from("game_visibility")
      .select("game_id, is_visible")
      .eq("is_visible", true)

    if (visError) {
      console.error("Supabase error:", visError)
      throw new Error(`Database error: ${visError.message}`)
    }

    console.log(`Found ${visibilityData?.length || 0} visible games in database`)

    // Load complete games database from your JSON file
    // This will load from your Netlify site's public folder
    const gamesUrl = `${new URL(request.url).origin}/games_db.json`
    
    console.log("Loading games from JSON:", gamesUrl)
    
    const gamesResponse = await fetch(gamesUrl)
    if (!gamesResponse.ok) {
      throw new Error(`Failed to load games database: ${gamesResponse.status} ${gamesResponse.statusText}`)
    }
    
    const allGames = await gamesResponse.json()
    console.log(`Loaded ${allGames.length} total games from JSON`)

    // Create set of visible game IDs for fast lookup
    const visibleGameIds = new Set(visibilityData?.map(v => v.game_id) || [])
    
    // Filter games based on visibility settings
    // If no visibility settings exist, default to showing all games
    const visibleGames = allGames.filter(game => {
      if (visibleGameIds.size === 0) {
        // No visibility preferences set - show all games
        return true
      }
      // Only show games that are explicitly marked as visible
      return visibleGameIds.has(game.game_id)
    })

    console.log(`Returning ${visibleGames.length} visible games`)

    const response = {
      games: visibleGames,
      total_visible: visibleGames.length,
      total_available: allGames.length,
      visibility_rules_count: visibilityData?.length || 0,
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })

  } catch (error) {
    console.error("Function error:", error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check function logs for more information"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

export const config = {
  path: "/api/visible-games"
}