import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donation_category (
        categories ( name )
      ),
      donation_type_map (
        donation_types ( name )
      )
    `)

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  const formatted = data.map(d => ({
    ...d,
    categories: d.donation_category.map(dc => dc.categories.name),
    types:      d.donation_type_map.map(dt => dt.donation_types.name)
  }))

  return res.status(200).json(formatted)
}
