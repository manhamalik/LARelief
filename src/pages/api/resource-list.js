import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // fetch with joins over Supabase’s HTTP API
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      resource_category (
        categories ( name )
      ),
      resource_type_map (
        resource_types ( name )
      )
    `)

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  // collapse the join tables into simple arrays
  const formatted = data.map(r => {
    const { resource_category, resource_type_map, ...rest } = r
    return {
      ...rest,
      categories: resource_category?.map(rc => rc.categories.name) || [],
      types:      resource_type_map?.map(rt => rt.resource_types.name) || []
    }
  })

  return res.status(200).json(formatted)
}
