import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

const receipts = new Hono<{ Bindings: Bindings }>()

// Aplicar middleware de autenticação
receipts.use('/*', authMiddleware)

// Listar recibos com filtros
receipts.get('/', async (c) => {
  const { env } = c
  const query = c.req.query()
  
  try {
    let sql = `
      SELECT 
        r.*,
        u.name as created_by_name,
        COUNT(ri.id) as items_count
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
      WHERE 1=1
    `
    
    const params: any[] = []
    
    // Filtro por mês
    if (query.month) {
      sql += ` AND strftime('%Y-%m', r.date) = ?`
      params.push(query.month)
    }
    
    // Filtro por cliente
    if (query.recipient) {
      sql += ` AND r.recipient_name LIKE ?`
      params.push(`%${query.recipient}%`)
    }
    
    sql += ` GROUP BY r.id ORDER BY r.date DESC, r.id DESC`
    
    const result = await env.DB.prepare(sql).bind(...params).all()
    
    return c.json(result.results || [])
  } catch (error: any) {
    console.error('Erro ao listar recibos:', error)
    return c.json({ error: 'Erro ao listar recibos', details: error.message }, 500)
  }
})

// Buscar recibo por ID (com itens)
receipts.get('/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    // Buscar recibo
    const receiptResult = await env.DB.prepare(`
      SELECT 
        r.*,
        u.name as created_by_name
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `).bind(id).first()
    
    if (!receiptResult) {
      return c.json({ error: 'Recibo não encontrado' }, 404)
    }
    
    // Buscar itens do recibo
    const itemsResult = await env.DB.prepare(`
      SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY id
    `).bind(id).all()
    
    return c.json({
      ...receiptResult,
      items: itemsResult.results || []
    })
  } catch (error: any) {
    console.error('Erro ao buscar recibo:', error)
    return c.json({ error: 'Erro ao buscar recibo', details: error.message }, 500)
  }
})

// Estatísticas de recibos
receipts.get('/stats/summary', async (c) => {
  const { env } = c
  const query = c.req.query()
  
  try {
    let sql = `
      SELECT 
        COUNT(*) as total_receipts,
        COALESCE(SUM(total_value), 0) as total_value,
        COALESCE(AVG(total_value), 0) as average_value,
        COALESCE(MAX(total_value), 0) as max_value
      FROM receipts
      WHERE 1=1
    `
    
    const params: any[] = []
    
    if (query.month) {
      sql += ` AND strftime('%Y-%m', date) = ?`
      params.push(query.month)
    }
    
    const result = await env.DB.prepare(sql).bind(...params).first()
    
    return c.json(result || {
      total_receipts: 0,
      total_value: 0,
      average_value: 0,
      max_value: 0
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return c.json({ error: 'Erro ao buscar estatísticas', details: error.message }, 500)
  }
})

// Criar novo recibo
receipts.post('/', async (c) => {
  const { env } = c
  const user = c.get('user') as any
  
  try {
    const data = await c.req.json()
    const { receipt_number, recipient_name, recipient_cpf, date, description, payment_method, items } = data
    
    // Validar dados obrigatórios
    if (!receipt_number || !recipient_name || !date || !items || items.length === 0) {
      return c.json({ error: 'Número do recibo, nome do cliente, data e itens são obrigatórios' }, 400)
    }
    
    // Calcular total
    let totalValue = 0
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      totalValue += quantity * unitValue
    }
    
    // Inserir recibo
    const receiptResult = await env.DB.prepare(`
      INSERT INTO receipts (receipt_number, recipient_name, recipient_cpf, date, description, total_value, payment_method, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      receipt_number,
      recipient_name,
      recipient_cpf || '',
      date,
      description || '',
      totalValue,
      payment_method || 'Dinheiro',
      user?.id || 1
    ).run()
    
    const receiptId = receiptResult.meta.last_row_id
    
    // Inserir itens
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      const itemTotal = quantity * unitValue
      
      await env.DB.prepare(`
        INSERT INTO receipt_items (receipt_id, description, quantity, unit_value, total_value)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        receiptId,
        item.description,
        quantity,
        unitValue,
        itemTotal
      ).run()
    }
    
    return c.json({ 
      success: true, 
      id: receiptId,
      receipt_number,
      total_value: totalValue
    }, 201)
  } catch (error: any) {
    console.error('Erro ao criar recibo:', error)
    return c.json({ error: 'Erro ao criar recibo', details: error.message }, 500)
  }
})

// Atualizar recibo
receipts.put('/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const data = await c.req.json()
    const { receipt_number, recipient_name, recipient_cpf, date, description, payment_method, items } = data
    
    // Validar dados obrigatórios
    if (!receipt_number || !recipient_name || !date || !items || items.length === 0) {
      return c.json({ error: 'Número do recibo, nome do cliente, data e itens são obrigatórios' }, 400)
    }
    
    // Calcular total
    let totalValue = 0
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      totalValue += quantity * unitValue
    }
    
    // Atualizar recibo
    await env.DB.prepare(`
      UPDATE receipts 
      SET receipt_number = ?, recipient_name = ?, recipient_cpf = ?, date = ?, 
          description = ?, total_value = ?, payment_method = ?
      WHERE id = ?
    `).bind(
      receipt_number,
      recipient_name,
      recipient_cpf || '',
      date,
      description || '',
      totalValue,
      payment_method || 'Dinheiro',
      id
    ).run()
    
    // Deletar itens antigos
    await env.DB.prepare(`DELETE FROM receipt_items WHERE receipt_id = ?`).bind(id).run()
    
    // Inserir novos itens
    for (const item of items) {
      const quantity = Number(item.quantity) || 0
      const unitValue = Number(item.unit_value) || 0
      const itemTotal = quantity * unitValue
      
      await env.DB.prepare(`
        INSERT INTO receipt_items (receipt_id, description, quantity, unit_value, total_value)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        id,
        item.description,
        quantity,
        unitValue,
        itemTotal
      ).run()
    }
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao atualizar recibo:', error)
    return c.json({ error: 'Erro ao atualizar recibo', details: error.message }, 500)
  }
})

// Deletar recibo
receipts.delete('/:id', async (c) => {
  const { env } = c
  const user = c.get('user') as any
  const id = c.req.param('id')
  
  // Apenas admin pode deletar
  if (user.permission !== 'admin') {
    return c.json({ error: 'Permissão negada' }, 403)
  }
  
  try {
    // Deletar itens primeiro (CASCADE deveria fazer isso, mas garantindo)
    await env.DB.prepare(`DELETE FROM receipt_items WHERE receipt_id = ?`).bind(id).run()
    
    // Deletar recibo
    await env.DB.prepare(`DELETE FROM receipts WHERE id = ?`).bind(id).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar recibo:', error)
    return c.json({ error: 'Erro ao deletar recibo', details: error.message }, 500)
  }
})

export default receipts
