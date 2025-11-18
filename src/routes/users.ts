import { Hono } from 'hono';
import { z } from 'zod';
import { Bindings } from '../types';
import { authMiddleware } from '../middleware/auth';
import { hashPassword } from '../lib/auth';

// Schemas de validação
const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100),
  permission: z.enum(['view', 'edit', 'admin']),
  is_admin: z.boolean().optional()
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100).optional(),
  permission: z.enum(['view', 'edit', 'admin']),
  is_admin: z.boolean().optional()
});

const usersRoutes = new Hono<{ Bindings: Bindings }>();

// Middleware de autenticação
usersRoutes.use('/*', authMiddleware);

// Middleware para verificar se é admin
const adminOnly = async (c: any, next: any) => {
  const user = c.get('user');
  
  if (!user || !user.isAdmin) {
    return c.json({ error: 'Acesso negado. Apenas administradores.' }, 403);
  }
  
  await next();
};

// Aplicar middleware admin em todas as rotas
usersRoutes.use('/*', adminOnly);

// GET /api/users - Listar todos os usuários
usersRoutes.get('/', async (c) => {
  try {
    const users = await c.env.DB.prepare(`
      SELECT id, name, username, permission, is_admin, created_at, updated_at
      FROM users
      ORDER BY name
    `).all();

    return c.json(users.results);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return c.json({ error: 'Erro ao buscar usuários' }, 500);
  }
});

// GET /api/users/:id - Buscar usuário por ID
usersRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const user = await c.env.DB.prepare(`
      SELECT id, name, username, permission, is_admin, created_at, updated_at
      FROM users
      WHERE id = ?
    `).bind(id).first();

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return c.json({ error: 'Erro ao buscar usuário' }, 500);
  }
});

// POST /api/users - Criar novo usuário
usersRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validar entrada
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ 
        error: 'Dados inválidos', 
        details: validation.error.errors.map(e => e.message)
      }, 400);
    }
    
    const { name, username, password, permission, is_admin } = validation.data;

    // Verificar se username já existe
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).bind(username).first();

    if (existingUser) {
      return c.json({ error: 'Nome de usuário já existe' }, 400);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const result = await c.env.DB.prepare(`
      INSERT INTO users (name, username, password, permission, is_admin)
      VALUES (?, ?, ?, ?, ?)
    `).bind(name, username, hashedPassword, permission, is_admin ? 1 : 0).run();

    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: 'Usuário criado com sucesso'
    }, 201);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return c.json({ error: 'Erro ao criar usuário' }, 500);
  }
});

// PUT /api/users/:id - Atualizar usuário
usersRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Validar entrada
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ 
        error: 'Dados inválidos', 
        details: validation.error.errors.map(e => e.message)
      }, 400);
    }
    
    const { name, username, password, permission, is_admin } = validation.data;

    // Verificar se usuário existe
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE id = ?'
    ).bind(id).first();

    if (!existingUser) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Verificar se username já existe em outro usuário
    const duplicateUsername = await c.env.DB.prepare(
      'SELECT id FROM users WHERE username = ? AND id != ?'
    ).bind(username, id).first();

    if (duplicateUsername) {
      return c.json({ error: 'Nome de usuário já existe' }, 400);
    }

    // Atualizar usuário (com ou sem senha)
    if (password && password.trim() !== '') {
      const hashedPassword = await hashPassword(password);
      await c.env.DB.prepare(`
        UPDATE users 
        SET name = ?, username = ?, password = ?, permission = ?, is_admin = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(name, username, hashedPassword, permission, is_admin ? 1 : 0, id).run();
    } else {
      await c.env.DB.prepare(`
        UPDATE users 
        SET name = ?, username = ?, permission = ?, is_admin = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(name, username, permission, is_admin ? 1 : 0, id).run();
    }

    return c.json({
      success: true,
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return c.json({ error: 'Erro ao atualizar usuário' }, 500);
  }
});

// DELETE /api/users/:id - Deletar usuário
usersRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user');

    // Não permitir que o admin delete a si mesmo
    if (parseInt(id) === currentUser.id) {
      return c.json({ error: 'Você não pode deletar seu próprio usuário' }, 400);
    }

    // Verificar se usuário existe
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE id = ?'
    ).bind(id).first();

    if (!existingUser) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Deletar usuário
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return c.json({ error: 'Erro ao deletar usuário' }, 500);
  }
});

export default usersRoutes;
