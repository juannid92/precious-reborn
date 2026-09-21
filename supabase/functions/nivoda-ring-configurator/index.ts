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

const JEWELLERY_ENDPOINT = "https://gateway.nivodaapi.net/jewellery-service-api/graphql-jewellery"
const DEFAULT_MANUFACTURER_SKU = "6FQ5XKV6B0L1M4Z"

type Config = { endpoint: string; username: string; password: string }

async function loadConfig(): Promise<Config> {
  const { data, error } = await supabase.from("nivoda_config").select("key, value")
  if (error) throw new Error("Configurazione Nivoda non leggibile")
  const map = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))
  if (!map.endpoint || !map.username || !map.password) throw new Error("Configurazione Nivoda incompleta")
  return { endpoint: map.endpoint, username: map.username, password: map.password }
}

async function baseGraphql(cfg: Config, query: string, variables: Record<string, unknown>) {
  const response = await fetch(cfg.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  const json = await response.json()
  if (!response.ok || json.errors?.length) throw new Error(json.errors?.[0]?.message ?? "Errore autenticazione Nivoda")
  return json.data
}

async function getToken(cfg: Config): Promise<string> {
  const { data: row } = await supabase
    .from("nivoda_token")
    .select("token, expires_at")
    .eq("id", 1)
    .maybeSingle()

  if (row && new Date(row.expires_at) > new Date(Date.now() + 5 * 60_000)) return row.token

  const query = `query ($u: String!, $p: String!) {
    authenticate { username_and_password(username: $u, password: $p) { token } }
  }`
  const data = await baseGraphql(cfg, query, { u: cfg.username, p: cfg.password })
  const token = data.authenticate.username_and_password.token
  await supabase.from("nivoda_token").upsert({
    id: 1,
    token,
    expires_at: new Date(Date.now() + 5.5 * 3_600_000).toISOString(),
  })
  return token
}

const QUERY = `query getJewelleryConfiguratorDetailsByManufacturerSkuId(
  $sku_id: String!,
  $manufacturer: String,
  $options: ManufacturerJewelleryDetailsOptionsInput,
  $is_sample: Boolean,
  $api_version: String
) {
  getJewelleryConfiguratorDetailsByManufacturerSkuId(
    sku_id: $sku_id,
    manufacturer: $manufacturer,
    options: $options,
    is_sample: $is_sample,
    api_version: $api_version
  ) {
    description
    engravingFont
    images
    jewelleryId
    nivodaSKU
    supplierSKU
    title
    ringWeight
    ringWidth
  }
}`

const allowed = new Set([
  "center_stone_shape", "center_stone_size", "center_stone_type",
  "head_stones_quality", "head_stones_type", "metal_quality", "metal_type",
  "mounting_metal_color", "mounting_type", "peekaboo_stone",
  "ring_carving_length", "ring_carving_type", "ring_engraving_font",
  "ring_head_metal_color", "ring_head_type", "ring_size", "ring_size_type",
  "side_setting_type", "side_stones_mounting_length", "side_stones_type",
])

function sanitizeOptions(value: unknown): Record<string, string | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Opzioni configuratore non valide")
  const output: Record<string, string | null> = {}
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!allowed.has(key)) continue
    if (raw === null || (typeof raw === "string" && raw.length <= 64)) output[key] = raw as string | null
  }
  return output
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors })
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Metodo non consentito" }), { status: 405, headers: cors })

  try {
    const body = await request.json()
    const options = sanitizeOptions(body.options)
    const cfg = await loadConfig()
    const token = await getToken(cfg)
    const response = await fetch(JEWELLERY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "apollographql-client-name": "Cara Preziosi Ring Studio",
        "apollographql-client-version": "1.0",
      },
      body: JSON.stringify({
        operationName: "getJewelleryConfiguratorDetailsByManufacturerSkuId",
        query: QUERY,
        variables: {
          sku_id: typeof body.sku_id === "string" && body.sku_id.length <= 64 ? body.sku_id : DEFAULT_MANUFACTURER_SKU,
          options,
          api_version: "61",
          is_sample: false,
        },
      }),
    })
    const json = await response.json()
    if (!response.ok || json.errors?.length) throw new Error(json.errors?.[0]?.message ?? "Rendering Nivoda non disponibile")
    const item = json.data?.getJewelleryConfiguratorDetailsByManufacturerSkuId
    if (!item?.images) throw new Error("Anteprima Nivoda non disponibile")
    return new Response(JSON.stringify({
      images: item.images,
      supplierSku: item.supplierSKU ?? null,
      title: item.title ?? null,
      description: item.description ?? null,
      ringWeight: item.ringWeight ?? null,
      ringWidth: item.ringWidth ?? null,
    }), { headers: cors })
  } catch (error) {
    console.error("[nivoda-ring-configurator]", error)
    return new Response(JSON.stringify({ error: String(error instanceof Error ? error.message : error) }), { status: 500, headers: cors })
  }
})
