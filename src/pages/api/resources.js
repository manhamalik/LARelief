import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' })
  }

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
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  const formatted = {
    ...data,
    categories: data.resource_category.map(rc => rc.categories.name),
    types:      data.resource_type_map.map(rt => rt.resource_types.name)
  }

  return res.status(200).json(formatted)
}
