export default async (request: Request, context: Context) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? '',
      Deno.env.get("SUPABASE_ANON_KEY") ?? ''
    )

    // Just test the connection
    const { data, error } = await supabase
      .from('game_visibility')
      .select('*')
      .limit(1)

    return new Response(JSON.stringify({
      success: !error,
      error: error?.message,
      data: data,
      env_check: {
        url_exists: !!Deno.env.get("SUPABASE_URL"),
        key_exists: !!Deno.env.get("SUPABASE_ANON_KEY")
      }
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}