import { Hono } from 'hono';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';

const dashboardRoutes = new Hono<{ Bindings: Bindings }>();

// Aplicar middleware de autenticação
dashboardRoutes.use('*', authMiddleware);

// Rota principal do dashboard
dashboardRoutes.get('/', async (c) => {
  try {
    // Buscar totais de dinheiro e fiado das fichas do mês atual
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const cashResult = await c.env.DB.prepare(`
      SELECT 
        COALESCE(SUM(envelope_money), 0) as total_cash,
        COALESCE(SUM(credit_total), 0) as total_credit,
        COALESCE(SUM(folder_total), 0) as total_general
      FROM weekly_sheets
      WHERE date LIKE ?
    `).bind(`${currentMonth}%`).first();

    // Contar itens em estoque (fichas com mercadoria em estoque)
    const stockResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total_stock
      FROM weekly_sheets
      WHERE stock_merchandise IS NOT NULL AND stock_merchandise != ''
    `).first();

    // Buscar últimas 5 fichas
    const recentSheets = await c.env.DB.prepare(`
      SELECT 
        ws.*,
        s.name as supplier_name
      FROM weekly_sheets ws
      JOIN suppliers s ON ws.supplier_id = s.id
      ORDER BY ws.date DESC, ws.created_at DESC
      LIMIT 5
    `).all();

    // Buscar fornecedores ativos
    const activeSuppliers = await c.env.DB.prepare(`
      SELECT * FROM suppliers
      WHERE status = 'active'
      ORDER BY name
      LIMIT 10
    `).all();

    return c.json({
      totalCash: cashResult?.total_cash || 0,
      totalCredit: cashResult?.total_credit || 0,
      totalStock: stockResult?.total_stock || 0,
      totalGeneral: cashResult?.total_general || 0,
      recentSheets: recentSheets?.results || [],
      activeSuppliers: activeSuppliers?.results || []
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return c.json({ error: 'Erro ao buscar dados' }, 500);
  }
});

// Estatísticas mensais
dashboardRoutes.get('/stats/monthly', async (c) => {
  try {
    const months = 6; // Últimos 6 meses
    const stats = [];
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      
      const result = await c.env.DB.prepare(`
        SELECT 
          COALESCE(SUM(folder_total), 0) as total,
          COUNT(*) as count
        FROM weekly_sheets
        WHERE date LIKE ?
      `).bind(`${monthStr}%`).first();
      
      stats.push({
        month: monthStr,
        total: result?.total || 0,
        count: result?.count || 0
      });
    }
    
    return c.json(stats.reverse());
  } catch (error) {
    return c.json({ error: 'Erro ao buscar estatísticas' }, 500);
  }
});

export default dashboardRoutes;