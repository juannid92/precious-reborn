import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
}

type Config = { endpoint: string; username: string; password: string; markup: number }

async function loadConfig(): Promise<Config> {
  const { data, error } = await supabase.from("nivoda_config").select("key, value")
  if (error) throw new Error("Config non leggibile: " + error.message)
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
  if (!map.endpoint || !map.username || !map.password) {
    throw new Error("nivoda_config incompleta: servono endpoint, username, password")
  }
  return {
    endpoint: map.endpoint,
    username: map.username,
    password: map.password,
    markup: Number(map.markup ?? "1"),
  }
}

async function gql(cfg: Config, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

function tokenExpiresAt(token: string): number {
  try {
    const payload = token.split(".")[1]
    if (!payload) return 0
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const decoded = JSON.parse(atob(padded))
    return Number(decoded.exp || 0) * 1000
  } catch {
    return 0
  }
}

async function getToken(cfg: Config): Promise<string> {
  const { data: row } = await supabase
    .from("nivoda_token").select("token, expires_at").eq("id", 1).maybeSingle()

  const safetyWindow = Date.now() + 5 * 60000
  if (
    row &&
    new Date(row.expires_at).getTime() > safetyWindow &&
    tokenExpiresAt(row.token) > safetyWindow
  ) return row.token

  const authQuery =
    "query ($u: String!, $p: String!) {" +
    "  authenticate { username_and_password(username: $u, password: $p) { token } }" +
    "}"

  const data = await gql(cfg, authQuery, { u: cfg.username, p: cfg.password })

  const token = data.authenticate.username_and_password.token
  await supabase.from("nivoda_token").upsert({
    id: 1,
    token,
    expires_at: new Date(Date.now() + 5.5 * 3600000).toISOString(),
  })
  return token
}

const CERT = "id lab shape certNumber carats color clarity cut polish symmetry floInt pdfUrl"

const FLUO: Record<string, string> = {
  NON: "Nessuna", VSL: "Molto debole", SLT: "Leggera", FNT: "Debole",
  MED: "Media", STG: "Forte", STN: "Molto forte", VST: "Intensa",
}

const CUT: Record<string, string> = {
  ID: "Ideale", EX: "Eccellente", VG: "Molto buono", GD: "Buono", F: "Discreto", P: "Scarso",
}

function normalize(item: any, markup: number) {
  const c = (item && item.diamond && item.diamond.certificate) || {}
  const d = (item && item.diamond) || {}
  return {
    diamondId: d.id || null,
    priceEur: Math.round((((item && item.price) || 0) / 100) * markup),
    image: d.image || null,
    video: d.video || null,
    available: d.availability === "AVAILABLE",
    shape: c.shape || null,
    carats: c.carats != null ? c.carats : null,
    color: c.color || null,
    clarity: c.clarity || null,
    cut: c.cut || null,
    cutLabel: CUT[c.cut] || c.cut || null,
    polish: c.polish || null,
    symmetry: c.symmetry || null,
    fluorescence: FLUO[c.floInt] || c.floInt || null,
    lab: c.lab || null,
    certNumber: c.certNumber || null,
    certPdf: c.pdfUrl || null,
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  try {
    const cfg = await loadConfig()
    const b = await req.json().catch(() => ({}))
    if (b.diamondId) {
      const detailQuery =
        "query ($token: String!, $id: ID!) {" +
        "  as(token: $token) {" +
        "    get_diamond_by_id(diamond_id: $id) {" +
        "      id price" +
        "      diamond { id availability image video certificate { " + CERT + " } }" +
        "    }" +
        "  }" +
        "}"

      let token = await getToken(cfg)
      let d
      try {
        d = await gql(cfg, detailQuery, { token, id: b.diamondId })
      } catch (error) {
        if (!/jwt expired|invalid token|unauthorized/i.test(String((error as Error)?.message || error))) throw error
        await supabase.from("nivoda_token").delete().eq("id", 1)
        token = await getToken(cfg)
        d = await gql(cfg, detailQuery, { token, id: b.diamondId })
      }
      return new Response(
        JSON.stringify({ item: normalize(d.as.get_diamond_by_id, cfg.markup) }),
        { headers: cors },
      )
    }

    const caratFrom = Number(b.caratFrom != null ? b.caratFrom : 0.3)
    const caratTo = Number(b.caratTo != null ? b.caratTo : 5)
    const priceFrom = Math.round((Number(b.priceFrom || 0) / cfg.markup) * 100)
    const priceTo = Math.round((Number(b.priceTo != null ? b.priceTo : 50000) / cfg.markup) * 100)

    const filters: string[] = [
      "labgrown: " + (b.labgrown === true),
      "availability: AVAILABLE",
      "hide_memo: true",
      "returns: true",
      "preferred_currency: EUR",
      "has_image: true",
      "sizes: { from: " + caratFrom + ", to: " + caratTo + " }",
      "dollar_value: { from: " + priceFrom + ", to: " + priceTo + " }",
    ]

    if (b.shapes && b.shapes.length) {
      const quoted = b.shapes.map((s: string) => '"' + s + '"').join(", ")
      filters.push("shapes: [" + quoted + "]")
    }
    if (b.color && b.color.length) filters.push("color: [" + b.color.join(", ") + "]")
    if (b.clarity && b.clarity.length) filters.push("clarity: [" + b.clarity.join(", ") + "]")
    if (b.cut && b.cut.length) filters.push("cut: [" + b.cut.join(", ") + "]")
    if (b.labs && b.labs.length) filters.push("certificate_lab: [" + b.labs.join(", ") + "]")

    const pageSize = Math.min(Number(b.pageSize || 24), 50)
    const offset = Number(b.page || 0) * pageSize
    const orderType = b.sort === "carat_desc" ? "size" : "price"
    const orderDir = (b.sort === "carat_desc" || b.sort === "price_desc") ? "DESC" : "ASC"

    const searchQuery =
      "query ($token: String!) {" +
      "  as(token: $token) {" +
      "    diamonds_by_query(" +
      "      query: { " + filters.join(", ") + " }," +
      "      offset: " + offset + "," +
      "      limit: " + pageSize + "," +
      "      order: { type: " + orderType + ", direction: " + orderDir + " }" +
      "    ) {" +
      "      items { id price diamond { id availability image video certificate { " + CERT + " } } }" +
      "      total_count" +
      "    }" +
      "  }" +
      "}"

    let token = await getToken(cfg)
    let data
    try {
      data = await gql(cfg, searchQuery, { token })
    } catch (error) {
      if (!/jwt expired|invalid token|unauthorized/i.test(String((error as Error)?.message || error))) throw error
      await supabase.from("nivoda_token").delete().eq("id", 1)
      token = await getToken(cfg)
      data = await gql(cfg, searchQuery, { token })
    }
    const rawItems = (data.as.diamonds_by_query && data.as.diamonds_by_query.items) || []
    const items = rawItems.map((i: any) => normalize(i, cfg.markup))

    return new Response(
      JSON.stringify({ items: items, hasMore: items.length === pageSize }),
      { headers: cors },
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String((e && e.message) || e) }),
      { status: 500, headers: cors },
    )
  }
})
