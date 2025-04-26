import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data, error } = await supabase
    .from('volunteering')
    .select(`
      *,
      volunteer_category (
        categories ( name )
      ),
      volunteer_type_map (
        volunteer_types ( name )
      )
    `)

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  const formatted = data.map(v => ({
    ...v,
    categories: v.volunteer_category.map(vc => vc.categories.name),
    types:      v.volunteer_type_map.map(vt => vt.volunteer_types.name)
  }))

  return res.status(200).json(formatted)
}
