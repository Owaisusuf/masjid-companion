import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_KEY = "$2y$10$45sM1ja2b86z6cTAZPN6AE0skFG3LCImGhIcKzz5DEKFsEYBzgC";
const API_BASE = "https://hadithapi.com/api";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") || "books";
    const bookSlug = url.searchParams.get("bookSlug");
    const chapter = url.searchParams.get("chapter");
    const page = url.searchParams.get("page") || "1";
    const paginate = url.searchParams.get("paginate") || "20";
    const search = url.searchParams.get("search");

    let apiUrl = "";

    if (endpoint === "books") {
      apiUrl = `${API_BASE}/books?apiKey=${API_KEY}`;
    } else if (endpoint === "chapters" && bookSlug) {
      apiUrl = `${API_BASE}/${bookSlug}/chapters?apiKey=${API_KEY}`;
    } else if (endpoint === "hadiths" && bookSlug) {
      apiUrl = `${API_BASE}/hadiths/?apiKey=${API_KEY}&book=${bookSlug}&paginate=${paginate}&page=${page}`;
      if (chapter) apiUrl += `&chapter=${chapter}`;
      if (search) apiUrl += `&hadithEnglish=${encodeURIComponent(search)}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
