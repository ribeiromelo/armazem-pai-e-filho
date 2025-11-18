import { Hono } from 'hono';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';

const financialRoutes = new Hono<{ Bindings: Bindings }>();

// Middleware de autenticação
financialRoutes.use('/*', authMiddleware);

// Função auxiliar para extrair valores numéricos de texto
function extractNumericValue(text: string | null): number {
  if (!text) return 0;
  // Remove tudo exceto números, vírgulas e pontos
  const cleaned = text.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto para parseFloat
  const normalized = cleaned.replace(',', '.');
  const value = parseFloat(normalized);
  return isNaN(value) ? 0 : value;
}

// GET /api/financial/overview - Visão geral (cards de resumo)
financialRoutes.get('/overview', async (c) => {
  try {
    const { year, month } = c.req.query();
    
    // 1. Buscar última ficha de cada fornecedor para fotografia atual
    const lastSheets = await c.env.DB.prepare(`
      SELECT 
        ws.supplier_id,
        s.name as supplier_name,
        s.product_type,
        s.status,
        ws.stock_merchandise,
        ws.credit_text,
        ws.envelope_money,
        ws.folder_total,
        ws.date
      FROM weekly_sheets ws
      INNER JOIN suppliers s ON ws.supplier_id = s.id
      INNER JOIN (
        SELECT supplier_id, MAX(date) as max_date
        FROM weekly_sheets
        GROUP BY supplier_id
      ) latest ON ws.supplier_id = latest.supplier_id AND ws.date = latest.max_date
      ORDER BY s.name
    `).all();

    let totalCash = 0;
    let totalStock = 0;
    let totalCredit = 0;
    let totalGeneral = 0;

    lastSheets.results.forEach((sheet: any) => {
      totalCash += sheet.envelope_money || 0;
      totalStock += extractNumericValue(sheet.stock_merchandise);
      totalCredit += extractNumericValue(sheet.credit_text);
      totalGeneral += sheet.folder_total || 0;
    });

    // 2. Calcular faturamento do período (feiras + recibos)
    let periodFilter = '';
    let periodParams: any[] = [];

    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
      periodFilter = 'WHERE date >= ? AND date <= ?';
      periodParams = [startDate, endDate];
    }

    // Faturamento das feiras
    const fairsQuery = periodFilter 
      ? `SELECT COALESCE(SUM(total_value), 0) as total FROM fairs ${periodFilter}`
      : `SELECT COALESCE(SUM(total_value), 0) as total FROM fairs 
         WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
    
    const faiirRevenue = await c.env.DB.prepare(fairsQuery)
      .bind(...periodParams)
      .first();

    // Faturamento dos recibos
    const receiptsQuery = periodFilter
      ? `SELECT COALESCE(SUM(total_value), 0) as total FROM receipts ${periodFilter}`
      : `SELECT COALESCE(SUM(total_value), 0) as total FROM receipts 
         WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
    
    const receiptsRevenue = await c.env.DB.prepare(receiptsQuery)
      .bind(...periodParams)
      .first();

    // Compras do período (fichas)
    const sheetsQuery = periodFilter
      ? `SELECT COALESCE(SUM(folder_total), 0) as total FROM weekly_sheets ${periodFilter}`
      : `SELECT COALESCE(SUM(folder_total), 0) as total FROM weekly_sheets 
         WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
    
    const purchases = await c.env.DB.prepare(sheetsQuery)
      .bind(...periodParams)
      .first();

    const totalRevenue = (faiirRevenue?.total || 0) + (receiptsRevenue?.total || 0);
    const totalPurchases = purchases?.total || 0;
    const balance = totalRevenue - totalPurchases;

    return c.json({
      // Fotografia atual (última ficha de cada fornecedor)
      current: {
        total_cash: totalCash,
        total_stock: totalStock,
        total_credit: totalCredit,
        total_general: totalGeneral
      },
      // Período selecionado
      period: {
        fairs_revenue: faiirRevenue?.total || 0,
        receipts_revenue: receiptsRevenue?.total || 0,
        total_revenue: totalRevenue,
        total_purchases: totalPurchases,
        balance: balance
      }
    });
  } catch (error) {
    console.error('Erro ao buscar overview financeiro:', error);
    return c.json({ error: 'Erro ao buscar dados financeiros' }, 500);
  }
});

// GET /api/financial/suppliers-summary - Situação das pastas por fornecedor
financialRoutes.get('/suppliers-summary', async (c) => {
  try {
    // Buscar última ficha de cada fornecedor
    const lastSheets = await c.env.DB.prepare(`
      SELECT 
        ws.supplier_id,
        s.name as supplier_name,
        s.product_type,
        s.status,
        ws.stock_merchandise,
        ws.credit_text,
        ws.envelope_money,
        ws.folder_total,
        ws.date
      FROM weekly_sheets ws
      INNER JOIN suppliers s ON ws.supplier_id = s.id
      INNER JOIN (
        SELECT supplier_id, MAX(date) as max_date
        FROM weekly_sheets
        GROUP BY supplier_id
      ) latest ON ws.supplier_id = latest.supplier_id AND ws.date = latest.max_date
      ORDER BY s.name
    `).all();

    const summary = lastSheets.results.map((sheet: any) => ({
      supplier_id: sheet.supplier_id,
      supplier_name: sheet.supplier_name,
      product_type: sheet.product_type,
      stock_value: extractNumericValue(sheet.stock_merchandise),
      credit_value: extractNumericValue(sheet.credit_text),
      cash: sheet.envelope_money || 0,
      total: sheet.folder_total || 0,
      status: sheet.status,
      last_update: sheet.date
    }));

    return c.json(summary);
  } catch (error) {
    console.error('Erro ao buscar resumo de fornecedores:', error);
    return c.json({ error: 'Erro ao buscar resumo de fornecedores' }, 500);
  }
});

// GET /api/financial/period-summary - Resumo detalhado do período
financialRoutes.get('/period-summary', async (c) => {
  try {
    const { start_date, end_date, supplier_id } = c.req.query();

    let dateFilter = '';
    let params: any[] = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE date >= ? AND date <= ?';
      params = [start_date, end_date];
    } else {
      // Padrão: mês atual
      dateFilter = "WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')";
    }

    // Adicionar filtro de fornecedor se especificado
    let supplierFilter = '';
    if (supplier_id) {
      supplierFilter = params.length > 0 
        ? ' AND supplier_id = ?' 
        : ' WHERE supplier_id = ?';
      params.push(supplier_id);
    }

    // Feiras do período
    const fairs = await c.env.DB.prepare(
      `SELECT COALESCE(SUM(total_value), 0) as total, COUNT(*) as count 
       FROM fairs ${dateFilter}`
    ).bind(...params.slice(0, 2)).first();

    // Recibos do período
    const receipts = await c.env.DB.prepare(
      `SELECT COALESCE(SUM(total_value), 0) as total, COUNT(*) as count 
       FROM receipts ${dateFilter}`
    ).bind(...params.slice(0, 2)).first();

    // Fichas (compras) do período
    const sheets = await c.env.DB.prepare(
      `SELECT COALESCE(SUM(folder_total), 0) as total, COUNT(*) as count 
       FROM weekly_sheets ${dateFilter}${supplierFilter}`
    ).bind(...params).first();

    const totalRevenue = (fairs?.total || 0) + (receipts?.total || 0);
    const totalPurchases = sheets?.total || 0;

    return c.json({
      fairs: {
        total: fairs?.total || 0,
        count: fairs?.count || 0
      },
      receipts: {
        total: receipts?.total || 0,
        count: receipts?.count || 0
      },
      total_revenue: totalRevenue,
      purchases: {
        total: totalPurchases,
        count: sheets?.count || 0
      },
      balance: totalRevenue - totalPurchases
    });
  } catch (error) {
    console.error('Erro ao buscar resumo do período:', error);
    return c.json({ error: 'Erro ao buscar resumo do período' }, 500);
  }
});

// GET /api/financial/chart-data - Dados para gráfico mensal (últimos 6 meses)
// OTIMIZADO: Query única ao invés de loop
financialRoutes.get('/chart-data', async (c) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startDate = sixMonthsAgo.toISOString().split('T')[0];

    // Query única para buscar todos os dados dos últimos 6 meses
    const [fairsData, receiptsData, purchasesData] = await Promise.all([
      c.env.DB.prepare(
        `SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(total_value), 0) as total 
         FROM fairs 
         WHERE date >= ?
         GROUP BY strftime('%Y-%m', date)`
      ).bind(startDate).all(),
      
      c.env.DB.prepare(
        `SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(total_value), 0) as total 
         FROM receipts 
         WHERE date >= ?
         GROUP BY strftime('%Y-%m', date)`
      ).bind(startDate).all(),
      
      c.env.DB.prepare(
        `SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(folder_total), 0) as total 
         FROM weekly_sheets 
         WHERE date >= ?
         GROUP BY strftime('%Y-%m', date)`
      ).bind(startDate).all()
    ]);

    // Criar mapa de dados por mês
    const fairsMap = new Map((fairsData.results as any[]).map(r => [r.month, r.total]));
    const receiptsMap = new Map((receiptsData.results as any[]).map(r => [r.month, r.total]));
    const purchasesMap = new Map((purchasesData.results as any[]).map(r => [r.month, r.total]));

    // Gerar dados para últimos 6 meses
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const fairsRevenue = fairsMap.get(monthKey) || 0;
      const receiptsRevenue = receiptsMap.get(monthKey) || 0;
      const purchases = purchasesMap.get(monthKey) || 0;
      const revenue = fairsRevenue + receiptsRevenue;

      monthsData.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        revenue: revenue,
        purchases: purchases,
        balance: revenue - purchases
      });
    }

    return c.json(monthsData);
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    return c.json({ error: 'Erro ao buscar dados do gráfico' }, 500);
  }
});

export default financialRoutes;
