import { Hono } from 'hono';
import { z } from 'zod';
import { Bindings, AuthPayload } from '../types';
import { authMiddleware } from '../middleware/auth';

const sheetsRoutes = new Hono<{ Bindings: Bindings }>();

// Aplicar middleware de autenticação
sheetsRoutes.use('*', authMiddleware);

// Schema de validação
const sheetSchema = z.object({
  supplier_id: z.number(),
  date: z.string(),
  double_checked: z.boolean().optional().default(false),
  stock_merchandise: z.string().optional(),
  credit_text: z.string().optional(),
  envelope_money: z.number().min(0).optional().default(0)
});

// Função para extrair valores do texto de fiado
function extractCreditValues(text: string): number {
  if (!text) return 0;
  
  // Regex para encontrar valores monetários (R$ 1.000,00 ou R$1000 ou 1000.00)
  const regex = /R?\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:[.,]\d{2})?)/g;
  let total = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Limpar e converter o valor para número
    let value = match[1]
      .replace(/\./g, '') // Remover pontos de milhar
      .replace(',', '.'); // Trocar vírgula por ponto
    
    total += parseFloat(value) || 0;
  }
  
  return total;
}

// Listar todas as fichas com filtros
sheetsRoutes.get('/', async (c) => {
  try {
    const supplierId = c.req.query('supplier_id');
    const month = c.req.query('month'); // formato: YYYY-MM
    
    let query = `
      SELECT 
        ws.*,
        s.name as supplier_name,
        s.product_type,
        u.name as created_by_name
      FROM weekly_sheets ws
      JOIN suppliers s ON ws.supplier_id = s.id
      JOIN users u ON ws.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (supplierId) {
      query += ' AND ws.supplier_id = ?';
      params.push(supplierId);
    }
    
    if (month) {
      query += ' AND ws.date LIKE ?';
      params.push(`${month}%`);
    }
    
    query += ' ORDER BY ws.date DESC, ws.created_at DESC';
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json(result.results || []);
  } catch (error) {
    return c.json({ error: 'Erro ao buscar fichas' }, 500);
  }
});

// Buscar ficha por ID
sheetsRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const sheet = await c.env.DB.prepare(`
      SELECT 
        ws.*,
        s.name as supplier_name,
        s.product_type,
        u.name as created_by_name
      FROM weekly_sheets ws
      JOIN suppliers s ON ws.supplier_id = s.id
      JOIN users u ON ws.created_by = u.id
      WHERE ws.id = ?
    `).bind(id).first();
    
    if (!sheet) {
      return c.json({ error: 'Ficha não encontrada' }, 404);
    }
    
    return c.json(sheet);
  } catch (error) {
    return c.json({ error: 'Erro ao buscar ficha' }, 500);
  }
});

// Criar nova ficha
sheetsRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Verificar permissão
    if (user.permission === 'view') {
      return c.json({ error: 'Sem permissão para criar fichas' }, 403);
    }
    
    const body = await c.req.json();
    const data = sheetSchema.parse(body);
    
    // Extrair valores do texto de fiado
    const creditTotal = extractCreditValues(data.credit_text || '');
    const folderTotal = creditTotal + (data.envelope_money || 0);
    
    const result = await c.env.DB.prepare(`
      INSERT INTO weekly_sheets (
        supplier_id, date, double_checked, stock_merchandise,
        credit_text, credit_total, envelope_money, folder_total,
        observations, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id,
      data.date,
      data.double_checked,
      data.stock_merchandise || null,
      data.credit_text || null,
      creditTotal,
      data.envelope_money || 0,
      folderTotal,
      body.observations || null,
      user.userId
    ).run();
    
    return c.json({
      id: result.meta.last_row_id,
      ...data,
      credit_total: creditTotal,
      folder_total: folderTotal,
      created_at: new Date().toISOString()
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    return c.json({ error: 'Erro ao criar ficha' }, 500);
  }
});

// Atualizar ficha
sheetsRoutes.put('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Verificar permissão
    if (user.permission === 'view') {
      return c.json({ error: 'Sem permissão para editar fichas' }, 403);
    }
    
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = sheetSchema.parse(body);
    
    // Verificar se existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM weekly_sheets WHERE id = ?'
    ).bind(id).first();
    
    if (!existing) {
      return c.json({ error: 'Ficha não encontrada' }, 404);
    }
    
    // Extrair valores do texto de fiado
    const creditTotal = extractCreditValues(data.credit_text || '');
    const folderTotal = creditTotal + (data.envelope_money || 0);
    
    await c.env.DB.prepare(`
      UPDATE weekly_sheets
      SET 
        supplier_id = ?,
        date = ?,
        double_checked = ?,
        stock_merchandise = ?,
        credit_text = ?,
        credit_total = ?,
        envelope_money = ?,
        folder_total = ?,
        observations = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.supplier_id,
      data.date,
      data.double_checked,
      data.stock_merchandise || null,
      data.credit_text || null,
      creditTotal,
      data.envelope_money || 0,
      folderTotal,
      body.observations || null,
      id
    ).run();
    
    return c.json({ 
      success: true,
      credit_total: creditTotal,
      folder_total: folderTotal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    return c.json({ error: 'Erro ao atualizar ficha' }, 500);
  }
});

// Deletar ficha
sheetsRoutes.delete('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Apenas admin pode deletar
    if (user.permission !== 'admin') {
      return c.json({ error: 'Sem permissão para excluir fichas' }, 403);
    }
    
    const id = c.req.param('id');
    
    await c.env.DB.prepare(
      'DELETE FROM weekly_sheets WHERE id = ?'
    ).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Erro ao excluir ficha' }, 500);
  }
});

// Estatísticas das fichas
sheetsRoutes.get('/stats/summary', async (c) => {
  try {
    const supplierId = c.req.query('supplier_id');
    const month = c.req.query('month');
    
    let query = `
      SELECT 
        COUNT(*) as total_sheets,
        SUM(credit_total) as total_credit,
        SUM(envelope_money) as total_cash,
        SUM(folder_total) as total_general,
        COUNT(CASE WHEN double_checked = 1 THEN 1 END) as checked_count
      FROM weekly_sheets
      WHERE 1=1
    `;
    
    const params = [];
    
    if (supplierId) {
      query += ' AND supplier_id = ?';
      params.push(supplierId);
    }
    
    if (month) {
      query += ' AND date LIKE ?';
      params.push(`${month}%`);
    }
    
    const result = await c.env.DB.prepare(query).bind(...params).first();
    
    return c.json({
      total_sheets: result?.total_sheets || 0,
      total_credit: result?.total_credit || 0,
      total_cash: result?.total_cash || 0,
      total_general: result?.total_general || 0,
      checked_count: result?.checked_count || 0,
      checked_percentage: result?.total_sheets > 0 
        ? ((result?.checked_count || 0) / result.total_sheets * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    return c.json({ error: 'Erro ao buscar estatísticas' }, 500);
  }
});

export default sheetsRoutes;