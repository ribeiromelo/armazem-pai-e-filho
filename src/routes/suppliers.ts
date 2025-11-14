import { Hono } from 'hono';
import { z } from 'zod';
import { Bindings, AuthPayload } from '../types';
import { authMiddleware } from '../middleware/auth';

const suppliersRoutes = new Hono<{ Bindings: Bindings }>();

// Aplicar middleware de autenticação
suppliersRoutes.use('*', authMiddleware);

// Schema de validação
const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  product_type: z.string().min(1, 'Tipo de produto é obrigatório'),
  status: z.enum(['active', 'settled'])
});

// Listar todos os fornecedores
suppliersRoutes.get('/', async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM suppliers
      ORDER BY name
    `).all();
    
    return c.json(result.results || []);
  } catch (error) {
    return c.json({ error: 'Erro ao buscar fornecedores' }, 500);
  }
});

// Buscar fornecedor por ID
suppliersRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const supplier = await c.env.DB.prepare(`
      SELECT * FROM suppliers WHERE id = ?
    `).bind(id).first();
    
    if (!supplier) {
      return c.json({ error: 'Fornecedor não encontrado' }, 404);
    }
    
    return c.json(supplier);
  } catch (error) {
    return c.json({ error: 'Erro ao buscar fornecedor' }, 500);
  }
});

// Criar novo fornecedor
suppliersRoutes.post('/', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Verificar permissão
    if (user.permission === 'view') {
      return c.json({ error: 'Sem permissão para criar fornecedores' }, 403);
    }
    
    const body = await c.req.json();
    const data = supplierSchema.parse(body);
    
    const result = await c.env.DB.prepare(`
      INSERT INTO suppliers (name, product_type, status)
      VALUES (?, ?, ?)
    `).bind(data.name, data.product_type, data.status).run();
    
    return c.json({
      id: result.meta.last_row_id,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    return c.json({ error: 'Erro ao criar fornecedor' }, 500);
  }
});

// Atualizar fornecedor
suppliersRoutes.put('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Verificar permissão
    if (user.permission === 'view') {
      return c.json({ error: 'Sem permissão para editar fornecedores' }, 403);
    }
    
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = supplierSchema.parse(body);
    
    // Verificar se existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM suppliers WHERE id = ?'
    ).bind(id).first();
    
    if (!existing) {
      return c.json({ error: 'Fornecedor não encontrado' }, 404);
    }
    
    await c.env.DB.prepare(`
      UPDATE suppliers
      SET name = ?, product_type = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(data.name, data.product_type, data.status, id).run();
    
    return c.json({ success: true, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    return c.json({ error: 'Erro ao atualizar fornecedor' }, 500);
  }
});

// Deletar fornecedor
suppliersRoutes.delete('/:id', async (c) => {
  try {
    const user = c.get('user') as AuthPayload;
    
    // Apenas admin pode deletar
    if (user.permission !== 'admin') {
      return c.json({ error: 'Sem permissão para excluir fornecedores' }, 403);
    }
    
    const id = c.req.param('id');
    
    // Verificar se tem fichas associadas
    const hasSheets = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM weekly_sheets WHERE supplier_id = ?
    `).bind(id).first();
    
    if (hasSheets && hasSheets.count > 0) {
      return c.json({ 
        error: 'Não é possível excluir fornecedor com fichas associadas' 
      }, 400);
    }
    
    await c.env.DB.prepare(
      'DELETE FROM suppliers WHERE id = ?'
    ).bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Erro ao excluir fornecedor' }, 500);
  }
});

export default suppliersRoutes;