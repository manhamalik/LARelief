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
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }
  if (!data) {
    return res.status(404).json({ error: 'Volunteer opportunity not found' })
  }

  const formatted = {
    ...data,
    categories: data.volunteer_category.map(vc => vc.categories.name),
    types:      data.volunteer_type_map.map(vt => vt.volunteer_types.name)
  }

  return res.status(200).json(formatted)
}
