import { Hono } from 'hono'
import { Bindings } from '../types'
import { authMiddleware } from '../middleware/auth'

const fairs = new Hono<{ Bindings: Bindings }>()

// Aplicar middleware de autenticação
fairs.use('*', authMiddleware)

// Listar todas as feiras com filtros
fairs.get('/', async (c) => {
  const { env } = c
  const queryParams = c.req.query()
  const month = queryParams.month || ''
  const year = queryParams.year || ''
  
  try {
    let query = `
      SELECT 
        f.*,
        u.name as created_by_name,
        COUNT(fi.id) as items_count
      FROM fairs f
      LEFT JOIN users u ON f.created_by = u.id
      LEFT JOIN fair_items fi ON f.id = fi.fair_id
    `
    
    const conditions = []
    const params: any[] = []
    
    if (month && year) {
      conditions.push("strftime('%Y-%m', f.date) = ?")
      params.push(`${year}-${month.padStart(2, '0')}`)
    } else if (year) {
      conditions.push("strftime('%Y', f.date) = ?")
      params.push(year)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' GROUP BY f.id ORDER BY f.date DESC, f.id DESC'
    
    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query)
    const { results } = await stmt.all()
    
    return c.json(results)
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

// Buscar feira por ID com itens
fairs.get('/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    // Buscar feira
    const fairStmt = env.DB.prepare(`
      SELECT 
        f.*,
        u.name as created_by_name
      FROM fairs f
      LEFT JOIN users u ON f.created_by = u.id
      WHERE f.id = ?
    `).bind(id)
    
    const { results: fairs } = await fairStmt.all()
    
    if (fairs.length === 0) {
      return c.json({ error: 'Feira não encontrada' }, 404)
    }
    
    const fair = fairs[0]
    
    // Buscar itens da feira
    const itemsStmt = env.DB.prepare(`
      SELECT * FROM fair_items
      WHERE fair_id = ?
      ORDER BY id ASC
    `).bind(id)
    
    const { results: items } = await itemsStmt.all()
    
    return c.json({
      ...fair,
      items
    })
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

// Criar nova feira
fairs.post('/', async (c) => {
  const { env } = c
  const user = c.get('user') as any
  
  try {
    const data = await c.req.json()
    const { date, location, observations, items } = data
    
    // Validar dados obrigatórios
    if (!date || !location || !items || items.length === 0) {
      return c.json({ error: 'Data, local e itens são obrigatórios' }, 400)
    }
    
    // Calcular total da feira
    let totalValue = 0
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      totalValue += quantity * unitValue
    }
    
    // Inserir feira
    const fairResult = await env.DB.prepare(`
      INSERT INTO fairs (date, location, total_value, observations, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      date, 
      location, 
      totalValue, 
      observations || '', 
      user?.userId || 1
    ).run()
    
    const fairId = fairResult.meta.last_row_id
    
    // Inserir itens
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      const itemTotal = quantity * unitValue
      
      await env.DB.prepare(`
        INSERT INTO fair_items (fair_id, quantity, category, unit_value, total_value)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        fairId, 
        quantity, 
        item.category || '', 
        unitValue, 
        itemTotal
      ).run()
    }
    
    return c.json({ 
      id: fairId, 
      message: 'Feira criada com sucesso',
      total_value: totalValue
    }, 201)
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

// Atualizar feira
fairs.put('/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const data = await c.req.json()
    const { date, location, observations, items } = data
    
    // Validar dados obrigatórios
    if (!date || !location || !items || items.length === 0) {
      return c.json({ error: 'Data, local e itens são obrigatórios' }, 400)
    }
    
    // Calcular total da feira
    let totalValue = 0
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      totalValue += quantity * unitValue
    }
    
    // Atualizar feira
    await env.DB.prepare(`
      UPDATE fairs 
      SET date = ?, location = ?, total_value = ?, observations = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(date, location, totalValue, observations || '', id).run()
    
    // Deletar itens antigos
    await env.DB.prepare('DELETE FROM fair_items WHERE fair_id = ?').bind(id).run()
    
    // Inserir novos itens
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      const itemTotal = quantity * unitValue
      
      await env.DB.prepare(`
        INSERT INTO fair_items (fair_id, quantity, category, unit_value, total_value)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        id, 
        quantity, 
        item.category || '', 
        unitValue, 
        itemTotal
      ).run()
    }
    
    return c.json({ 
      message: 'Feira atualizada com sucesso',
      total_value: totalValue
    })
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

// Deletar feira
fairs.delete('/:id', async (c) => {
  const { env } = c
  const user = c.get('user') as any
  const id = c.req.param('id')
  
  // Apenas admin pode deletar
  if (user.permission !== 'admin') {
    return c.json({ error: 'Permissão negada' }, 403)
  }
  
  try {
    // Deletar feira (itens serão deletados em cascata)
    await env.DB.prepare('DELETE FROM fairs WHERE id = ?').bind(id).run()
    
    return c.json({ message: 'Feira deletada com sucesso' })
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

// Estatísticas de feiras
fairs.get('/stats/summary', async (c) => {
  const { env } = c
  const query = c.req.query()
  const month = query.month || ''
  const year = query.year || ''
  
  try {
    let conditions = []
    const params: any[] = []
    
    if (month && year) {
      conditions.push("strftime('%Y-%m', date) = ?")
      params.push(`${year}-${month.padStart(2, '0')}`)
    } else if (year) {
      conditions.push("strftime('%Y', date) = ?")
      params.push(year)
    }
    
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''
    
    const query = `
      SELECT 
        COUNT(*) as total_fairs,
        COALESCE(SUM(total_value), 0) as total_revenue,
        COALESCE(AVG(total_value), 0) as average_revenue,
        COALESCE(MAX(total_value), 0) as max_revenue
      FROM fairs
      ${whereClause}
    `
    
    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query)
    const { results } = await stmt.all()
    
    return c.json(results[0] || {
      total_fairs: 0,
      total_revenue: 0,
      average_revenue: 0,
      max_revenue: 0
    })
  } catch (error: any) {
    console.error("Erro:", error);
    return c.json({ error: "Erro interno do servidor" }, 500)
  }
})

export default fairs
