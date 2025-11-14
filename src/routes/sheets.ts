import { Hono } from 'hono';
import { z } from 'zod';
import { Bindings, AuthPayload } from '../types';
import { authMiddleware } from '../middleware/auth';

const sheetsRoutes = new Hono<{ Bindings: Bindings }>();

// Aplicar middleware de autenticação
sheetsRoutes.use('*', authMiddleware);

// Schema de validação
const stockItemSchema = z.object({
  quantity: z.number().min(0),
  item_name: z.string().min(1),
  unit_value: z.number().min(0)
});

const sheetSchema = z.object({
  supplier_id: z.number(),
  date: z.string(),
  double_checked: z.boolean().optional().default(false),
  credit_text: z.string().optional(),
  envelope_money: z.number().min(0).optional().default(0),
  observations: z.string().optional(),
  stock_items: z.array(stockItemSchema).optional().default([])
});

// Função para extrair valores do texto de fiado (CORRIGIDA)
function extractCreditValues(text: string): number {
  if (!text) return 0;
  
  // Regex melhorada - procura por números que podem estar precedidos por R$
  // Captura números como: 2000, 1000.50, 1.000,00, R$2000, R$ 1.000,00
  const regex = /(?:R\$\s*)?([0-9]+(?:[.,]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/gi;
  let total = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Limpar e converter o valor para número
    let value = match[1]
      .replace(/\./g, '') // Remover pontos de milhar
      .replace(',', '.'); // Trocar vírgula decimal por ponto
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      total += numValue;
    }
  }
  
  return total;
}

// Função para extrair ajustes das observações (+ ou -)
function extractObservationsAdjustment(text: string): number {
  if (!text) return 0;
  
  // Regex para capturar valores com + ou - na frente
  const regex = /([+-])\s*(?:R\$\s*)?([0-9]+(?:[.,]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/gi;
  let adjustment = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const sign = match[1];
    let value = match[2]
      .replace(/\./g, '') // Remover pontos de milhar
      .replace(',', '.'); // Trocar vírgula decimal por ponto
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      adjustment += sign === '+' ? numValue : -numValue;
    }
  }
  
  return adjustment;
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
    
    // Buscar itens de estoque para cada ficha
    const sheetsWithItems = await Promise.all((result.results || []).map(async (sheet: any) => {
      const items = await c.env.DB.prepare(
        'SELECT * FROM sheet_stock_items WHERE sheet_id = ?'
      ).bind(sheet.id).all();
      
      return {
        ...sheet,
        stock_items: items.results || []
      };
    }));
    
    return c.json(sheetsWithItems);
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
    
    // Buscar itens de estoque
    const items = await c.env.DB.prepare(
      'SELECT * FROM sheet_stock_items WHERE sheet_id = ?'
    ).bind(id).all();
    
    return c.json({
      ...sheet,
      stock_items: items.results || []
    });
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
    
    // Extrair ajustes das observações
    const observationsAdjustment = extractObservationsAdjustment(data.observations || '');
    
    // Calcular total do estoque
    let stockTotal = 0;
    if (data.stock_items && data.stock_items.length > 0) {
      stockTotal = data.stock_items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_value);
      }, 0);
    }
    
    // Calcular total da pasta (estoque + fiado + dinheiro + ajustes)
    const folderTotal = stockTotal + creditTotal + (data.envelope_money || 0) + observationsAdjustment;
    
    // Primeiro, criar tabela de itens se não existir
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS sheet_stock_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheet_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        unit_value DECIMAL(10,2) NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sheet_id) REFERENCES weekly_sheets(id) ON DELETE CASCADE
      )
    `).run();
    
    // Inserir a ficha
    const result = await c.env.DB.prepare(`
      INSERT INTO weekly_sheets (
        supplier_id, date, double_checked, stock_merchandise,
        credit_text, credit_total, envelope_money, folder_total,
        observations, observations_adjustment, stock_total, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.supplier_id,
      data.date,
      data.double_checked,
      null, // stock_merchandise agora será calculado
      data.credit_text || null,
      creditTotal,
      data.envelope_money || 0,
      folderTotal,
      data.observations || null,
      observationsAdjustment,
      stockTotal,
      user.userId
    ).run();
    
    const sheetId = result.meta.last_row_id;
    
    // Inserir itens de estoque
    if (data.stock_items && data.stock_items.length > 0) {
      for (const item of data.stock_items) {
        const itemTotal = item.quantity * item.unit_value;
        await c.env.DB.prepare(`
          INSERT INTO sheet_stock_items (
            sheet_id, quantity, item_name, unit_value, total_value
          )
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          sheetId,
          item.quantity,
          item.item_name,
          item.unit_value,
          itemTotal
        ).run();
      }
    }
    
    return c.json({
      id: sheetId,
      ...data,
      credit_total: creditTotal,
      folder_total: folderTotal,
      stock_total: stockTotal,
      observations_adjustment: observationsAdjustment,
      created_at: new Date().toISOString()
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    console.error('Erro ao criar ficha:', error);
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
    
    // Extrair valores
    const creditTotal = extractCreditValues(data.credit_text || '');
    const observationsAdjustment = extractObservationsAdjustment(data.observations || '');
    
    // Calcular total do estoque
    let stockTotal = 0;
    if (data.stock_items && data.stock_items.length > 0) {
      stockTotal = data.stock_items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_value);
      }, 0);
    }
    
    // Calcular total da pasta incluindo estoque
    const folderTotal = stockTotal + creditTotal + (data.envelope_money || 0) + observationsAdjustment;
    
    // Atualizar ficha
    await c.env.DB.prepare(`
      UPDATE weekly_sheets
      SET 
        supplier_id = ?,
        date = ?,
        double_checked = ?,
        credit_text = ?,
        credit_total = ?,
        envelope_money = ?,
        folder_total = ?,
        observations = ?,
        observations_adjustment = ?,
        stock_total = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.supplier_id,
      data.date,
      data.double_checked,
      data.credit_text || null,
      creditTotal,
      data.envelope_money || 0,
      folderTotal,
      data.observations || null,
      observationsAdjustment,
      stockTotal,
      id
    ).run();
    
    // Deletar itens antigos e inserir novos
    await c.env.DB.prepare(
      'DELETE FROM sheet_stock_items WHERE sheet_id = ?'
    ).bind(id).run();
    
    if (data.stock_items && data.stock_items.length > 0) {
      for (const item of data.stock_items) {
        const itemTotal = item.quantity * item.unit_value;
        await c.env.DB.prepare(`
          INSERT INTO sheet_stock_items (
            sheet_id, quantity, item_name, unit_value, total_value
          )
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          id,
          item.quantity,
          item.item_name,
          item.unit_value,
          itemTotal
        ).run();
      }
    }
    
    return c.json({ 
      success: true,
      credit_total: creditTotal,
      folder_total: folderTotal,
      stock_total: stockTotal,
      observations_adjustment: observationsAdjustment
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
        SUM(stock_total) as total_stock,
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
      total_stock: result?.total_stock || 0,
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